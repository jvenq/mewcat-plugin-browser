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
    DEEPLX = "DEEPLX"
}

export interface BaseModel {
    /** 唯一标识符 */
    id: string
    /** 模型类型（必传） */
    type: AiModel_Platform_Enum
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
    | SystemLLMModel
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

/**
 * @generated from enum schema.LLMModel
 */
export enum SystemLLMModel {
    /**
     * 通用模型
     *
     * 除非模型不影响结果，否则尽量不要使用
     *
     * @generated from enum value: LLM_MODEL_UNSPECIFIED = 0;
     */
    LLM_MODEL_UNSPECIFIED = 0,

    /**
     * glm-4-air
     *
     * @generated from enum value: LLM_MODEL_GLM4_AIR = 11;
     */
    LLM_MODEL_GLM4_AIR = 11,

    /**
     * glm-4-airx
     *
     * @generated from enum value: LLM_MODEL_GLM4_AIRX = 12;
     */
    LLM_MODEL_GLM4_AIRX = 12,

    /**
     * glm-4-flashx
     *
     * @generated from enum value: LLM_MODEL_GLM4_FLASHX = 13;
     */
    LLM_MODEL_GLM4_FLASHX = 13,

    /**
     * glm-4-plus
     *
     * @generated from enum value: LLM_MODEL_GLM4_PLUS = 14;
     */
    LLM_MODEL_GLM4_PLUS = 14,

    LLM_MODEL_GLM_4d5_FLASH = 16,

    /**
     * deepseek-chat
     *
     * @generated from enum value: LLM_MODEL_DEEPSEEK_CHAT = 21;
     */
    LLM_MODEL_DEEPSEEK_CHAT = 21,

    /**
     * deepseek-r1
     *
     * @generated from enum value: LLM_MODEL_DEEPSEEK_R1 = 22;
     */
    LLM_MODEL_DEEPSEEK_R1 = 22,

    /**
     * gpt-4o-mini
     *
     * @generated from enum value: LLM_MODEL_GPT4O_MINI = 31;
     */
    LLM_MODEL_GPT4O_MINI = 31,

    /**
     * gpt-4.1-nano
     *
     * @generated from enum value: LLM_MODEL_GPT4d1_NANO = 32;
     */
    LLM_MODEL_GPT4d1_NANO = 32,

    /**
     * gpt-4.1-mini
     *
     * @generated from enum value: LLM_MODEL_GPT4d1_MINI = 33;
     */
    LLM_MODEL_GPT4d1_MINI = 33,

    /**
     * claude3-haiku
     *
     * @generated from enum value: LLM_MODEL_CLAUDE3_HAIKU = 41;
     */
    LLM_MODEL_CLAUDE3_HAIKU = 41,

    /**
     * yi-lightning
     *
     * @generated from enum value: LLM_MODEL_YI_LIGHTNING = 51;
     */
    LLM_MODEL_YI_LIGHTNING = 51,

    /**
     * Qwen/Qwen2.5-32B-Instruct
     *
     * @generated from enum value: LLM_MODEL_QWEN_2d5_32B_INSTRUCT = 61;
     */
    LLM_MODEL_QWEN_2d5_32B_INSTRUCT = 61,

    /**
     * qwq-plus-latest
     *
     * @generated from enum value: LLM_MODEL_QWQ_PLUS_LATEST = 62;
     */
    LLM_MODEL_QWQ_PLUS_LATEST = 62,

    /**
     * qwen-max-latest
     *
     * @generated from enum value: LLM_MODEL_QWEN_MAX_LATEST = 63;
     */
    LLM_MODEL_QWEN_MAX_LATEST = 63,

    /**
     * qwen-plus-latest-thinking
     *
     * @generated from enum value: LLM_MODEL_QWEN_PLUS_LATEST_THINKING = 64;
     */
    LLM_MODEL_QWEN_PLUS_LATEST_THINKING = 64,

    /**
     * qwen-plus-latest
     *
     * @generated from enum value: LLM_MODEL_QWEN_PLUS_LATEST = 65;
     */
    LLM_MODEL_QWEN_PLUS_LATEST = 65,

    /**
     * qwen-turbo-latest-thinking
     *
     * @generated from enum value: LLM_MODEL_QWEN_TURBO_LATEST_THINKING = 66;
     */
    LLM_MODEL_QWEN_TURBO_LATEST_THINKING = 66,

    /**
     * qwen-turbo-latest
     *
     * @generated from enum value: LLM_MODEL_QWEN_TURBO_LATEST = 67;
     */
    LLM_MODEL_QWEN_TURBO_LATEST = 67,

    /**
     * Doubao-1.5-pro
     *
     * @generated from enum value: LLM_MODEL_DOUBAO_1d5_PRO = 71;
     */
    LLM_MODEL_DOUBAO_1d5_PRO = 71,

    /**
     * Doubao-1.5-lite-32k
     *
     * @generated from enum value: LLM_MODEL_DOUBAO_1d5_LITE_32K = 72;
     */
    LLM_MODEL_DOUBAO_1d5_LITE_32K = 72,

    /**
     * Doubao-1.5-thinking-pro-250415
     *
     * @generated from enum value: LLM_MODEL_DOUBAO_1d5_THINKING_PRO_250415 = 73;
     */
    LLM_MODEL_DOUBAO_1d5_THINKING_PRO_250415 = 73,

    /**
     * gemini-2.0-flash
     *
     * @generated from enum value: LLM_MODEL_GEMINI_2d0_FLASH = 81;
     */
    LLM_MODEL_GEMINI_2d0_FLASH = 81,

    /**
     * gemini-2.5-flash
     *
     * @generated from enum value: LLM_MODEL_GEMINI_2d5_FLASH = 82;
     */
    LLM_MODEL_GEMINI_2d5_FLASH = 82,

    /**
     * gemini-2.5-flash-lite
     *
     * @generated from enum value: LLM_MODEL_GEMINI_2d5_FLASH_LITE = 83;
     */
    LLM_MODEL_GEMINI_2d5_FLASH_LITE = 83,

    /**
     * Kimi-K2
     *
     * @generated from enum value: LLM_MODEL_KIMI_K2 = 91;
     */
    LLM_MODEL_KIMI_K2 = 91,

    /**
     * Embedding模型
     *
     * BAAI/BGE-M3
     *
     * @generated from enum value: LLM_MODEL_BAAI_BGE_M3 = 20001;
     */
    LLM_MODEL_BAAI_BGE_M3 = 20001,

    /**
     * Zhipu/Embedding-3
     *
     * @generated from enum value: LLM_MODEL_ZHIPU_EMBEDDING_3 = 20002;
     */
    LLM_MODEL_ZHIPU_EMBEDDING_3 = 20002,

    /**
     * Rerank模型
     *
     * AAI/bge-reranker-v2-m3
     *
     * @generated from enum value: LLM_MODEL_BAAI_RERANK_V2_M3 = 30001;
     */
    LLM_MODEL_BAAI_RERANK_V2_M3 = 30001,

    /**
     * Zhipu/Rerank
     *
     * @generated from enum value: LLM_MODEL_ZHIPU_RERANK = 30002;
     */
    LLM_MODEL_ZHIPU_RERANK = 30002
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
