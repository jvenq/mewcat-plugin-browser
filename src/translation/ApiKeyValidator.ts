import { AiModel_Platform_Enum, AiRole } from "@/types"

import { UniversalTranslator } from "./UniversalTranslator"

export type ValidateApiKeyParams = {
    apiKey: string
    baseUrl?: string
    endpoint?: string
    model?: string
}

/**
 * API Key 验证器
 * 用于验证各种AI翻译服务的API Key是否有效
 */
export class ApiKeyValidator {
    /**
     * 验证火山引擎API Key
     */
    static async validateHuoshanApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, endpoint, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.HUOSHAN,
                {
                    apiKey,
                    baseUrl,
                    model,
                    endpoint, // 兼容原有逻辑：用endpoint作为模型参数
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("火山引擎API Key验证失败:", error)
            return false
        }
    }

    /**
     * 验证阿里百炼API Key
     */
    static async validateBaiLianApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, endpoint, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.BAILIAN,
                {
                    apiKey,
                    baseUrl,
                    model, // 阿里百炼默认验证模型
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("阿里百炼API Key验证失败:", error)
            return false
        }
    }

    /**
     * 验证智谱API Key
     */
    static async validateZhipuApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.ZHIPU,
                {
                    apiKey,
                    baseUrl,
                    model, // 智谱默认轻量验证模型
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("智谱API Key验证失败:", error)
            return false
        }
    }

    // ------------------------------
    // 新增：DeepSeek API Key 验证
    // ------------------------------
    static async validateDeepSeekApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.DEEPSEEK,
                {
                    apiKey,
                    model, // 默认验证模型（通用轻量型）
                    baseUrl, // 默认官方地址
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("DeepSeek API Key验证失败:", error)
            return false
        }
    }

    // ------------------------------
    // 新增：ChatGPT（OpenAI）API Key 验证
    // ------------------------------
    static async validateOpenAiApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.OPENAI,
                {
                    apiKey,
                    model, // 默认验证模型（低成本高兼容性）
                    baseUrl: baseUrl, // 默认官方地址
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("ChatGPT API Key验证失败:", error)
            return false
        }
    }

    // ------------------------------
    // 新增：Moonshot（月之暗面）API Key 验证
    // ------------------------------
    static async validateMoonshotApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.MOONSHOT,
                {
                    apiKey,
                    model, // 默认验证模型（8k上下文，兼容性强）
                    baseUrl, // 默认官方地址
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("Moonshot API Key验证失败:", error)
            return false
        }
    }

    // ------------------------------
    // 新增：Gemini（Google）API Key 验证
    // ------------------------------
    static async validateGeminiApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.GEMINI,
                {
                    apiKey,
                    model, // 默认验证模型（免费额度充足）
                    baseUrl, // 默认官方地址
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("Gemini API Key验证失败:", error)
            return false
        }
    }

    static async validateDeeplApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.DEEPL,
                {
                    apiKey,
                    model, // 默认验证模型
                    baseUrl, // 默认官方地址
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("DeepL API Key验证失败:", error)
            return false
        }
    }

    static async validateDeeplxApiKey(
        params: ValidateApiKeyParams
    ): Promise<boolean> {
        const { apiKey, model, baseUrl } = params
        try {
            const translator = new UniversalTranslator(
                AiModel_Platform_Enum.DEEPLX,
                {
                    apiKey,
                    model, // 默认验证模型
                    baseUrl, // 默认官方地址
                    aiRole: AiRole.DEFAULT
                }
            )
            return await translator.checkConnection()
        } catch (error) {
            console.error("DeepLX API Key验证失败:", error)
            return false
        }
    }

    // ------------------------------
    // 扩展：批量验证所有AI模型API Key
    // ------------------------------
    // static async validateApiKeys(list: BaseModel[]): Promise<boolean[]> {
    //     // 并行执行所有验证（用Promise.allSettled避免单个失败影响整体）

    //     return Promise.allSettled(list.map(model => {)
    // }
}
