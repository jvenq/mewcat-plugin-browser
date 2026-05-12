import type { AxiosResponse } from "axios"
import axios, { type AxiosError, type AxiosRequestConfig } from "axios"

import { storage } from "@/state/constants"

// 请求配置中的过渡选项类型
interface TransitionalOptions {
    silentJSONParsing: boolean
    forcedJSONParsing: boolean
    clarifyTimeoutError: boolean
}

// 请求头类型
interface RequestHeaders {
    Accept: string
    "Content-Type": string
    Authorization: string
    [key: string]: string // 允许其他自定义头
}

// 完整配置类型
interface RequestConfig {
    transitional: TransitionalOptions
    adapter: string[]
    timeout: number
    xsrfCookieName: string
    xsrfHeaderName: string
    maxContentLength: number
    maxBodyLength: number
    // env: Record<string, any>
    headers: RequestHeaders
    method: "post" | "get" | string
    url: string
    data: string
    allowAbsoluteUrls: boolean
}
// 成功时的结构体
interface ResponseSuccessResponse<T> {
    code: "success"
    data: T
}
// 报错时的结构体
interface ResponseErrorResponse<T, E = undefined> {
    // 来明确排除 "success"
    code: Exclude<string, "success">
    msg: string
    data: T
    // detail字段在某些接口报错情况下会存在。手动传入泛型定义detail响应
    detail?: E
}
// T = null, data某些接口不需要data。data值为null。
export type Response<T = null, E = undefined> =
    | ResponseSuccessResponse<T>
    | ResponseErrorResponse<T, E>
export interface HttpResponse<T> {
    data: Response<T>
    status: number
    statusText: string
    headers: ResponseHeaders
    config: RequestConfig
    request: Record<string, unknown> // 请求对象，可根据实际情况细化
}

// 响应头类型
interface ResponseHeaders {
    "content-length": string
    "content-type": string
    [key: string]: string // 允许其他响应头
}

export interface ErrorResponse {
    code: number // 业务错误码（如 1001: 权限不足，2002: 参数错误）
    message: string // 错误提示信息（如 "用户名已存在"）
    details?: Record<string, string> // 可选：错误详情（如字段校验失败信息）
}

export const mewCatRequest = axios.create({
    baseURL: `${process.env.PLASMO_PUBLIC_DOC2X_API_DOMAIN}/v2`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

/**
 * 刷新 token
 */
const refreshAccessToken = async function (refreshToken: string) {
    const res = await mewCatRequest.post<
        unknown,
        Response<{ refreshToken: string; accessToken: string }>
    >(
        `${process.env.PLASMO_PUBLIC_DOC2X_API_DOMAIN}/token/refresh`,
        undefined,
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        }
    )
    return res.data
}

// Token 刷新状态管理
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
    config: AxiosRequestConfig
}> = []

/**
 * 处理队列中的请求
 */
const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error)
        } else {
            // 更新请求头中的 token
            if (promise.config.headers && token) {
                promise.config.headers.Authorization = `Bearer ${token}`
            }
            promise.resolve(mewCatRequest(promise.config))
        }
    })

    failedQueue = []
}

mewCatRequest.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean
        }

        // 如果不是 401 错误，直接返回错误
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error)
        }

        // 如果已经重试过，直接返回错误
        if (originalRequest._retry) {
            return Promise.reject(error)
        }

        // 如果正在刷新 token，将请求加入队列
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest })
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            // 从 storage 获取 refreshToken
            const refreshToken = await storage.get<string>("refreshToken")

            if (!refreshToken) {
                throw new Error("No refresh token available")
            }

            // 刷新 token
            const response = await refreshAccessToken(refreshToken)

            if (!response.accessToken || !response.refreshToken) {
                throw new Error("Failed to refresh token")
            }

            // 保存新的 token 到 storage
            await storage.set("accessToken", response.accessToken)
            await storage.set("refreshToken", response.refreshToken)

            // 更新原始请求的 Authorization 头
            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
            }

            // 处理队列中的请求
            processQueue(null, response.accessToken)

            // 重新发送原始请求
            return mewCatRequest(originalRequest)
        } catch (err) {
            // 刷新失败，清除 token 并处理队列
            await storage.remove("accessToken")
            await storage.remove("refreshToken")

            processQueue(err as Error, null)

            return Promise.reject(err)
        } finally {
            isRefreshing = false
        }
    }
)
