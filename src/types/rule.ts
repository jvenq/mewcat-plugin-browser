/**
 * ISO 639-1 语言代码（原子类型）
 * 兜底 string 兼容自定义语言码
 */
export type LanguageCode =
    | "zh"
    | "zh-CN"
    | "zh-TW"
    | "en"
    | "en-US"
    | "en-GB"
    | "ja"
    | "ko"
    | "fr"
    | "de"
    | "es"
    | "ru"
    | "pt"
    | "auto" // 自动检测
    | string

/**
 * CSS 选择器（原子类型）
 */
export type CssSelector = string

/**
 * 页面类型
 */
export type PageType =
    | "subtitleBuilder"
    | "pdfReader"
    | "ebookReader"
    | "ebookBuilder"
    | "normal"

export type TranslationMode = "translation" | "dual"
/**
 * 替换规则原子（文本替换的最小单元）
 */
export interface ReplaceRuleAtom {
    /** 匹配内容（字符串/正则表达式字符串） */
    match: string
    /** 替换内容 */
    replace: string
    /** 匹配模式 */
    mode: "string" | "regex"
    /** 是否全局匹配（仅 regex 生效） */
    global?: boolean
    /** 是否忽略大小写（仅 regex 生效） */
    ignoreCase?: boolean
}

/**
 * 输入配置（计划功能：输入框翻译）
 */
export interface InputConfig {
    /** 是否启用清除内容 */
    clearContentEnable?: boolean
    /** 是否启用 execCommand 删除 */
    execCommandDeleteEnable?: boolean
    /** 是否启用范围删除内容 */
    enableRangeDeleteContent?: boolean
    /** 是否启用自动语言 */
    autoLanguageEnable?: boolean
    /** 是否启用页面自动语言 */
    autoLanguagePageEnable?: boolean
    /** 自动语言站点列表 */
    autoLanguageSites?: string[]
    /** 自动语言站点（大陆） */
    autoLanguageSitesMainland?: string[]
}

/**
 * 图片规则（计划功能：通过 rule.json 配置图片翻译行为）
 */
export interface ImageRule {
    /** 类型 */
    type?: string
    /** 是否启用漫画浮球 */
    enableMangaFloatBall?: boolean
    /** 阻止工具的 URL 列表 */
    blockToolsUrls?: string[]
    /** 是否启用图片 src 观察器 */
    enableImageSrcObserver?: boolean
    /** 图片翻译 URL 列表 */
    imageTranslationUrls?: string[]
    /** 是否启用 */
    enable?: boolean
    /** 漫画翻译器 */
    mangaTranslator?: string
    /** 通用翻译器 */
    commonTranslator?: string
    /** 是否启用工具 */
    enableTools?: boolean
    /** 是否启用鼠标悬停 */
    enableMouseHover?: boolean
    /** 图片翻译提供商 */
    imageTranslateProvider?: string
    /** 悬停最小宽度 */
    hoverMinWidth?: number
    /** 悬停最小高度 */
    hoverMinHeight?: number
    /** 工具最小宽度 */
    toolsMinWidth?: number
    /** 工具最小高度 */
    toolsMinHeight?: number
    /** 并发数 */
    concurrency?: number
    /** 查询间隔时间 */
    queryIntervalTime?: number
    /** 错误次数 */
    errorTimes?: number
    /** 错误间隔 */
    errorInterval?: number
    /** 客户端 OCR 超时 */
    clientOcrTimeout?: number
    /** 客户端翻译超时 */
    clientTranslateTimeout?: number
    /** 是否启用图片翻译 */
    enableImageTranslation?: string
    /** 支持平台 */
    supportPlatform?: Record<string, string>
    /** 检测服务顺序 */
    detectionServiceOrder?: string[]
    /** 工具延迟时间 */
    toolsDelayTime?: number
    /** 客户端支持语言 */
    clientSupportLangs?: string[]
    /** 拉丁语言 */
    latinLang?: string[]
    /** 不支持的正则表达式 */
    notSupportRegexes?: string[]
    /** 忽略错误的正则表达式 */
    ignoreErrorRegexes?: string[]
    /** 不翻译的正则表达式 */
    noTranslateRegexes?: string[]
    /** 移除文本的正则表达式 */
    removeTextRegexes?: string[]
    /** 替换文本的正则表达式 */
    replaceTextRegexes?: Array<[string, string]>
}

