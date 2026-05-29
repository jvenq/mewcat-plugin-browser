import { find } from "ramda"

import { platformNameMap } from "@/constants"
import { Toast, ToastType } from "@/utils/toast"

import { AiModel_Platform_Enum, type Message } from "../types"
import type { ExtensionConfig } from "../types/config"
import { UniversalTranslator } from "./UniversalTranslator"

/**
 * TranslationServiceManager 构造函数配置
 * 只包含实际使用的属性
 */
export interface TranslationServiceManagerConfig {
    currentModel?: string
    /** AI模型列表（必传） */
    aiModelList: ExtensionConfig["aiModelList"]
    /** AI角色（必传） */
    aiRole: ExtensionConfig["aiRole"]
    /** 每秒最大请求数（可选） */
    maxRequestsPerSecond?: number
    /** 单次请求最大文本长度（可选） */
    maxTextLengthPerRequest?: number
    /** 目标语言（可选） */
    targetLanguage?: string
    /** 是否启用Google翻译（可选） */
    enableGoogleTranslate?: boolean
    /** 是否启用微软翻译（可选） */
    enableMicrosoftTranslate?: boolean
    /** 是否启用腾讯翻译（可选） */
    enableTencentTranslate?: boolean
    /** 是否启用思考能力（可选） */
    enableThinking?: boolean
}

/**
 * 翻译服务管理器
 * 根据用户配置动态选择和管理翻译服务
 */
export class TranslationServiceManager {
    private config: TranslationServiceManagerConfig
    private translators: Map<AiModel_Platform_Enum, UniversalTranslator> =
        new Map()

    constructor(config: TranslationServiceManagerConfig) {
        this.config = config
        this.initializeTranslators()
    }

    /**
     * 更新配置
     */
    public updateConfig(newConfig: TranslationServiceManagerConfig) {
        this.config = newConfig
        this.initializeTranslators()
    }

    /**
     * 初始化翻译器
     */
    private async initializeTranslators() {
        this.translators.clear()
        const model = find(
            model => model.id === this.config.currentModel,
            this.config.aiModelList
        )

        if (model) {
            if (
                model.type !== AiModel_Platform_Enum.GOOGLE &&
                !model?.params?.apiKey?.trim()
            ) {
                Toast.show({
                    type: ToastType.ERROR,
                    message: `${model.name || platformNameMap[model.type]} 配置不完整，缺少：API Key，请在设置中填写后再使用。`
                })
                return
            }
            try {
                const isOfficial = model.params.isOfficial !== false
                const baseUrl = isOfficial ? undefined : model.params.baseUrl
                const translator = new UniversalTranslator(model.type, {
                    apiKey: model.params.apiKey,
                    model: model.params.modelName,
                    aiRole: this.config.aiRole,
                    baseUrl,
                    enableThinking: this.config.enableThinking
                })
                this.translators.set(model.type, translator)
            } catch (error) {
                Toast.show({
                    type: ToastType.ERROR,
                    message: `${model.name || platformNameMap[model.type]} 初始化失败：${error instanceof Error ? error.message : String(error)}`
                })
            }
        }
    }

    /**
     * 获取可用的翻译器
     */
    public getAvailableTranslators(): string[] {
        return Array.from(this.translators.keys())
    }

    /**
     * 获取首选翻译器
     * 按优先级返回第一个可用的翻译器（原有优先级 + 新增模型优先级）
     */
    public getPreferredTranslator(): UniversalTranslator | null {
        for (const model of this.config.aiModelList) {
            if (this.translators.has(model.type)) {
                return this.translators.get(model.type)!
            }
        }

        return null
    }

    /**
     * 获取指定的翻译器
     */
    public getTranslator(
        name: AiModel_Platform_Enum
    ): UniversalTranslator | null {
        return this.translators.get(name) || null
    }

    /**
     * 执行翻译
     */
    public async translateText(
        messages: Message[],
        targetLang: string
    ): Promise<string> {
        const translator = this.getPreferredTranslator()
        if (!translator) {
            throw new Error("没有可用的翻译服务")
        }

        const result = await translator.translateText(messages, targetLang)
        return result
    }

