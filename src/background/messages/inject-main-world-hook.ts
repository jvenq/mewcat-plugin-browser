import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getCanvasRolloutDecision } from "../config/canvas-sites"
import { installMewCatCanvasImageHook } from "../../contents/inject/canvas-image-hook"
import {
    CANVAS_HOOK_CHANNEL,
    CANVAS_HOOK_VERSION
} from "../../types/canvas-hook"

export interface InjectMainWorldHookRequest {
    pageUrl?: string
}

export interface InjectMainWorldHookResponse {
    success: boolean
    injected?: boolean
    skipped?: boolean
    reason?: string
    error?: string
}

const handler: PlasmoMessaging.MessageHandler<
    InjectMainWorldHookRequest,
    InjectMainWorldHookResponse
> = async (req, res) => {
    const tabId = req.sender?.tab?.id
    const pageUrl = req.body?.pageUrl || req.sender?.tab?.url

    if (!tabId) {
        res.send({
            success: false,
            error: "缺少 tabId，无法注入 Main World hook"
        })
        return
    }

    const decision = getCanvasRolloutDecision(pageUrl)
    if (!decision.enabled) {
        res.send({
            success: true,
            injected: false,
            skipped: true,
            reason: `当前站点未开启 canvas hook: ${decision.reason}`
        })
        return
    }

    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            world: "MAIN",
            func: installMewCatCanvasImageHook,
            args: [CANVAS_HOOK_CHANNEL, CANVAS_HOOK_VERSION]
        })

        res.send({
            success: true,
            injected: true
        })
    } catch (error) {
        console.error("[CanvasHook] Main World 注入失败:", error)
        res.send({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Main World 注入失败"
        })
    }
}

export default handler