/**
 * 词汇表项（计划功能：术语保护）
 */
export interface GlossaryItem {
    /** 键（原文） */
    k: string
    /** 值（译文，空字符串表示跳过不翻译） */
    v: string
}

/**
 * 全局规则配置
 *
 * 分为两类：
 * - A 类（已使用）：DOMTraverser / MutationObserverManager 直接读取
 * - B 类（计划功能）：RuleEngine 在规则合并时处理，下游功能尚未实现
 *
 * 详见 docs/rule-schema.md
 */
export interface GeneralRule {
    // ======== A 类：DOM 选择器（已使用） ========

    /** 翻译目标选择器（空数组 = 全页面模式） */
    selectors?: string[]
    /** 补充选择器（强制包含，即使不在 selectors 范围内） */
    additionalSelectors?: string[]
    /** 排除选择器（最高优先级，永不翻译） */
    excludeSelectors?: string[]
    /** 额外排除选择器（在 excludeSelectors 基础上追加） */
    additionalExcludeSelectors?: string[]
    /** 保留原文选择器（元素自身不翻译，子元素继续处理） */
    stayOriginalSelectors?: string[]
    /** 原子块选择器（整体翻译，不拆分子元素） */
    atomicBlockSelectors?: string[]
    /** 额外内联选择器（将匹配元素视为内联） */
    extraInlineSelectors?: string[]
    /** 额外块级选择器（将匹配元素视为块级） */
    extraBlockSelectors?: string[]

    // ======== A 类：标签过滤（已使用） ========

    /** 排除的 HTML 标签（永不翻译，如 SCRIPT、STYLE、SVG） */
    excludeTags?: string[]
    /** 保留原文的 HTML 标签（如 CODE、TT、IMG） */
    stayOriginalTags?: string[]
    /** 所有块级标签集合（用于判断元素是否为块级） */
    allBlockTags?: string[]
    /** 翻译时保留的标签（翻译后保留标签及其属性，如 A） */
    preserveTagsInTranslation?: string[]

    // ======== A 类：文本阈值（已使用） ========

    /** 块级元素最小字符数，低于此值不翻译（默认 24） */
    blockMinTextCount?: number
    /** 块级元素最小单词数，低于此值不翻译（默认 4） */
    blockMinWordCount?: number
    /** 段落最小字符数，低于此值不翻译（默认 2） */
    paragraphMinTextCount?: number
    /** 段落最小单词数，低于此值不翻译（默认 1） */
    paragraphMinWordCount?: number
    /** 侧边栏元素的最大总字符数阈值 */
    asideMaxTextCount?: number
    /** 侧边栏每段落最大字符数阈值 */
    asideMaxTextCountPerParagraph?: number
    /** 侧边栏每段落最大单词数阈值 */
    asideMaxWordCountPerParagraph?: number

    // ======== A 类：正则过滤（已使用） ========

    /** 内容排除正则（匹配的整段文本跳过翻译） */
    excludeRegexps?: string[]
    /** 不翻译正则（匹配的文本块跳过翻译） */
    noTranslateRegexp?: string[]
    /** 选择器特定正则排除（键为 CSS 选择器，值为正则数组） */
    excludeSelectorsRegexes?: Record<string, string[]>

    // ======== A 类：MutationObserver（已使用） ========

    /** MutationObserver 监听的容器选择器列表 */
    mutationObserverContainerSelectors?: string[]
    /** 排除 MutationObserver 监听的选择器（这些元素的变化不触发翻译） */
    mutationExcludeSelectors?: string[]
    /** DOM 变化触发翻译的防抖延迟（毫秒，默认 10） */
    mutationChangeDelay?: number

    // ======== B 类：DOM 选择器扩展（计划功能） ========

    /**
     * 额外保留原文选择器（Math、KaTeX 等公式元素）
     * @planned 需在 DOMTraverser.matchesStayOriginalSelectors 中与
     *          stayOriginalSelectors 合并后才生效
     */
    additionalStayOriginalSelectors?: string[]
    /**
     * 内联标签列表（RuleEngine 支持站点规则通过 .add/.remove 操作修改此列表）
     * @planned 需在 DOMTraverser 中消费 rule.inlineTags 后才生效
     */
    inlineTags?: string[]

    // ======== B 类：内容注入（计划功能） ========

