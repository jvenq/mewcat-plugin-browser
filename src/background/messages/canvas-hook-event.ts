import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { CanvasHookError } from "../../types/canvas-hook"

export interface CanvasHookEventRequest {
    type: "canvas-hook-error"
    pageUrl?: string
    error: CanvasHookError
}

export interface CanvasHookEventResponse {
    success: boolean
}

const handler: PlasmoMessaging.MessageHandler<
    CanvasHookEventRequest,
    CanvasHookEventResponse
> = async (req, res) => {
    const payload = req.body
    let host = "unknown"

    if (payload.pageUrl) {
        try {
            host = new URL(payload.pageUrl).hostname
        } catch {
            host = "invalid-url"
        }
    }

    console.warn("[CanvasHookEvent] Main World 错误上报:", {
        host,
        hookStage: payload.error.hookStage,
        code: payload.error.code,
        message: payload.error.message,
        requestId: payload.error.requestId
    })

    res.send({ success: true })
}

export default handler

