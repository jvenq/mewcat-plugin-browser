/**
 * Doc2X Content Script 配置
 *
 * 根据构建环境自动切换 Doc2X 前端 URL
 * - Development: dev.frontend.noedgeai.com
 * - Production: doc2x.noedgeai.com
 */

const isDevelopment = process.env.NODE_ENV === "development"

/**
 * Doc2X 前端 URL 匹配模式
 * 用于 Plasmo content script 的 matches 配置
 */
export const DOC2X_MATCHES = [
    "https://dev.frontend.noedgeai.com/*",
    "https://doc2x.noedgeai.com/*"
]

/**
 * Doc2X 前端基础 URL
 * 用于代码中需要引用 Doc2X 前端的地方
 */
export const DOC2X_FRONTEND_URL = isDevelopment
    ? "https://dev.frontend.noedgeai.com"
    : "https://doc2x.noedgeai.com"

/**
 * 检查当前 URL 是否是 Doc2X 页面
 */
export function isDoc2xPage(url: string = window.location.href): boolean {
    try {
        const urlObj = new URL(url)
        return DOC2X_MATCHES.some(pattern => {
            const regex = new RegExp(pattern)
            return regex.test(urlObj.href)
        })
    } catch {
        return false
    }
}
