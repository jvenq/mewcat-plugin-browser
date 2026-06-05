declare global {
    /** 开发环境标志 - 由构建工具 (webpack/vite) 注入 */
    const __DEVELOPMENT__: boolean | undefined

    /** 生产环境标志 - 由构建工具注入 */
    const __PRODUCTION__: boolean | undefined

    /** 调试模式标志 - 由构建工具注入 */
    const __DEBUG__: boolean | undefined

    /** 构建版本信息 - 由构建工具注入 */
    const __VERSION__: string | undefined

    /** 构建时间戳 - 由构建工具注入 */
    const __BUILD_TIME__: string | undefined

    /** 扩展调试对象 - 运行时注入 */
    interface Window {
        immersiveTranslatorDebug?: {
            highlightNode: (index: number) => void
            closePanel: () => void
            togglePanel: () => void
            exportDebugData: () => void
            showRulesInfo: () => void
            showNodesInfo: () => void
        }
        debugExample?: {
            basic: () => void
            advanced: () => void
            help: () => void
        }
    }
    const chrome: typeof import("@types/chrome")
    const window: typeof import("@types/chrome").window
}

// 声明所有图片文件类型
declare module "*.png" {
    const src: string
    export default src
}

declare module "*.jpg" {
    const src: string
    export default src
}

declare module "*.jpeg" {
    const src: string
    export default src
}

declare module "*.svg" {
    const src: string
    export default src
}
