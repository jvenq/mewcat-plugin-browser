import { useCallback, useEffect, useRef, useState } from "react"

import { calculatePosition } from "@/utils"

import type { ExtensionConfig } from "../types/config"

export interface SelectionState {
    text: string
    position: {
        top: number
        left: number
    }
    textRect?: DOMRect
    isVisible: boolean
    isDotVisible: boolean
    triggerDot?: {
        x: number
        y: number
    }
}

export interface UseSelectionTranslateOptions {
    config: ExtensionConfig
    shadowId: string
}

/**
 * 划词翻译 Hook
 * 根据配置处理不同的触发模式和交互方式
 */
export function useSelectionTranslate<T extends HTMLElement>({
    config,
    shadowId
}: UseSelectionTranslateOptions) {
    const triggerMode = config.selectionTriggerMode
    const dotRef = useRef<T>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [state, setState] = useState<SelectionState>({
        text: "",
        position: { top: 0, left: 0 },
        isVisible: false,
        isDotVisible: false
    })

    // 检查当前网站是否被禁用
    const isCurrentSiteDisabled = useCallback(() => {
        if (!config.selectionDisabledSites?.length) {
            return false
        }

        const currentUrl = window.location.href
        const currentHostname = window.location.hostname

        return config.selectionDisabledSites.some(site => {
            // 支持通配符匹配
            if (site.startsWith("*")) {
                const domain = site.substring(1)
                return currentHostname.endsWith(domain)
            }
            // 完整域名匹配
            if (site.includes(".")) {
                return (
                    currentHostname === site ||
                    currentHostname.endsWith("." + site)
                )
            }
            // URL包含匹配
            return currentUrl.includes(site)
        })
    }, [config.selectionDisabledSites])

    // 检查是否应该触发
    const shouldTrigger = useCallback(() => {
        // 检查是否启用
        if (!config.isSelectedTranslate) {
            return false
        }

        // 检查当前网站是否被禁用
        if (isCurrentSiteDisabled()) {
            return false
        }

        return true
    }, [config, isCurrentSiteDisabled])

    // 计算位置
    const computeRect = useCallback(() => {
        setState(prev => {
            if (!prev.textRect) {
                return prev
            }
            const position = calculatePosition(
                prev.textRect,
                containerRef.current.getBoundingClientRect()
            )
            return {
                ...prev,
                position
            }
        })
    }, [])

    const settingSelection = useCallback(() => {
        const selection = window.getSelection()
        const selectedText = selection.toString().trim()
        if (!selectedText) {
            return
        }
        const rect = selection?.getRangeAt?.(0)?.getBoundingClientRect?.()
        if (!rect || !containerRef.current) {
            return null
        }
        setState(prev => ({
            ...prev,
            text: selectedText,
            textRect: rect
        }))
        return selectedText
    }, [])

    // 显示翻译面板
    const showTranslatePanel = useCallback(() => {
        if (!shouldTrigger()) {
            return
        }
        computeRect()
        setState(prev => ({
            ...prev,
            isVisible: true,
            isDotVisible: false
        }))
    }, [computeRect, shouldTrigger])

    // 显示触发点
    const showTriggerDot = useCallback((x: number, y: number) => {
        setState(prev => {
            return {
                ...prev,
                triggerDot: { x, y },
                isDotVisible: true,
                isVisible: false
            }
        })
    }, [])

    // 隐藏所有
    const hideAll = useCallback(() => {
        setState(prev => ({
            ...prev,
            text: "",
            textRect: undefined,
            rect: { top: 0, left: 0 },
            isVisible: false,
            isDotVisible: false,
            triggerDot: undefined
        }))
    }, [])

    // 点击触发点
    const onDotClick = useCallback(() => {
        if (state.text) {
            showTranslatePanel()
        }
    }, [state.text, showTranslatePanel])

    // 悬停触发点
    const onDotHover = useCallback(() => {
        if (state.text && config.selectionInteractionMode === "hover") {
            showTranslatePanel()
        }
    }, [state.text, config.selectionInteractionMode, showTranslatePanel])

    // 监听键盘事件
    useEffect(() => {
        if (!config.isSelectedTranslate) {
            return
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            // 根据配置的触发模式检查对应的按键
            const triggerKeyText = e.key.toUpperCase()
            // 检查是否为精确的 Shift 触发
            const isShiftTrigger =
                triggerMode === "shift" && triggerKeyText === "SHIFT"

            // 检查是否为精确的 Ctrl 触发
            const isCtrlTrigger =
                triggerMode === "ctrl" &&
                ["CONTROL", "CTRL"].includes(triggerKeyText)

            // 如果既不是 Shift 触发，也不是 Ctrl 触发，则返回
            if (!(isShiftTrigger || isCtrlTrigger)) {
                return
            }
            showTranslatePanel()
        }
        document.addEventListener("keyup", handleKeyUp)

        return () => {
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [config.isSelectedTranslate, showTranslatePanel, triggerMode])

    // 监听鼠标事件
    useEffect(() => {
        if (!config.isSelectedTranslate) {
            return
        }
        let isIgnore = false

        const handleMouseDown = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement) {
                const shadowRoot = e.target.shadowRoot?.getElementById(shadowId)
                const isIncludeShadow = shadowRoot?.contains(
                    containerRef.current
                )
                if (isIncludeShadow) {
                    isIgnore = true
                    return
                }
            }
            isIgnore = false

            // 如果不是选择文本的操作，隐藏面板
            hideAll()
        }

        const handleMouseUp = (e: MouseEvent) => {
            if (isIgnore) {
                return
            }

            // 鼠标松手时计算位置
            const selectedText = settingSelection()
            if (selectedText) {
                // 判断类型决定是否打开
                triggerMode === "direct" && showTranslatePanel()
                triggerMode === "dot" && showTriggerDot(e.clientX, e.clientY)
            }
        }

        document.addEventListener("mousedown", handleMouseDown)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [
        containerRef,
        showTranslatePanel,
        hideAll,
        settingSelection,
        shadowId,
        showTriggerDot,
        triggerMode,
        config.isSelectedTranslate
    ])

    // 监听配置变化
    useEffect(() => {
        if (!config.isSelectedTranslate) {
            hideAll()
        }
    }, [config.isSelectedTranslate, hideAll])

    return {
        state,
        dotRef,
        containerRef,
        actions: {
            hideAll,
            onDotClick,
            onDotHover,
            showTranslatePanel,
            onComputeRect: computeRect
        },
        config: {
            isEnabled: config.isSelectedTranslate,
            triggerMode: config.selectionTriggerMode || "direct",
            interactionMode: config.selectionInteractionMode || "click",
            isCurrentSiteDisabled: isCurrentSiteDisabled()
        }
    }
}
