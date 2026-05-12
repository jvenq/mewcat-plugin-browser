import { useAtomValue } from "jotai"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheetManager } from "styled-components"

import { ImageTranslateButton } from "@/components/ImageTranslateButton"
import { plasmoShadowRootContainerId } from "@/constants"
import {
    ensureCanvasHookInjected,
    ensureCanvasId,
    queryCanvasMeta
} from "@/contents/bridges/canvas-hook-bridge"
import {
    translateImageViaBackground,
    validateImage
} from "@/services/imageTranslation"
import { configAtom } from "@/state"
import type { CanvasHookMeta } from "@/types/canvas-hook"
import { Toast, ToastType } from "@/utils/toast"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: false
}

export const getShadowHostId = () => "plasmo-image-translate"

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body

// 让 shadow host 对鼠标事件透明，避免拦截页面图片的 hover 事件
export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = `:host { pointer-events: none !important; }`
    return style
}

interface ImageTranslateState {
    currentTarget: HTMLImageElement | HTMLCanvasElement | null
    buttonVisible: boolean
    buttonPosition: { x: number; y: number }
    translating: boolean
    translatedImageUrl: string | null
}

interface CanvasOverlayRecord {
    canvas: HTMLCanvasElement
    overlay: HTMLImageElement
    updatePosition: () => void
    cleanup: () => void
}

function isImageElement(value: EventTarget | null): value is HTMLImageElement {
    return value instanceof HTMLImageElement
}

function isCanvasElement(
    value: EventTarget | null
): value is HTMLCanvasElement {
    return value instanceof HTMLCanvasElement
}

// 保护 img.src 及祖先 background-image 不被页面框架覆盖
interface BgGuardEntry {
    element: HTMLElement
    originalBg: string
    observer: MutationObserver
}

interface ImageGuardRecord {
    srcObserver: MutationObserver
    bgGuards: BgGuardEntry[]
}

const imageGuardRecords = new WeakMap<HTMLImageElement, ImageGuardRecord>()

/**
 * 查找附近 DOM 中 background-image 包含原图 URL 的元素。
 * X.com 等站点在 img 的兄弟/堂兄弟位置放 div 用 background-image 显示图片，
 * 仅修改 img.src 不会影响视觉。
 *
 * 策略：向上走 8 层找到容器，用 CSS 属性选择器在容器内搜索。
 */
function findBgImageElements(
    img: HTMLImageElement,
    originalSrc: string
): HTMLElement[] {
    if (!originalSrc) {
        return []
    }

    // 提取 pathname 作为匹配键（足够唯一且不含 CSS 特殊字符）
    let pathKey = ""
    try {
        pathKey = new URL(originalSrc).pathname
    } catch {
        return []
    }
    if (!pathKey || pathKey === "/") {
        return []
    }

    // 向上走 8 层找到合理的容器
    let container: HTMLElement = img
    for (let i = 0; i < 8 && container.parentElement; i++) {
        container = container.parentElement
    }

    // CSS 属性选择器 [style*="..."] 是浏览器原生的快速搜索
    const escapedKey = pathKey.replace(/["\\]/g, "\\$&")
    try {
        const candidates = container.querySelectorAll<HTMLElement>(
            `[style*="${escapedKey}"]`
        )
        return Array.from(candidates).filter(
            el =>
                el !== img &&
                el.style.backgroundImage &&
                el.style.backgroundImage.includes(pathKey)
        )
    } catch {
        return []
    }
}

function guardImageSrc(
    img: HTMLImageElement,
    translatedUrl: string,
    originalSrc: string
) {
    clearImageSrcGuard(img)

    if (img.srcset) {
        img.dataset.originalSrcset = img.srcset
        img.removeAttribute("srcset")
    }

    // On sites like X.com, the visible image is rendered via background-image
    // on a sibling div, while the <img> itself may be invisible (opacity:0 via CSS).
    // Strategy: hide bg-image elements AND force the <img> to be visible.
    const bgElements = findBgImageElements(img, originalSrc)
    const hasBgOverlay = bgElements.length > 0

    // Guard img.src + img.style (React may reset inline styles)
    const srcObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (
                m.attributeName === "src" &&
                img.dataset.originalSrc &&
                img.src !== translatedUrl
            ) {
                img.src = translatedUrl
            }
            if (
                m.attributeName === "srcset" &&
                img.srcset &&
                img.dataset.originalSrcset !== undefined
            ) {
                img.removeAttribute("srcset")
            }
            if (m.attributeName === "style" && hasBgOverlay) {
                if (img.style.opacity !== "1") {
                    img.style.setProperty("opacity", "1", "important")
                }
                if (img.style.zIndex !== "1") {
                    img.style.setProperty("z-index", "1", "important")
                }
            }
        }
    })
    srcObserver.observe(img, {
        attributes: true,
        attributeFilter: ["src", "srcset", ...(hasBgOverlay ? ["style"] : [])]
    })
    const bgGuards: BgGuardEntry[] = []

    if (bgElements.length > 0) {
        // Force the <img> to be visible (X.com hides it via CSS class)
        img.style.setProperty("opacity", "1", "important")
        img.style.setProperty("z-index", "1", "important")
    }

    for (const el of bgElements) {
        const origOpacity = el.style.opacity
        el.style.setProperty("opacity", "0", "important")

        const bgObserver = new MutationObserver(() => {
            if (el.style.opacity !== "0") {
                el.style.setProperty("opacity", "0", "important")
            }
        })
        bgObserver.observe(el, {
            attributes: true,
            attributeFilter: ["style"]
        })

        bgGuards.push({
            element: el,
            originalBg: origOpacity,
            observer: bgObserver
        })
    }

    imageGuardRecords.set(img, { srcObserver, bgGuards })
}

