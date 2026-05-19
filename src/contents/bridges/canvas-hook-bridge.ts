import { sendToBackground } from "@plasmohq/messaging"

import { shouldEnableCanvasHook } from "../../background/config/canvas-sites"
import type {
    CanvasHookEventRequest,
    CanvasHookEventResponse
} from "../../background/messages/canvas-hook-event"
import type {
    InjectMainWorldHookRequest,
    InjectMainWorldHookResponse
} from "../../background/messages/inject-main-world-hook"
import {
    CANVAS_HOOK_CHANNEL,
    type CanvasHookError,
    type CanvasHookEvent,
    type CanvasHookMeta
} from "../../types/canvas-hook"

interface PendingCanvasMetaRequest {
    resolve: (value: CanvasHookMeta | null) => void
    reject: (error: Error) => void
    timer: number
}

const canvasMetaStore = new Map<string, CanvasHookMeta>()
const pendingMetaRequests = new Map<string, PendingCanvasMetaRequest>()

let bridgeStarted = false
let injectInFlight: Promise<boolean> | null = null
let injected = false
let lastHookError: CanvasHookError | null = null
let lastErrorReportKey = ""
let lastErrorReportAt = 0

function generateRequestId(): string {
    return `mewcat-canvas-query-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function shouldReportError(error: CanvasHookError): boolean {
    const reportKey = `${error.code}:${error.hookStage}:${error.message}`
    const now = Date.now()
    if (reportKey === lastErrorReportKey && now - lastErrorReportAt < 2_000) {
        return false
    }
    lastErrorReportKey = reportKey
    lastErrorReportAt = now
    return true
}

async function reportCanvasHookError(error: CanvasHookError): Promise<void> {
    if (!shouldReportError(error)) {
        return
    }

    await sendToBackground<CanvasHookEventRequest, CanvasHookEventResponse>({
        name: "canvas-hook-event",
        body: {
            type: "canvas-hook-error",
            pageUrl: window.location.href,
            error
        }
    }).catch(reportErr => {
        console.warn("[CanvasHookBridge] 错误上报失败:", reportErr)
    })
}

export function ensureCanvasId(canvas: HTMLCanvasElement): string {
    const existing = canvas.getAttribute("data-mewcat-canvas-id")
    if (existing) {
        return existing
    }
    const generated = `mewcat-canvas-${Date.now()}-${Math.random().toString(16).slice(2)}`
    canvas.setAttribute("data-mewcat-canvas-id", generated)
    return generated
}

function handleWindowMessage(event: MessageEvent) {
    const payload = event.data as CanvasHookEvent | undefined

    if (event.source !== window) {
        return
    }
    if (!payload || payload.channel !== CANVAS_HOOK_CHANNEL) {
        return
    }

    if (payload.type === "CANVAS_META_UPDATE") {
        canvasMetaStore.set(payload.meta.canvasId, payload.meta)
        return
    }

    if (payload.type === "CANVAS_META_ERROR") {
        lastHookError = payload.error
        console.warn("[CanvasHookBridge] 收到 Main World 错误:", payload.error)
        void reportCanvasHookError(payload.error)
        if (payload.error.requestId) {
            const pending = pendingMetaRequests.get(payload.error.requestId)
            if (pending) {
                clearTimeout(pending.timer)
                pendingMetaRequests.delete(payload.error.requestId)
                pending.reject(new Error(payload.error.message))
            }
        }
        return
    }

    if (payload.type === "CANVAS_META_RESPONSE") {
        const pending = pendingMetaRequests.get(payload.requestId)
        if (!pending) {
            if (payload.meta) {
                canvasMetaStore.set(payload.meta.canvasId, payload.meta)
            }
            return
        }

        clearTimeout(pending.timer)
        pendingMetaRequests.delete(payload.requestId)

        if (payload.meta) {
            canvasMetaStore.set(payload.meta.canvasId, payload.meta)
            pending.resolve(payload.meta)
            return
        }
        pending.resolve(null)
    }
}

export function startCanvasHookBridge() {
    if (bridgeStarted) {
        return
    }
    bridgeStarted = true
    window.addEventListener("message", handleWindowMessage)
}

export async function ensureCanvasHookInjected(
    pageUrl: string
): Promise<boolean> {
    if (!shouldEnableCanvasHook(pageUrl)) {
        return false
    }
    if (injected) {
        return true
    }
    if (injectInFlight) {
        return injectInFlight
    }

    startCanvasHookBridge()
    injectInFlight = (async () => {
        try {
            const response = await sendToBackground<
                InjectMainWorldHookRequest,
                InjectMainWorldHookResponse
            >({
                name: "inject-main-world-hook",
                body: {
                    pageUrl
                }
            })

            if (!response.success) {
                console.warn(
                    "[CanvasHookBridge] Main World 注入失败:",
                    response.error
                )
                return false
            }

            if (response.skipped) {
                return false
            }

            injected = !!response.injected
            return injected
        } catch (error) {
            console.warn("[CanvasHookBridge] 注入请求异常:", error)
            return false
        } finally {
            injectInFlight = null
        }
    })()

    return injectInFlight
}

export async function queryCanvasMeta(
    canvas: HTMLCanvasElement,
    timeoutMs = 500
): Promise<CanvasHookMeta | null> {
    startCanvasHookBridge()

    const canvasId = ensureCanvasId(canvas)
    const cached = canvasMetaStore.get(canvasId)
    if (cached && Date.now() - cached.updatedAt < 5_000) {
        return cached
    }

    const requestId = generateRequestId()
    const promise = new Promise<CanvasHookMeta | null>((resolve, reject) => {
        const timer = window.setTimeout(() => {
            pendingMetaRequests.delete(requestId)
            resolve(canvasMetaStore.get(canvasId) || null)
        }, timeoutMs)

        pendingMetaRequests.set(requestId, {
            resolve,
            reject,
            timer
        })
    })

    window.postMessage(
        {
            channel: CANVAS_HOOK_CHANNEL,
            type: "CANVAS_META_QUERY",
            requestId,
            canvasId
        },
        "*"
    )

    return promise
}

export function getLastCanvasHookError(): CanvasHookError | null {
    return lastHookError
}
