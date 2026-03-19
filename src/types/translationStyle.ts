/**
 * 翻译样式枚举
 * 定义支持的翻译文本显示样式类型
 */
export enum TranslationStyle {
    /** 无样式 - 不添加任何特殊样式 */
    NONE = "none",

    /** 高亮显示 - 使用黄色背景和蓝色边框 */
    HIGHLIGHT = "highlight",

    /** 下划线 - 使用蓝色下划线标识 */
    UNDERLINE = "underline",

    /** 背景色 - 使用淡蓝色背景 */
    BACKGROUND = "background",

    /** 边框 - 使用蓝色边框包围 */
    BORDER = "border",

    /** 阴影 - 使用文字阴影和盒子阴影 */
    SHADOW = "shadow"
}

/**
 * 翻译样式联合类型
 * 为了向后兼容，保留字符串字面量类型
 */
export type TranslationStyleType =
    | TranslationStyle
    | "none"
    | "highlight"
    | "underline"
    | "background"
    | "border"
    | "shadow"