    /**
     * 站点专属 CSS 注入（在目标页面插入样式以修复布局兼容问题）
     * @planned 需在 ImmersiveTranslator 初始化阶段注入到页面
     */
    injectedCss?: string[]

    // ======== B 类：SPA 兼容（计划功能） ========

    /**
     * 等待选择器列表（在这些元素出现后再启动翻译，用于 SPA 站点）
     * @planned 需在 ImmersiveTranslator.translate() 入口处理 waitForSelectors
     */
    waitForSelectors?: string[]
    /** waitForSelectors 等待超时（毫秒，默认 3000） */
    waitForSelectorsTimeout?: number

    // ======== B 类：术语保护（计划功能） ========

    /**
     * 词汇表（翻译时对指定术语做保护或替换）
     * @planned 需在 UniversalTranslator.buildPrompt 中注入词汇表指令
     */
    glossaries?: GlossaryItem[]

    // ======== B 类：输入框翻译（计划功能） ========

    /**
     * 输入框翻译配置
     * @planned 需实现 inputTranslate content script
     */
    inputConfig?: InputConfig

    // ======== B 类：图片翻译配置（计划功能） ========

    /**
     * 图片翻译规则（站点级配置，用于覆盖全局图片翻译行为）
     * @planned 需在 imageTranslate.tsx 中读取并应用此配置
     */
    imageRule?: ImageRule

    // ======== B 类：翻译容器构建（计划功能） ========

    /**
     * 跳过构建翻译容器的选择器（这些元素不包装翻译容器，如 br、hr）
     * @planned 需在 DOMTraverser 容器构建阶段消费
     */
    skipBuildContainerSelectors?: string[]
    /** 强制构建翻译容器的选择器（如 td） */
    buildContainerSelectors?: string[]
    /** 是否启用跳过构建容器优化 */
    enableSkipBuildContainer?: boolean

    // ======== B 类：MutationObserver 扩展（计划功能） ========

    /**
     * 包含这些子选择器的父元素不触发 MutationObserver 翻译
     * @planned 需在 MutationObserverManager 过滤逻辑中消费
     */
    mutationExcludeContainsSelectors?: string[]
    /** 是否启用 MutationObserver（false 时禁用动态内容翻译） */
    mutationObserverEnabled?: boolean
    /** 是否监听 URL 变化并重新翻译 */
    mutationEnableUrlChange?: boolean
    /** 是否检测翻译结果自身的变化（防止死循环） */
    mutationCheckSelfUpdate?: boolean
    /** 构建翻译容器的防抖延迟（毫秒，默认 100） */
    mutationBuildTimeout?: number
    /** 文本变化处理的防抖延迟（毫秒，默认 100） */
    mutationConsumeTimeout?: number
    /** 同一节点最多翻译次数（防止死循环，默认 3） */
    mutationRepeatTranslateNum?: number
    /** 跳过动态标记元素的选择器（避免翻译插件自身注入的元素） */
    skipDynamicMarkSelectors?: string[]
    /** URL 黑名单（这些 URL 不启用 MutationObserver） */
    mutationBlockUrls?: string[]
}

/**
 * 站点特定规则
 */
export interface SiteRule {
    // ========== 基础信息 ==========
    id: string // 规则唯一标识符，如 "github"

    // ========== 页面匹配 ==========
    matches?: string[] // URL 匹配规则，支持通配符
    // 例如: ["github.com", "*.github.com"]
    excludeMatches?: string[] // URL 排除规则
    // 例如: ["github.com/login"]
    selectorMatches?: string[] // 页面元素匹配（页面识别）
    // 例如: ["meta[property='og:site_name'][content='GitHub']"]

    // ========== DOM选择器配置 ==========
    selectors?: string[] // 🔑 主选择器（白名单）
    // 为空 [] = 全页面模式
    // 非空 = 只翻译匹配区域
    // 例如: [".article", "#main-content"]
    extraBlockSelectors?: string[] // 额外块级选择器
    // 例如: [".post-content", ".blog-body"]

    additionalSelectors?: string[] // 补充选择器（强制包含）
    // 即使不在 selectors 中也会翻译
    // 例如: ["h1", "h2", "h3"]

    additionalExcludeSelectors?: string[] // 额外排除选择器
    // 例如: [".no-translate", "#footer"]

