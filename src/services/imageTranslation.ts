import { nanoid } from "nanoid"

import { sendToBackground } from "@plasmohq/messaging"

import type {
    TranslateImageRequest,
    TranslateImageResponse
} from "../background/messages/translate-image"

export { validateImage } from "@/utils/imageUtils"

const TRANSLATE_TIMEOUT_MS = 90_000

/**
 * Request image translation via background service worker.
 * All network operations happen in the background to avoid CORS issues.
 *
 * Uses triple-channel response for reliability:
 * 1. Primary: Plasmo sendToBackground (sendResponse callback)
 * 2. Message: chrome.tabs.sendMessage from background
 * 3. Storage: chrome.storage.local — completely bypasses messaging
 *
 * In dev mode (HMR) or MV3 edge cases, messaging channels can break.
 * The storage channel ensures the result still arrives.
 */
export function translateImageViaBackground(params: {
    imageUrl?: string
    targetLanguage: string
    devicePixelRatio: number
    pageUrl?: string
    canvasMeta?: {
        canvasId?: string
        sourceUrl?: string
        renderType?: "canvas-2d" | "canvas-webgl" | "unknown"
        sourceContextType?: string
        targetContextType?: string
    }
}): Promise<string> {
    const requestId = `tr_${Date.now()}_${nanoid(36).slice(2, 8)}`
    const storageKey = `__tr_result_${requestId}`

    console.log("[ImageTranslate] 发送翻译请求:", {
        requestId,
        imageUrl: params.imageUrl?.slice(0, 80),
        targetLanguage: params.targetLanguage
    })

    return new Promise<string>((resolve, reject) => {
        let settled = false

        const settle = (fn: () => void) => {
            if (settled) {
                return
            }
            settled = true
            clearTimeout(timer)
            chrome.runtime.onMessage.removeListener(messageListener)
            chrome.storage.onChanged.removeListener(storageListener)
            chrome.storage.local.remove(storageKey).catch(() => {})
            fn()
        }

        const handleResponse = (
            response: TranslateImageResponse,
            channel: string
        ) => {
            console.log("[ImageTranslate] 收到响应 via", channel, {
                success: response.success,
                hasUrl: !!response.translatedImageUrl,
                error: response.error
            })

            if (response.success && response.translatedImageUrl) {
                settle(() => resolve(response.translatedImageUrl!))
            } else {
                settle(() =>
                    reject(new Error(response.error || "图片翻译失败"))
                )
            }
        }

        // Timeout
        const timer = setTimeout(() => {
            settle(() => reject(new Error("翻译超时，请重试")))
        }, TRANSLATE_TIMEOUT_MS)

        // Channel 3 (most reliable): chrome.storage.local
        const storageListener = (
            changes: { [key: string]: chrome.storage.StorageChange },
            area: string
        ) => {
            if (area === "local" && changes[storageKey]?.newValue) {
                handleResponse(
                    changes[storageKey].newValue as TranslateImageResponse,
                    "storage"
                )
            }
        }
        chrome.storage.onChanged.addListener(storageListener)

        // Channel 2: chrome.tabs.sendMessage from background
        const messageListener = (message: Record<string, unknown>) => {
            if (
                message?.type === "__translate_image_result__" &&
                message?.requestId === requestId
            ) {
                handleResponse(
                    message.response as TranslateImageResponse,
                    "tabs-message"
                )
            }
        }
        chrome.runtime.onMessage.addListener(messageListener)

        // Channel 1 (primary): Plasmo sendToBackground
        sendToBackground<TranslateImageRequest, TranslateImageResponse>({
            name: "translate-image",
            body: {
                imageUrl: params.imageUrl,
                targetLanguage: params.targetLanguage,
                devicePixelRatio: params.devicePixelRatio,
                pageUrl: params.pageUrl,
                requestId,
                canvasMeta: params.canvasMeta
            }
        })
            .then(response => {
                handleResponse(response, "plasmo-primary")
            })
            .catch(error => {
                // Primary channel failed — wait for backup channels or timeout
                console.warn(
                    "[ImageTranslate] 主消息通道异常，等待备用通道:",
                    error?.message || error
                )
            })
    })
}
