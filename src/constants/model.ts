import {
    AiModel_Platform_Enum,
    DEEPSEEK_LLM,
    DOU_BAO_LLM,
    GEMINI_LLM,
    HUNYUAN_LLM,
    MOONSHOT_LLM,
    OPENAI_LLM,
    ZHIPU_LLM,
    type LLMModel
} from "@/types"

/**
 * LLM 模型选项（仅包含已上线的模型）
 * 按订阅要求和模型ID排序
 */

export const GEMINI_MODEL_LIST: GEMINI_LLM[] = [
    GEMINI_LLM.Gemini_3_Pro,
    GEMINI_LLM.Gemini_3_Flash,
    GEMINI_LLM.Gemini_2_5_Pro,
    GEMINI_LLM.Gemini_2_5_Flash,
    GEMINI_LLM.Gemini_2_5_Flash_Lite
]

export const GEMINI_MODEL_NAMES: Record<GEMINI_LLM, string> = {
    [GEMINI_LLM.Gemini_3_Pro]: "gemini-3-pro-preview",
    [GEMINI_LLM.Gemini_3_Flash]: "gemini-3-flash-preview",
    [GEMINI_LLM.Gemini_2_5_Pro]: "gemini-2.5-pro",
    [GEMINI_LLM.Gemini_2_5_Flash]: "gemini-2.5-flash",
    [GEMINI_LLM.Gemini_2_5_Flash_Lite]: "gemini-2.5-flash-lite"
}

export const DEEPSEEK_MODEL_LIST: DEEPSEEK_LLM[] = [
    DEEPSEEK_LLM.DEEPSEEK_CHAT,
    DEEPSEEK_LLM.DEEPSEEK_REASONER
]

export const DEEPSEEK_MODEL_NAMES: Record<DEEPSEEK_LLM, string> = {
    [DEEPSEEK_LLM.DEEPSEEK_CHAT]: "deepseek-chat",
    [DEEPSEEK_LLM.DEEPSEEK_REASONER]: "deepseek-reasoner"
}

export const ALIYUN_BAILIAN_MODEL_LIST: DOU_BAO_LLM[] = [
    DOU_BAO_LLM.DOUBAO_SEED_1_8_251228,
    DOU_BAO_LLM.GLM_4_7_251222,
    DOU_BAO_LLM.DOUBAO_SEED_CODE_PREVIEW_251028,
    DOU_BAO_LLM.DOUBAO_SEED_1_6_LITE_251015,
    DOU_BAO_LLM.DOUBAO_SEED_1_6_FLASH_250828,
    DOU_BAO_LLM.DOUBAO_SEED_1_6_VISION_250815
]

export const ALIYUN_BAILIAN_MODEL_NAMES: Record<DOU_BAO_LLM, string> = {
    [DOU_BAO_LLM.DOUBAO_SEED_1_8_251228]: "doubao-seed-1.8-251228",
    [DOU_BAO_LLM.GLM_4_7_251222]: "glm-4.7-251222",
    [DOU_BAO_LLM.DOUBAO_SEED_CODE_PREVIEW_251028]:
        "doubao-seed-code-preview-251028",
    [DOU_BAO_LLM.DOUBAO_SEED_1_6_LITE_251015]: "doubao-seed-1.6-lite-251015",
    [DOU_BAO_LLM.DOUBAO_SEED_1_6_FLASH_250828]: "doubao-seed-1.6-flash-250828",
    [DOU_BAO_LLM.DOUBAO_SEED_1_6_VISION_250815]: "doubao-seed-1.6-vision-250815"
}

export const HUNYUAN_MODEL_LIST: HUNYUAN_LLM[] = [
    HUNYUAN_LLM.HUNYUAN_TRANSLATION,
    HUNYUAN_LLM.HUNYUAN_TRANSLATION_LITE,
    HUNYUAN_LLM.HY_2_0_INSTRUCT,
    HUNYUAN_LLM.HY_2_0_THINK
]

export const HUNYUAN_MODEL_NAMES: Record<HUNYUAN_LLM, string> = {
    [HUNYUAN_LLM.HUNYUAN_TRANSLATION]: "hunyuan-translation",
    [HUNYUAN_LLM.HUNYUAN_TRANSLATION_LITE]: "hunyuan-translation-lite",
    [HUNYUAN_LLM.HY_2_0_INSTRUCT]:
        "Tencent HY 2.0 Instruct（hunyuan-2.0-instruct-20251111）",
    [HUNYUAN_LLM.HY_2_0_THINK]:
        "Tencent HY 2.0 Think（hunyuan-2.0-thinking-20251109）"
}

