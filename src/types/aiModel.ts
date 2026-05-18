export enum AiModel_Platform_Enum {
    HUOSHAN = "huoshan",
    BAILIAN = "bailian",
    ZHIPU = "ZHIPU",
    HUNYUAN = "HUNYUAN",
    DEEPSEEK = "DEEPSEEK",
    OPENAI = "OPENAI",
    MOONSHOT = "MOONSHOT",
    GEMINI = "GEMINI",
    DEEPL = "DEEPL",
    DEEPLX = "DEEPLX",
    SYSTEM = "SYSTEM"
}

export interface BaseModel {
    /** 唯一标识符 */
    id: string
    /** 模型类型（必传） */
    type: AiModel_Platform_Enum
    /** 是否为系统模型 */
    isSystem?: boolean
    /** 是否可用 */
    enabled: boolean
    /** 模型名称（必传） */
    name: string
    /** 模型配置 */
    params: {
        /** 模型名称（必传） */
        modelName: string | number
        /** 基础URL（可选） */
        baseUrl?: string
        /** 模型版本 */
        modelVersion: LLMModel | null
        /** 是否开启思维链(当开启后 GLM-4.6 GLM-4.5 为模型自动判断是否思考，GLM-4.5V 为强制思考) */
        // thinking?: boolean
        /** 接入点 */
        endpoint?: string
        /** API密钥（必传） */
        apiKey: string
    }
}

export interface CommonMessage {
    /** 消息角色（必传） */
    role: "user" | "system"
    /** 消息内容（必传） */
    content: string
}

export type LLMModel =
    | MOONSHOT_LLM
    | GEMINI_LLM
    | DEEPSEEK_LLM
    | QWEN_LLM
    | HUNYUAN_LLM
    | OPENAI_LLM
    | ZHIPU_LLM
    | DOU_BAO_LLM

export enum GEMINI_LLM {
    Gemini_2_5_Pro = 100001,
    Gemini_2_5_Flash = 100003,
    Gemini_2_5_Flash_Lite = 100004,
    Gemini_3_Pro = 100006,
    Gemini_3_Flash = 100007
}

export enum DEEPSEEK_LLM {
    DEEPSEEK_CHAT = 200001,
    DEEPSEEK_REASONER = 200002
}

export enum QWEN_LLM {
    // ==================== 文本生成（Qwen3系列）====================
    QWEN3_MAX = 300001, // 旗舰文本模型，100万Token上下文，复杂任务首选
    QWEN3_PLUS = 300002, // 平衡效果与成本，131K上下文，多轮对话/创意写作
    QWEN3_TURBO = 300003, // 高性价比，60-100 Token/秒输出，基础翻译/问答
    QWEN3_LONG = 300004 // 超长文档模型，1000万Token上下文，合同审查/论文总结
}

export enum HUNYUAN_LLM {
    HY_2_0_THINK = 400001,
    HY_2_0_INSTRUCT = 400002,
    HUNYUAN_TRANSLATION = 400003,
    HUNYUAN_TRANSLATION_LITE = 400004
}

export enum OPENAI_LLM {
    GPT_5 = 500001,
    GPT_5_CHAT = 500002,
    GPT_5_MINI = 500003,
    GPT_5_NANO = 500004,
    GPT_5_2 = 500005,
    GPT_5_2_PRO = 500006
}

export enum MOONSHOT_LLM {
    KIMI_K2_0905_PREVIEW = 600001,
    KIMI_K2_0711_PREVIEW = 600002,
    KIMI_K2_TURBO_PREVIEW = 600003,
    KIMI_K2_THINKING = 600004,
    KIMI_K2_THINKING_TURBO = 600005,
    KIMI_K2_2_5 = 600006
}

export enum ZHIPU_LLM {
    GLM_4_PLUS = 700001,
    GLM_4_AIR_250414 = 700002,
    GLM_4_AIRX = 700003,
    GLM_4_LONG = 700004,
    GLM_4_FLASHX = 700005,
    GLM_4_FLASH_250414 = 700006,
    GLM_4V_PLUS_0111 = 700007,
    GLM_4V_FLASH = 700008
}

export enum DOU_BAO_LLM {
    DOUBAO_SEED_1_8_251228 = 800001,
    GLM_4_7_251222 = 800002,
    DOUBAO_SEED_CODE_PREVIEW_251028 = 800003,
    DOUBAO_SEED_1_6_LITE_251015 = 800004,
    DOUBAO_SEED_1_6_FLASH_250828 = 800005,
    DOUBAO_SEED_1_6_VISION_250815 = 800006
}


export enum SystemLLMModel {
    LLM_MODEL_UNSPECIFIED = 0,
    LLM_MODEL_GLM4_AIR = 1,
    LLM_MODEL_GLM4_AIRX = 2,
    LLM_MODEL_GLM4_FLASHX = 3,
    LLM_MODEL_GLM4_PLUS = 4,
    LLM_MODEL_GLM_4d5_FLASH = 5,
    LLM_MODEL_DEEPSEEK_CHAT = 6,
    LLM_MODEL_DEEPSEEK_R1 = 7,
    LLM_MODEL_GPT4O_MINI = 8,
    LLM_MODEL_GPT4d1_NANO = 9,
    LLM_MODEL_GPT4d1_MINI = 10,
    LLM_MODEL_CLAUDE3_HAIKU = 11,
    LLM_MODEL_YI_LIGHTNING = 12,
    LLM_MODEL_QWEN_2d5_32B_INSTRUCT = 13,
    LLM_MODEL_QWQ_PLUS_LATEST = 14,
    LLM_MODEL_QWEN_MAX_LATEST = 15,
    LLM_MODEL_QWEN_PLUS_LATEST_THINKING = 16,
    LLM_MODEL_QWEN_PLUS_LATEST = 17,
    LLM_MODEL_QWEN_TURBO_LATEST_THINKING = 18,
    LLM_MODEL_QWEN_TURBO_LATEST = 19,
    LLM_MODEL_DOUBAO_1d5_PRO = 20,
    LLM_MODEL_DOUBAO_1d5_LITE_32K = 21,
    LLM_MODEL_DOUBAO_1d5_THINKING_PRO_250415 = 22,
    LLM_MODEL_GEMINI_2d0_FLASH = 23,
    LLM_MODEL_GEMINI_2d5_FLASH = 24,
    LLM_MODEL_GEMINI_2d5_FLASH_LITE = 25,
    LLM_MODEL_KIMI_K2 = 26,
    LLM_MODEL_BAAI_BGE_M3 = 27,
    LLM_MODEL_ZHIPU_EMBEDDING_3 = 28,
    LLM_MODEL_BAAI_RERANK_V2_M3 = 29,
    LLM_MODEL_ZHIPU_RERANK = 30
}

export type ModelOption = {
    /**
     * @generated from field: schema.LLMModel model = 1;
     */
    model: LLMModel

    /**
     * @generated from field: int32 try_cnt = 2;
     */
    tryCnt: number
}