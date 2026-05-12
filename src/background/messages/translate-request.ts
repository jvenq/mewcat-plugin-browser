import type { PlasmoMessaging } from "@plasmohq/messaging"

import type {
    AiHttpRequestConfig,
    TranslationEngineRequestConfig,
    UnifiedRequestBody,
    UnifiedResponse
} from "@/types/request"

// ============================================================================
// 全局配置和工具
// ============================================================================

/** 活动的 AbortController 集合 */
const activeAbortControllers = new Set<AbortController>()

/** 创建带超时的 AbortController */
function createAbortController(
    timeout?: number
): [AbortController, NodeJS.Timeout | undefined] {
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | undefined

    if (timeout) {
        timeoutId = setTimeout(() => controller.abort(), timeout)
    }

    activeAbortControllers.add(controller)
    return [controller, timeoutId]
}

/** 清理 AbortController */
function cleanupAbortController(
    controller: AbortController,
    timeoutId?: NodeJS.Timeout
): void {
    activeAbortControllers.delete(controller)
    if (timeoutId) {clearTimeout(timeoutId)}
}

/** 发送成功响应 */
function sendSuccess(
    res: PlasmoMessaging.Response,
    content: string | Record<string, unknown>,
    headers?: Record<string, string>
): void {
    res.send({ content, success: true, headers } as UnifiedResponse)
}

/** 发送错误响应 */
function sendError(
    res: PlasmoMessaging.Response,
    error: unknown,
    headers?: Record<string, string>
): void {
    const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
    res.send({ error: errorMessage, success: false, headers } as UnifiedResponse)
}

// ============================================================================
// AI 普通 HTTP 请求处理器
// ============================================================================

/** 处理 AI 普通 HTTP 请求 */
async function handleAiHttpRequest(
    config: AiHttpRequestConfig,
    res: PlasmoMessaging.Response
): Promise<void> {
    const { apiKey, baseUrl, headers = {}, timeout, ...requestBody } = config

    const [controller, timeoutId] = createAbortController(timeout)

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        })

        // 提取响应头
        const responseHeaders: Record<string, string> = {}
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value
        })

        if (!response.ok) {
            const error = new Error(
                `HTTP error! status: ${response.status}`
            ) as Error & { headers?: Record<string, string> }
            error.headers = responseHeaders
            throw error
        }

        const result = await response.json()
        sendSuccess(res, result, responseHeaders)
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error("Request timeout")
        }
        // 传递响应头到错误处理
        if (error && typeof error === "object" && "headers" in error) {
            const errorWithHeaders = error as { headers?: Record<string, string> }
            sendError(res, error, errorWithHeaders.headers)
            return
        }
        throw error
    } finally {
        cleanupAbortController(controller, timeoutId)
    }
}

// ============================================================================
// 翻译引擎请求处理器 (DEEPL/DEEPLX)
// ============================================================================

/** 处理翻译引擎请求 */
async function handleTranslationEngineRequest(
    config: TranslationEngineRequestConfig,
    res: PlasmoMessaging.Response
): Promise<void> {
    const { baseUrl, headers = {}, timeout, ...translationData } = config

    const [controller, timeoutId] = createAbortController(timeout)

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(translationData),
            signal: controller.signal
        })

        const responseHeaders: Record<string, string> = {}
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value
        })

        if (!response.ok) {
            const error = new Error(
                `Translation engine error! status: ${response.status}`
            ) as Error & { headers?: Record<string, string> }
            error.headers = responseHeaders
            throw error
        }

        const result = await response.json()
        sendSuccess(res, result, responseHeaders)
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error("Request timeout")
        }
        if (error && typeof error === "object" && "headers" in error) {
            const errorWithHeaders = error as { headers?: Record<string, string> }
            sendError(res, error, errorWithHeaders.headers)
            return
        }
        throw error
    } finally {
        cleanupAbortController(controller, timeoutId)
    }
}

// ============================================================================
// 中断请求处理器
// ============================================================================

/** 中断所有活动请求 */
function handleAbortRequest(res: PlasmoMessaging.Response): void {
    activeAbortControllers.forEach(controller => controller.abort())
    activeAbortControllers.clear()
    sendSuccess(res, "All requests aborted")
}

// ============================================================================
// 主处理器
// ============================================================================

const handle: PlasmoMessaging.PortHandler = async (req, res) => {
    try {
        const body = req.body as UnifiedRequestBody

        switch (body.type) {
            case "ai_http":
                await handleAiHttpRequest(body.config, res)
                break
            case "translation_engine":
                await handleTranslationEngineRequest(body.config, res)
                break
            case "abort":
                handleAbortRequest(res)
                break
            default:
                throw new Error(`Unsupported request type: ${body.type}`)
        }
    } catch (error) {
        sendError(res, error)
    }
}

export default handle

// 导出类型以便向后兼容
export { RequestType } from "@/types/request"
export type { UnifiedRequestBody, UnifiedResponse } from "@/types/request"

// 向后兼容：导出旧的类型名称
export { RequestType as HttpType } from "@/types/request"
export type { UnifiedRequestBody as RequestBody } from "@/types/request"
export type { UnifiedResponse as ResponseBody } from "@/types/request"
