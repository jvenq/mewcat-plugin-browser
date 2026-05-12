import { find } from "ramda"

import {
    ALIYUN_BAILIAN_MODEL_NAMES,
    DEEPSEEK_MODEL_NAMES,
    GEMINI_MODEL_NAMES,
    HUNYUAN_MODEL_NAMES,
    Huoshan_LLM_MODEL_NAMES,
    MOONSHOT_MODEL_NAMES,
    OPENAI_MODEL_NAMES,
    SYSTEM_LLM_MODEL_NAMES,
    THINKING_CAPABLE_MODELS,
    ZHIPU_MODEL_NAMES
} from "@/constants/model"
import { SystemLLMModel, type BaseModel, type LLMModel } from "@/types/aiModel"

/**
 * 已上线的模型列表（从后端 API 获取）
 * 只有这些模型会显示在选择框中
 */
export const ONLINE_MODELS = new Set<SystemLLMModel>([
    // SystemLLMModel.LLM_MODEL_DEEPSEEK_CHAT, // 21
    // SystemLLMModel.LLM_MODEL_GPT4d1_NANO, // 32
    // SystemLLMModel.LLM_MODEL_GPT4d1_MINI, // 33
    // SystemLLMModel.LLM_MODEL_QWEN_MAX_LATEST, // 63
    // SystemLLMModel.LLM_MODEL_QWEN_PLUS_LATEST, // 65
    // SystemLLMModel.LLM_MODEL_QWEN_TURBO_LATEST, // 67
    // SystemLLMModel.LLM_MODEL_DOUBAO_1d5_PRO, // 71
    SystemLLMModel.LLM_MODEL_DOUBAO_1d5_LITE_32K // 72
    // 74: LLM_MODEL_DOUBAO_SEED_1d6_NO_THINKING_250615 - 暂未在枚举中定义
    // SystemLLMModel.LLM_MODEL_GEMINI_2d5_FLASH_LITE, // 83
    // SystemLLMModel.LLM_MODEL_GLM_4d5_FLASH // glm-4.5-flash
    // SystemLLMModel.LLM_MODEL_KIMI_K2 // 91
])

/**
 * 模型是否需要订阅
 */
export const SUBSCRIPTION_REQUIRED_MODELS = new Set<SystemLLMModel>([
    SystemLLMModel.LLM_MODEL_DEEPSEEK_CHAT, // 21
    SystemLLMModel.LLM_MODEL_GPT4d1_MINI, // 33
    SystemLLMModel.LLM_MODEL_QWEN_MAX_LATEST, // 63
    SystemLLMModel.LLM_MODEL_QWEN_PLUS_LATEST, // 65
    SystemLLMModel.LLM_MODEL_DOUBAO_1d5_PRO, // 71
    // 74: Doubao-Seed-1.6 - 需要订阅
    SystemLLMModel.LLM_MODEL_GEMINI_2d5_FLASH_LITE, // 83
    SystemLLMModel.LLM_MODEL_KIMI_K2 // 91
])

/**
 * LLM 模型选项（仅包含已上线的模型）
 * 按订阅要求和模型ID排序
 */
export const SYSTEM_LLM_MODEL_OPTIONS = [
    // 免费模型
    {
        value: SystemLLMModel.LLM_MODEL_GPT4d1_NANO,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_GPT4d1_NANO]} 免费`
    },
    {
        value: SystemLLMModel.LLM_MODEL_QWEN_TURBO_LATEST,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_QWEN_TURBO_LATEST]} 免费`
    },
    {
        value: SystemLLMModel.LLM_MODEL_DOUBAO_1d5_LITE_32K,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_DOUBAO_1d5_LITE_32K]} 免费`
    },
    {
        value: SystemLLMModel.LLM_MODEL_GLM_4d5_FLASH,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_GLM_4d5_FLASH]} 免费`
    },

    // 订阅模型
    {
        value: SystemLLMModel.LLM_MODEL_DEEPSEEK_CHAT,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_DEEPSEEK_CHAT]}`
    },
    {
        value: SystemLLMModel.LLM_MODEL_GPT4d1_MINI,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_GPT4d1_MINI]}`
    },
    {
        value: SystemLLMModel.LLM_MODEL_QWEN_MAX_LATEST,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_QWEN_MAX_LATEST]}`
    },
    {
        value: SystemLLMModel.LLM_MODEL_QWEN_PLUS_LATEST,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_QWEN_PLUS_LATEST]}`
    },
    {
        value: SystemLLMModel.LLM_MODEL_DOUBAO_1d5_PRO,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_DOUBAO_1d5_PRO]}`
    },
    {
        value: SystemLLMModel.LLM_MODEL_GEMINI_2d5_FLASH_LITE,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_GEMINI_2d5_FLASH_LITE]}`
    },
    {
        value: SystemLLMModel.LLM_MODEL_KIMI_K2,
        label: `${SYSTEM_LLM_MODEL_NAMES[SystemLLMModel.LLM_MODEL_KIMI_K2]}`
    }
].filter(option => ONLINE_MODELS.has(option.value))

/**
 * 检查模型是否已上线
 */
export function isOnlineModel(model: SystemLLMModel): boolean {
    return ONLINE_MODELS.has(model)
}

/**
 * 检查模型是否需要订阅
 */
export function isSubscriptionRequired(model: SystemLLMModel): boolean {
    return SUBSCRIPTION_REQUIRED_MODELS.has(model)
}

/**
 * 检查模型是否为翻译模型（排除 Embedding 和 Rerank）
 */
export function isTranslationModel(model: SystemLLMModel): boolean {
    return model < 20000 // Embedding 和 Rerank 模型的值都大于等于 20000
}

/**
 * 获取 LLM 模型的显示名称
 */
export function getLLMModelName(model: LLMModel): string {
    return (
        SYSTEM_LLM_MODEL_NAMES[model] ||
        OPENAI_MODEL_NAMES[model] ||
        ZHIPU_MODEL_NAMES[model] ||
        GEMINI_MODEL_NAMES[model] ||
        ALIYUN_BAILIAN_MODEL_NAMES[model] ||
        DEEPSEEK_MODEL_NAMES[model] ||
        MOONSHOT_MODEL_NAMES[model] ||
        HUNYUAN_MODEL_NAMES[model] ||
        Huoshan_LLM_MODEL_NAMES[model] ||
        `未知模型 (${model})`
    )
}

export function getModelByModelList(modelList: BaseModel[], model: string) {
    return find(
        item => item.id === model,
        modelList
    )
}

/**
 * 检查模型是否支持思考能力
 * @param model - 模型版本号
 * @returns 是否支持思考能力
 */
export function isThinkingCapableModel(model: LLMModel | undefined | null): boolean {
    if (!model) {
        return false
    }
    return THINKING_CAPABLE_MODELS.has(model)
}

/**
 * 检查 BaseModel 是否支持思考能力
 * @param model - BaseModel 对象
 * @returns 是否支持思考能力
 */
export function isModelThinkingCapable(model: BaseModel | undefined | null): boolean {
    if (!model?.params?.modelVersion) {
        return false
    }
    return isThinkingCapableModel(model.params.modelVersion)
}
