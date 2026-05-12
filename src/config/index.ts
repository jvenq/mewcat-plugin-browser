const isDevelopment = process.env.NODE_ENV === "development"

export const MEWCAT_MATCHES = isDevelopment
    ? ["https://dev.frontend.noedgeai.com/*"]
    : ["https://doc2x.noedgeai.com/*"]

export const MEWCAT_FRONTEND_URL = isDevelopment
    ? "https://dev.frontend.noedgeai.com"
    : "https://doc2x.noedgeai.com"

export function isMewCatPage(url: string = window.location.href): boolean {
    try {
        const urlObj = new URL(url)
        return MEWCAT_MATCHES.some(pattern => {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"))
            return regex.test(urlObj.href)
        })
    } catch {
        return false
    }
}
