/**
 * 翻译请求类型定义
 */

import type { Message } from "@/types"

/**
 * 请求类型枚举
 */
export enum RequestType {
    /** AI 模型普通 HTTP 请求 */
    AI_HTTP = "ai_http",
    /** 翻译引擎请求 (DEEPL/DEEPLX) */
    TRANSLATION_ENGINE = "translation_engine",
    /** 谷歌翻译请求 */
    GOOGLE_TRANSLATE = "google_translate",
    /** 中断所有请求 */
    ABORT = "abort"
}

/**
 * AI 普通 HTTP 请求配置
 */
export interface AiHttpRequestConfig {
    apiKey: string
    baseUrl: string
    model: string | number
    messages: Message[]
    temperature?: number
    timeout?: number
    headers?: Record<string, string>
    /** Gemini 使用 contents 字段 */
    contents?: Array<{
        role: string
        parts: Array<{ text: string }>
    }>
    [key: string]: unknown
}

/**
 * 翻译引擎请求配置
 */
export interface TranslationEngineRequestConfig {
    apiKey: string
    baseUrl: string
    text: string | string[]
    target_lang: string
    source_lang?: string
    timeout?: number
    headers?: Record<string, string>
}

/**
 * 谷歌翻译请求配置（translateHtml POST API）
 * 请求体格式：[[segments[], sourceLang, targetLang], "te_lib"]
 */
export interface GoogleTranslateRequestConfig {
    url: string
    /** POST body: [[["seg1","seg2",...], sourceLang, targetLang], "te_lib"] */
    body: [[[...string[]], string, string], string]
    apiKey: string
    timeout?: number
}

/**
 * 统一请求体
 */
export type UnifiedRequestBody =
    | { type: RequestType.AI_HTTP; config: AiHttpRequestConfig }
    | {
          type: RequestType.TRANSLATION_ENGINE
          config: TranslationEngineRequestConfig
      }
    | {
          type: RequestType.GOOGLE_TRANSLATE
          config: GoogleTranslateRequestConfig
      }
    | { type: RequestType.ABORT; config: null }

/**
 * 统一响应体
 */
export interface UnifiedResponse {
    content?: string | Record<string, unknown>
    error?: string
    success: boolean
    headers?: Record<string, string>
}
