import { plasmoShadowRootContainerId } from "../constants/dom"
/**
 * 翻译样式相关工具函数
 * 根据配置提供不同的翻译文本显示样式
 */

import {
    TranslationStyle,
    type TranslationStyleType
} from "../types/translationStyle"

function getPlasmoShadowRoot() {
    return document.querySelector("plasmo-csui")?.shadowRoot
}

export function getPlasmoShadowContainer() {
    return getPlasmoShadowRoot()?.querySelector(
        `#${plasmoShadowRootContainerId}`
    ) as HTMLElement
}

//see https://github.com/PlasmoHQ/plasmo/issues/652
export function injectCssText(cssText: string) {
    const plasmoCsui = getPlasmoShadowRoot()
    const style = document.createElement("style")
    style.textContent = cssText
    plasmoCsui?.appendChild(style)
}

// 为了向后兼容，保留原有的类型别名
export type TranslationStyleUnion = TranslationStyleType

/**
 * 获取翻译样式的CSS文本
 */
export function getTranslationStyleCSS(
    style: TranslationStyleType = TranslationStyle.HIGHLIGHT
): string {
    const baseStyle = `
        font-style: normal;
        font-weight: normal;
        display: inline-block;
        border-radius: 2px;
        transition: all 0.2s ease;
    `

    switch (style) {
        case TranslationStyle.NONE:
            return `
                font-style: normal;
                font-weight: normal;
                display: inline-block;
                margin: 0;
                padding: 0;
                border: none;
                background: transparent;
                color: inherit;
                font-size: inherit;
                line-height: inherit;
            `

        case TranslationStyle.HIGHLIGHT:
            return (
                baseStyle +
                `
                color: #f97316;
                background: rgba(255, 235, 59, 0.3);
                border-left: 3px solid #f97316;
            `
            )

        case TranslationStyle.UNDERLINE:
            return (
                baseStyle +
                `
                color: #f97316;
                background: transparent;
                text-decoration: underline;
                text-decoration-color: #f97316;
                text-decoration-thickness: 2px;
            `
            )

        case TranslationStyle.BACKGROUND:
            return (
                baseStyle +
                `
                color: #f97316;
                background: rgba(255, 247, 237, 0.8);
                border: 1px solid rgba(255, 247, 237, 0.5);
            `
            )

        case TranslationStyle.BORDER:
            return (
                baseStyle +
                `
                color: #f97316;
                background: transparent;
                border: 2px solid #f97316;
                border-radius: 4px;
            `
            )

        case TranslationStyle.SHADOW:
            return (
                baseStyle +
                `
                color: #f97316;
                background: rgba(255, 255, 255, 0.1);
                text-shadow: 1px 1px 3px rgba(249, 115, 22, 0.6);
                box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);
            `
            )

        default:
            // 默认使用高亮样式
            return getTranslationStyleCSS(TranslationStyle.HIGHLIGHT)
    }
}

/**
 * 根据样式类型调整插入策略
 */
export function shouldInsertAsBlock(style: TranslationStyleType): boolean {
    switch (style) {
        case TranslationStyle.NONE:
        case TranslationStyle.UNDERLINE:
        case TranslationStyle.SHADOW:
            // 这些样式可以内联显示
            return false
        case TranslationStyle.HIGHLIGHT:
        case TranslationStyle.BACKGROUND:
        case TranslationStyle.BORDER:
        default:
            // 这些样式需要块级显示
            return true
    }
}

/**
 * 获取翻译容器的标签类型
 */
export function getTranslationElementTag(style: TranslationStyleType): string {
    switch (style) {
        case TranslationStyle.NONE:
        case TranslationStyle.UNDERLINE:
        case TranslationStyle.SHADOW:
            // 内联样式使用span
            return "span"
        case TranslationStyle.HIGHLIGHT:
        case TranslationStyle.BACKGROUND:
        case TranslationStyle.BORDER:
        default:
            // 块级样式使用div
            return "div"
    }
}

/**
 * 获取样式的描述信息
 */
export function getStyleDescription(style: TranslationStyleType): string {
    switch (style) {
        case TranslationStyle.NONE:
            return "无样式 - 不添加任何特殊样式"
        case TranslationStyle.HIGHLIGHT:
            return "高亮显示 - 使用黄色背景和橙色边框"
        case TranslationStyle.UNDERLINE:
            return "下划线 - 使用橙色下划线标识"
        case TranslationStyle.BACKGROUND:
            return "背景色 - 使用淡橙色背景"
        case TranslationStyle.BORDER:
            return "边框 - 使用橙色边框包围"
        case TranslationStyle.SHADOW:
            return "阴影 - 使用文字阴影和盒子阴影"
        default:
            return "默认样式"
    }
}