    excludeSelectors?: string[] // 🚫 排除选择器（黑名单，最高优先级）
    // 强制不翻译的区域
    // 例如: ["nav", "footer", ".ad", "code"]

    /** 额外排除选择器 - 在现有 excludeSelectors 基础上添加 */
    ["excludeSelectors.add"]?: string[]

    /** 移除排除选择器 - 从现有 excludeSelectors 中移除 */
    ["excludeSelectors.remove"]?: string[]

    stayOriginalSelectors?: string[] // 🔒 保留原文选择器
    // 元素本身不翻译，但处理子元素
    // 例如: ["pre", "kbd"]

    additionalStayOriginalSelectors?: string[] // 额外保留原文选择器
    // 例如: [".no-translate-special"]

    atomicBlockSelectors?: string[] // ⚛️ 原子块选择器
    // 作为整体翻译，不拆分子元素
    // 例如: ["table td", ".quote-block"]

    extraInlineSelectors?: string[] // 额外内联选择器
    // 例如: [".inline-text", "span.highlight"]
    ["extraInlineSelectors.add"]?: string[]

    // ========== 标签过滤 ==========
    excludeTags?: string[] // 排除的HTML标签（不翻译）
    // 例如: ["SCRIPT", "STYLE", "SVG", "BUTTON"]

    /** 额外排除标签 - 在现有 excludeTags 基础上添加 */
    ["excludeTags.add"]?: string[]

    /** 移除排除标签 - 从现有 excludeTags 中移除 */
    ["excludeTags.remove"]?: string[]

    stayOriginalTags?: string[] // 保留原文的HTML标签
    // 例如: ["CODE", "TT", "IMG", "SUP"]

    /** 额外保留原文标签 - 在现有 stayOriginalTags 基础上添加 */
    ["stayOriginalTags.add"]?: string[]

    /** 移除保留原文标签 - 从现有 stayOriginalTags 中移除 */
    ["stayOriginalTags.remove"]?: string[]

    inlineTags?: string[] // 内联标签（不单独翻译，跟随父元素）
    // 例如: ["A", "SPAN", "B", "I", "STRONG"]

    /** 额外内联标签 - 在现有 inlineTags 基础上添加 */
    ["inlineTags.add"]?: string[]

    /** 移除内联标签 - 从现有 inlineTags 中移除 */
    ["inlineTags.remove"]?: string[]

    // ========== 正则表达式过滤 ==========
    excludeRegexps?: string[] // 内容排除正则表达式
    // 匹配的文本不翻译
    // 例如: ["^\\d+$", "^[A-Z_]+$"]

    noTranslateRegexp?: string[] // 不翻译内容的正则表达式
    // 例如: ["^@\\w+", "^#\\w+"]

    excludeSelectorsRegexes?: Record<string, string[]>
    // 选择器特定的正则排除
    // 键: CSS选择器
    // 值: 正则表达式数组
    // 例如: { "td, th": ["^[0-9,]+$"] }

    // ========== 文本验证配置 ==========
    paragraphMinTextCount?: number // 段落最小字符数（默认: 2）
    // 少于此数量的文本不翻译

    paragraphMinWordCount?: number // 段落最小单词数（默认: 1）
    // 少于此数量的单词不翻译

    blockMinTextCount?: number // 块级元素最小字符数（默认: 24）

    blockMinWordCount?: number // 块级元素最小单词数（默认: 4）

    // ========== MutationObserver配置 ==========
    mutationObserverContainerSelectors?: string[]
    // 监听动态变化的容器
    // 例如: [".timeline", ".feed"]

    mutationExcludeSelectors?: string[] // 排除监听的选择器
    // 这些元素的变化不触发翻译
    // 例如: [".loading", ".skeleton"]

    mutationChangeDelay?: number // 变化延迟触发时间（毫秒，默认: 10）
    // 去抖处理，避免频繁触发

    // ========== 其他配置 ==========
    translationMode?: TranslationMode // 翻译模式（dual/translation/original）
    detectParagraphLanguage?: boolean // 是否检测段落语言
    targetLanguage?: string
}

/**
 * 完整规则配置
 */
export interface RuleConfig {
    /** 全局规则 */
    generalRule: GeneralRule
    /** 站点特定规则列表 */
    rules: SiteRule[]
}

/**
 * 翻译规则
 */
export type TranslationRule = SiteRule & GeneralRule