export const OPENAI_MODEL_LIST: OPENAI_LLM[] = [
    OPENAI_LLM.GPT_5,
    OPENAI_LLM.GPT_5_CHAT,
    OPENAI_LLM.GPT_5_MINI,
    OPENAI_LLM.GPT_5_NANO,
    OPENAI_LLM.GPT_5_2
]

export const OPENAI_MODEL_NAMES: Record<OPENAI_LLM, string> = {
    [OPENAI_LLM.GPT_5]: "gpt-5",
    [OPENAI_LLM.GPT_5_CHAT]: "gpt-5-chat",
    [OPENAI_LLM.GPT_5_MINI]: "gpt-5-mini",
    [OPENAI_LLM.GPT_5_NANO]: "gpt-5-nano",
    [OPENAI_LLM.GPT_5_2]: "gpt-5.2-2025-12-11",
    [OPENAI_LLM.GPT_5_2_PRO]: "gpt-5.2-pro-2025-12-11"
}

export const MOONSHOT_MODEL_LIST: MOONSHOT_LLM[] = [
    MOONSHOT_LLM.KIMI_K2_0905_PREVIEW,
    MOONSHOT_LLM.KIMI_K2_0711_PREVIEW,
    MOONSHOT_LLM.KIMI_K2_TURBO_PREVIEW,
    MOONSHOT_LLM.KIMI_K2_THINKING,
    MOONSHOT_LLM.KIMI_K2_THINKING_TURBO
]

export const MOONSHOT_MODEL_NAMES: Record<MOONSHOT_LLM, string> = {
    [MOONSHOT_LLM.KIMI_K2_0905_PREVIEW]: "kimi-k2-0905-preview",
    [MOONSHOT_LLM.KIMI_K2_0711_PREVIEW]: "kimi-k2-0711-preview",
    [MOONSHOT_LLM.KIMI_K2_TURBO_PREVIEW]: "kimi-k2-turbo-preview",
    [MOONSHOT_LLM.KIMI_K2_THINKING]: "kimi-k2-thinking",
    [MOONSHOT_LLM.KIMI_K2_THINKING_TURBO]: "kimi-k2-thinking-turbo",
    [MOONSHOT_LLM.KIMI_K2_2_5]: "kimi-k2-2.5"
}

export const ZHIPU_MODEL_LIST: ZHIPU_LLM[] = [
    ZHIPU_LLM.GLM_4_PLUS,
    ZHIPU_LLM.GLM_4_AIR_250414,
    ZHIPU_LLM.GLM_4_AIRX,
    ZHIPU_LLM.GLM_4_LONG,
    ZHIPU_LLM.GLM_4_FLASHX,
    ZHIPU_LLM.GLM_4_FLASH_250414,
    ZHIPU_LLM.GLM_4V_PLUS_0111,
    ZHIPU_LLM.GLM_4V_FLASH
]

export const ZHIPU_MODEL_NAMES: Record<ZHIPU_LLM, string> = {
    [ZHIPU_LLM.GLM_4_PLUS]: "glm-4-plus",
    [ZHIPU_LLM.GLM_4_AIR_250414]: "glm-4-air-250414",
    [ZHIPU_LLM.GLM_4_AIRX]: "glm-4-airx",
    [ZHIPU_LLM.GLM_4_LONG]: "glm-4-long",
    [ZHIPU_LLM.GLM_4_FLASHX]: "glm-4-flashx",
    [ZHIPU_LLM.GLM_4_FLASH_250414]: "glm-4-flash-250414",
    [ZHIPU_LLM.GLM_4V_PLUS_0111]: "glm-4v-plus-0111",
    [ZHIPU_LLM.GLM_4V_FLASH]: "glm-4v-flash"
}

export const Huoshan_LLM_MODEL_LIST: DOU_BAO_LLM[] = [
    DOU_BAO_LLM.DOUBAO_SEED_1_8_251228,
    DOU_BAO_LLM.GLM_4_7_251222,
    DOU_BAO_LLM.DOUBAO_SEED_CODE_PREVIEW_251028,
    DOU_BAO_LLM.DOUBAO_SEED_1_6_LITE_251015,
    DOU_BAO_LLM.DOUBAO_SEED_1_6_FLASH_250828,
    DOU_BAO_LLM.DOUBAO_SEED_1_6_VISION_250815
]