function clearImageSrcGuard(img: HTMLImageElement) {
    const record = imageGuardRecords.get(img)
    if (record) {
        record.srcObserver.disconnect()

        // Restore <img> visibility overrides
        if (record.bgGuards.length > 0) {
            img.style.removeProperty("opacity")
            img.style.removeProperty("z-index")
        }

        for (const bg of record.bgGuards) {
            bg.observer.disconnect()
            if (bg.originalBg) {
                bg.element.style.opacity = bg.originalBg
            } else {
                bg.element.style.removeProperty("opacity")
            }
        }
        imageGuardRecords.delete(img)
    }

    if (img.dataset.originalSrcset) {
        img.srcset = img.dataset.originalSrcset
        delete img.dataset.originalSrcset
    }
}

const ImageTranslate: React.FC = () => {
    const config = useAtomValue(configAtom)
    const [state, setState] = useState<ImageTranslateState>({
        currentTarget: null,
        buttonVisible: false,
        buttonPosition: { x: 0, y: 0 },
        translating: false,
        translatedImageUrl: null
    })

    // 用于存储隐藏按钮的定时器
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    // 用 ref 跟踪状态，避免事件 handler 闭包捕获旧值
    const currentTargetRef = useRef<
        HTMLImageElement | HTMLCanvasElement | null
    >(null)
    currentTargetRef.current = state.currentTarget
    const translatingRef = useRef(false)
    translatingRef.current = state.translating
    const canvasOverlayMapRef = useRef<Map<string, CanvasOverlayRecord>>(
        new Map()
    )

    // 计算按钮位置（图片右下角）
    const calculateButtonPosition = useCallback(
        (
            target: HTMLImageElement | HTMLCanvasElement
        ): { x: number; y: number } => {
            const rect = target.getBoundingClientRect()
            return {
                x: rect.right - 50, // 距离右边 10px
                y: rect.bottom - 50 // 距离底部 10px
            }
        },
        []
    )

    // 清除隐藏定时器
    const clearHideTimeout = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
        }
    }, [])

    const getCanvasOverlayRecord = useCallback((canvas: HTMLCanvasElement) => {
        const canvasId = ensureCanvasId(canvas)
        return canvasOverlayMapRef.current.get(canvasId) || null
    }, [])

    const removeCanvasOverlay = useCallback((canvas: HTMLCanvasElement) => {
        const canvasId = ensureCanvasId(canvas)
        const record = canvasOverlayMapRef.current.get(canvasId)
        if (!record) {
            return
        }
        record.cleanup()
        canvasOverlayMapRef.current.delete(canvasId)
    }, [])

    const applyCanvasOverlay = useCallback(
        (canvas: HTMLCanvasElement, translatedUrl: string) => {
            const canvasId = ensureCanvasId(canvas)
            const existing = canvasOverlayMapRef.current.get(canvasId)
            if (existing) {
                canvas.style.opacity = ""
                existing.overlay.style.display = "none"
                const onLoad = () => {
                    canvas.style.opacity = "0"
                    existing.updatePosition()
                }
                const onError = () => {
                    console.warn(
                        "[ImageTranslate] Canvas overlay 更新失败，已回滚"
                    )
                    const record = canvasOverlayMapRef.current.get(canvasId)
                    if (record) {
                        record.cleanup()
                        canvasOverlayMapRef.current.delete(canvasId)
                    }
                }
                existing.overlay.addEventListener("load", onLoad, {
                    once: true
                })
                existing.overlay.addEventListener("error", onError, {
                    once: true
                })
                existing.overlay.src = translatedUrl
                return
            }

            const originalOpacity = canvas.style.opacity
            const overlay = document.createElement("img")
            overlay.alt = "Translated canvas overlay"
            overlay.setAttribute("data-mewcat-canvas-overlay-id", canvasId)
            overlay.style.position = "fixed"
            overlay.style.pointerEvents = "none"
            overlay.style.zIndex = "2147483000"
            overlay.style.objectFit = "fill"
            overlay.style.userSelect = "none"
            let overlayLoaded = false

            const updatePosition = () => {
                if (!document.contains(canvas)) {
                    return
                }
                if (!overlayLoaded) {
                    overlay.style.display = "none"
                    return
                }
                const rect = canvas.getBoundingClientRect()
                if (rect.width <= 0 || rect.height <= 0) {
                    overlay.style.display = "none"
                    return
                }
                overlay.style.display = "block"
                overlay.style.left = `${rect.left}px`
                overlay.style.top = `${rect.top}px`
                overlay.style.width = `${rect.width}px`
                overlay.style.height = `${rect.height}px`
            }

            const handleViewportChange = () => {
                updatePosition()
            }

            const handleOverlayLoad = () => {
                overlayLoaded = true
                canvas.style.opacity = "0"
                updatePosition()
            }

            const handleOverlayError = () => {
                console.warn("[ImageTranslate] Canvas overlay 加载失败，已回滚")
                const record = canvasOverlayMapRef.current.get(canvasId)
                if (record) {
                    record.cleanup()
                    canvasOverlayMapRef.current.delete(canvasId)
                }
            }

            const intervalId = window.setInterval(() => {
                if (!document.contains(canvas)) {
                    const record = canvasOverlayMapRef.current.get(canvasId)
                    if (record) {
                        record.cleanup()
                        canvasOverlayMapRef.current.delete(canvasId)
                    }
                    return
                }
                updatePosition()
            }, 400)

            const cleanup = () => {
                window.removeEventListener("scroll", handleViewportChange, true)
                window.removeEventListener("resize", handleViewportChange, true)
                overlay.removeEventListener("load", handleOverlayLoad)
                overlay.removeEventListener("error", handleOverlayError)
                clearInterval(intervalId)
                if (overlay.parentElement) {
                    overlay.parentElement.removeChild(overlay)
                }
                canvas.style.opacity = originalOpacity
            }

            window.addEventListener("scroll", handleViewportChange, true)
            window.addEventListener("resize", handleViewportChange, true)
            overlay.addEventListener("load", handleOverlayLoad)
            overlay.addEventListener("error", handleOverlayError)
            ;(document.body || document.documentElement).appendChild(overlay)
            updatePosition()

            canvasOverlayMapRef.current.set(canvasId, {
                canvas,
                overlay,
                updatePosition,
                cleanup
            })

            overlay.src = translatedUrl
        },
        []
    )

    const getCanvasMetaForTranslate = useCallback(
        async (canvas: HTMLCanvasElement): Promise<CanvasHookMeta | null> => {
            await ensureCanvasHookInjected(window.location.href)
            return queryCanvasMeta(canvas)
        },
        []
    )

    // 处理图片悬浮（用 ref 读取状态，保持 callback 引用稳定）
    const handleImageHover = useCallback(
        (e: MouseEvent) => {
            if (!config.enableImageTranslateButton) {
                return
            }

            const target = e.target as HTMLElement
            if (!(isImageElement(target) || isCanvasElement(target))) {
                return
            }

            const targetElement = target

            // 验证图片
            const validation = validateImage(targetElement)
            if (!validation.valid) {
                return
            }

            // 如果正在翻译当前图片，不更新
            if (
                translatingRef.current &&
                currentTargetRef.current === targetElement
            ) {
                return
            }

            // 取消上一张图片的 hide 定时器
            clearHideTimeout()

            const position = calculateButtonPosition(targetElement)
            setState(prev => ({
                ...prev,
                currentTarget: targetElement,
                buttonVisible: true,
                buttonPosition: position,
                translatedImageUrl:
                    targetElement instanceof HTMLImageElement
                        ? targetElement.dataset.originalSrc
                            ? targetElement.src
                            : null
                        : getCanvasOverlayRecord(targetElement)?.overlay.src ||
                          null
            }))
        },
        [
            config.enableImageTranslateButton,
            calculateButtonPosition,
            clearHideTimeout,
            getCanvasOverlayRecord
        ]
    )

    // 处理鼠标离开
    const handleMouseLeave = useCallback(
        (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!(isImageElement(target) || isCanvasElement(target))) {
                return
            }

            // 清除之前的定时器
            clearHideTimeout()

            // 延迟隐藏按钮，给用户时间移动到按钮上
            hideTimeoutRef.current = setTimeout(() => {
                setState(prev => {
                    // 如果正在翻译，不隐藏按钮
                    if (prev.translating) {
                        return prev
                    }
                    return {
                        ...prev,
                        buttonVisible: false,
                        currentTarget: null
                    }
                })
            }, 300) // 增加延迟时间到 300ms
        },
        [clearHideTimeout]
    )

    // 处理翻译按钮点击
    const handleTranslateClick = useCallback(async () => {
        if (!state.currentTarget || state.translating) {
            return
        }

        const target = state.currentTarget

        if (target instanceof HTMLImageElement) {
            // 如果当前图片已翻译过（通过 DOM data 属性判断），恢复原图
            if (target.dataset.originalSrc) {
                clearImageSrcGuard(target)
                target.src = target.dataset.originalSrc
                delete target.dataset.originalSrc
                setState(prev => ({
                    ...prev,
                    translatedImageUrl: null,
                    buttonVisible: false,
                    currentTarget: null
                }))
                Toast.show({
                    type: ToastType.SUCCESS,
                    message: "已恢复原图"
                })
                return
            }
        } else {
            const existingOverlay = getCanvasOverlayRecord(target)
            if (existingOverlay) {
                removeCanvasOverlay(target)
                setState(prev => ({
                    ...prev,
                    translatedImageUrl: null,
                    buttonVisible: false,
                    currentTarget: null
                }))
                Toast.show({
                    type: ToastType.SUCCESS,
                    message: "已恢复原图"
                })
                return
            }
        }

        try {
            // 显示加载状态（按钮转圈）
            setState(prev => ({
                ...prev,
                translating: true
            }))

            let translatedUrl = ""
            if (target instanceof HTMLImageElement) {
                const originalSrc = target.src

                translatedUrl = await translateImageViaBackground({
                    imageUrl: originalSrc,
                    targetLanguage: config.targetLanguage,
                    devicePixelRatio: window.devicePixelRatio,
                    pageUrl: window.location.href
                })

                // 保存原图 URL
                if (!target.dataset.originalSrc) {
                    target.dataset.originalSrc = originalSrc
                }

                // 替换为翻译后的图片（同时处理祖先 background-image）
                target.src = translatedUrl
                guardImageSrc(target, translatedUrl, originalSrc)
            } else {
                const canvasId = ensureCanvasId(target)
                const canvasMeta = await getCanvasMetaForTranslate(target)

                translatedUrl = await translateImageViaBackground({
                    imageUrl: canvasMeta?.sourceUrl,
                    targetLanguage: config.targetLanguage,
                    devicePixelRatio: window.devicePixelRatio,
                    pageUrl: window.location.href,
                    canvasMeta: {
                        canvasId,
                        sourceUrl: canvasMeta?.sourceUrl,
                        renderType: canvasMeta?.renderType || "unknown",
                        sourceContextType:
                            canvasMeta?.sourceContextType || "unknown",
                        targetContextType:
                            canvasMeta?.targetContextType || "unknown"
                    }
                })

                applyCanvasOverlay(target, translatedUrl)
            }

            setState(prev => ({
                ...prev,
                translating: false,
                translatedImageUrl: translatedUrl
            }))

            Toast.show({
                type: ToastType.SUCCESS,
                message:
                    target instanceof HTMLCanvasElement
                        ? "Canvas 翻译成功"
                        : "图片翻译成功"
            })
        } catch (error) {
            console.error("[ImageTranslate] 翻译失败:", error)
            setState(prev => ({
                ...prev,
                translating: false
            }))

            Toast.show({
                type: ToastType.ERROR,
                message: error instanceof Error ? error.message : "图片翻译失败"
            })
        }
    }, [
        state.currentTarget,
        state.translating,
        config.targetLanguage,
        getCanvasMetaForTranslate,
        getCanvasOverlayRecord,
        removeCanvasOverlay,
        applyCanvasOverlay
    ])

    // 监听图片悬浮事件
    useEffect(() => {
        if (!config.enableImageTranslateButton) {
            return
        }

        ensureCanvasHookInjected(window.location.href).catch(error => {
            console.warn("[ImageTranslate] Canvas hook 注入失败:", error)
        })

        document.addEventListener("mouseover", handleImageHover)
        document.addEventListener("mouseout", handleMouseLeave)

        return () => {
            document.removeEventListener("mouseover", handleImageHover)
            document.removeEventListener("mouseout", handleMouseLeave)
        }
    }, [config.enableImageTranslateButton, handleImageHover, handleMouseLeave])

    // 监听滚动事件，更新按钮位置
    useEffect(() => {
        if (!state.buttonVisible || !state.currentTarget) {
            return
        }

        const handleScroll = () => {
            const target = currentTargetRef.current
            if (target) {
                const position = calculateButtonPosition(target)
                setState(prev => ({
                    ...prev,
                    buttonPosition: position
                }))
            }
        }

        window.addEventListener("scroll", handleScroll, true)
        window.addEventListener("resize", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", handleScroll)
        }
    }, [state.buttonVisible, state.currentTarget, calculateButtonPosition])

    useEffect(() => {
        const overlayMap = canvasOverlayMapRef.current
        return () => {
            overlayMap.forEach(record => {
                record.cleanup()
            })
            overlayMap.clear()
        }
    }, [])

    if (!config.enableImageTranslateButton) {
        return null
    }

    return (
        <ImageTranslateButton
            visible={state.buttonVisible}
            translating={state.translating}
            onClick={handleTranslateClick}
            position={state.buttonPosition}
            onMouseEnter={() => {
                clearHideTimeout()
            }}
            onMouseLeave={() => {
                setState(prev => {
                    if (prev.translating) {
                        return prev
                    }
                    return {
                        ...prev,
                        buttonVisible: false,
                        currentTarget: null
                    }
                })
            }}
        />
    )
}

// 导出组件
export default function ImageTranslateContent() {
    const shadowHost = document.getElementById(getShadowHostId())
    if (!shadowHost?.shadowRoot) {
        return null
    }

    return (
        <StyleSheetManager
            target={shadowHost.shadowRoot as unknown as HTMLElement}
        >
            <div id={plasmoShadowRootContainerId}>
                <ImageTranslate />
            </div>
        </StyleSheetManager>
    )
}
