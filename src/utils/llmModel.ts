import { find } from "ramda"

import {
    ALIYUN_BAILIAN_MODEL_NAMES,
    DEEPSEEK_MODEL_NAMES,
    GEMINI_MODEL_NAMES,
    HUNYUAN_MODEL_NAMES,
    Huoshan_LLM_MODEL_NAMES,
    MOONSHOT_MODEL_NAMES,
    OPENAI_MODEL_NAMES,
    THINKING_CAPABLE_MODELS,
    ZHIPU_MODEL_NAMES
} from "@/constants/model"
import type { BaseModel, LLMModel } from "@/types"

/**
 * 获取 LLM 模型的显示名称
 */
export function getLLMModelName(model: LLMModel): string {
    return (
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
    return find(item => item.id === model, modelList)
}

/**
 * 检查模型是否支持思考能力
 * @param model - 模型版本号
 * @returns 是否支持思考能力
 */
export function isThinkingCapableModel(
    model: LLMModel | undefined | null
): boolean {
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
export function isModelThinkingCapable(
    model: BaseModel | undefined | null
): boolean {
    if (!model?.params?.modelVersion) {
        return false
    }
    return isThinkingCapableModel(model.params.modelVersion)
}