export const Huoshan_LLM_MODEL_NAMES: Record<DOU_BAO_LLM, string> = {
    [DOU_BAO_LLM.DOUBAO_SEED_1_8_251228]: "doubao-seed-1.8-251228",
    [DOU_BAO_LLM.GLM_4_7_251222]: "glm-4.7-251222",
    [DOU_BAO_LLM.DOUBAO_SEED_CODE_PREVIEW_251028]:
        "doubao-seed-code-preview-251028",
    [DOU_BAO_LLM.DOUBAO_SEED_1_6_LITE_251015]: "doubao-seed-1.6-lite-251015",
    [DOU_BAO_LLM.DOUBAO_SEED_1_6_FLASH_250828]: "doubao-seed-1.6-flash-250828",
    [DOU_BAO_LLM.DOUBAO_SEED_1_6_VISION_250815]: "doubao-seed-1.6-vision-250815"
}

export const aiModelListMap = new Map<AiModel_Platform_Enum, LLMModel[]>([
    [AiModel_Platform_Enum.GEMINI, GEMINI_MODEL_LIST],
    [AiModel_Platform_Enum.DEEPSEEK, DEEPSEEK_MODEL_LIST],
    [AiModel_Platform_Enum.BAILIAN, ALIYUN_BAILIAN_MODEL_LIST],
    // [AiModel_Platform_Enum.QIAN_WEN, QIAN_WEN_MODEL_LIST],
    [AiModel_Platform_Enum.ZHIPU, ZHIPU_MODEL_LIST],
    [AiModel_Platform_Enum.HUNYUAN, HUNYUAN_MODEL_LIST],
    [AiModel_Platform_Enum.OPENAI, OPENAI_MODEL_LIST],
    [AiModel_Platform_Enum.MOONSHOT, MOONSHOT_MODEL_LIST],
    [AiModel_Platform_Enum.HUOSHAN, Huoshan_LLM_MODEL_LIST]
])

/**
 * 支持思考能力的平台白名单
 * 这些平台的模型可在「启用思考能力」开关中显示
 */
export const THINKING_CAPABLE_PLATFORMS = new Set<AiModel_Platform_Enum>([
    AiModel_Platform_Enum.DEEPSEEK,
    AiModel_Platform_Enum.MOONSHOT,
    AiModel_Platform_Enum.BAILIAN,
    AiModel_Platform_Enum.HUOSHAN,
    AiModel_Platform_Enum.GEMINI,
    AiModel_Platform_Enum.ZHIPU,
    AiModel_Platform_Enum.HUNYUAN
])

/**
 * 各平台官方默认模型名称
 * 选择「官方模型」时使用，输入框只读展示；HUOSHAN 依赖 endpoint 配置，不设默认值
 */
export const PLATFORM_OFFICIAL_MODEL_NAMES: Partial<
    Record<AiModel_Platform_Enum, string>
> = {
    [AiModel_Platform_Enum.DEEPSEEK]: "deepseek-chat",
    [AiModel_Platform_Enum.OPENAI]: "gpt-5",
    [AiModel_Platform_Enum.MOONSHOT]: "kimi-k2-0905-preview",
    [AiModel_Platform_Enum.GEMINI]: "gemini-3-pro-preview",
    [AiModel_Platform_Enum.BAILIAN]: "doubao-seed-1.8-251228",
    [AiModel_Platform_Enum.ZHIPU]: "glm-4-plus",
    [AiModel_Platform_Enum.HUNYUAN]: "hunyuan-translation"
}

/**
 * 各平台官方默认 baseUrl
 * 选择「官方模型」时使用，输入框只读展示
 */
export const PLATFORM_OFFICIAL_BASE_URLS: Record<
    AiModel_Platform_Enum,
    string
> = {
    [AiModel_Platform_Enum.HUOSHAN]: "https://ark.cn-beijing.volces.com",
    [AiModel_Platform_Enum.BAILIAN]:
        "https://dashscope.aliyuncs.com/compatible-mode",
    [AiModel_Platform_Enum.ZHIPU]: "https://open.bigmodel.cn",
    [AiModel_Platform_Enum.HUNYUAN]: "https://api.hunyuan.cloud.tencent.com",
    [AiModel_Platform_Enum.DEEPSEEK]: "https://api.deepseek.com",
    [AiModel_Platform_Enum.OPENAI]: "https://api.openai.com",
    [AiModel_Platform_Enum.MOONSHOT]: "https://api.moonshot.cn",
    [AiModel_Platform_Enum.GEMINI]:
        "https://generativelanguage.googleapis.com/v1beta/models",
    [AiModel_Platform_Enum.DEEPL]: "https://api-free.deepl.com",
    [AiModel_Platform_Enum.DEEPLX]: "https://api.deeplx.org",
    [AiModel_Platform_Enum.GOOGLE]:
        "https://translate-pa.googleapis.com/v1/translateHtml"
}