    /**
     * 执行批量翻译
     */
    public async translateBatch(
        messages: Message[],
        targetLang: string
    ): Promise<string> {
        const translator = this.getPreferredTranslator()
        if (!translator) {
            throw new Error("没有可用的翻译服务")
        }
        return translator.translateBatch(messages, targetLang)
    }

    /**
     * 检查翻译服务连接
     */
    public async checkConnection(): Promise<boolean> {
        const translator = this.getPreferredTranslator()
        if (!translator) {
            return false
        }

        return translator.checkConnection()
    }

    /**
     * 获取翻译配置
     */
    public getTranslationConfig() {
        const aiModelServices = this.config.aiModelList.reduce(
            (acc, model) => {
                acc[model.type] = model.enabled
                return acc
            },
            {} as Record<string, boolean>
        )

        return {
            maxRequestsPerSecond: this.config.maxRequestsPerSecond || 3,
            maxTextLengthPerRequest:
                this.config.maxTextLengthPerRequest || 1024,
            targetLanguage: this.config.targetLanguage || "zh-CN",
            enabledServices: {
                ...aiModelServices,
                // 传统翻译服务
                google: this.config.enableGoogleTranslate || false,
                microsoft: this.config.enableMicrosoftTranslate || false,
                tencent: this.config.enableTencentTranslate || false
            }
        }
    }

    /**
     * 是否启用了任何AI翻译服务
     */
    public hasAITranslationEnabled(): boolean {
        return (
            // 原有AI服务
            this.config.aiModelList.some(model => model.enabled)
        )
    }

    /**
     * 是否启用了传统翻译服务
     */
    public hasTraditionalTranslationEnabled(): boolean {
        return (
            this.config.enableGoogleTranslate ||
            this.config.enableMicrosoftTranslate ||
            this.config.enableTencentTranslate ||
            false
        )
    }

    /**
     * 获取服务状态
     */
    public async getServiceStatus(): Promise<Record<string, boolean>> {
        const status: Record<string, boolean> = {}

        // 自动遍历所有已初始化的翻译器（含新增模型）
        for (const [name, translator] of this.translators) {
            try {
                status[name] = await translator.checkConnection()
            } catch {
                status[name] = false
            }
        }

        return status
    }

    /**
     * 取消所有正在进行的翻译请求
     */
    public abortAllTranslations(): void {
        for (const [_, translator] of this.translators) {
            translator.abortAllTranslations()
        }
    }

    /**
     * 生成页面内容摘要
     * @param title 页面标题
     * @param textContent 页面正文内容
     * @returns 生成的摘要文本
     */
    public async buildAiSummary(
        title: string,
        textContent: string
    ): Promise<string> {
        const model = find(
            model => model.id === this.config.currentModel,
            this.config.aiModelList
        )

        if (!model) {
            console.warn(
                "[TranslationServiceManager] 未找到当前模型，无法生成摘要"
            )
            return ""
        }

        const translator = this.translators.get(model.type)
        if (!translator) {
            console.warn(
                "[TranslationServiceManager] 翻译器未初始化，无法生成摘要"
            )
            return ""
        }

        try {
            return await translator.buildAiSummary(title, textContent)
        } catch (error) {
            console.error("[TranslationServiceManager] 生成摘要失败:", error)
            return ""
        }
    }
}

// 单例模式
let translationServiceManager: TranslationServiceManager | null = null

/**
 * 获取翻译服务管理器实例
 */
export function getTranslationServiceManager(
    config: TranslationServiceManagerConfig
): TranslationServiceManager {
    if (!translationServiceManager) {
        translationServiceManager = new TranslationServiceManager(config)
    } else {
        translationServiceManager.updateConfig(config)
    }
    return translationServiceManager
}

/**
 * 重置翻译服务管理器
 */
export function resetTranslationServiceManager(): void {
    translationServiceManager = null
}
