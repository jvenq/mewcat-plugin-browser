import type { BaseModel } from "@/types"
import { AiModel_Platform_Enum } from "@/types"

type BaseModelParams = keyof BaseModel["params"]

export const AI_MODEL_UI_LIST: {
    type: AiModel_Platform_Enum
    title: string
    description: string
    items: BaseModelParams[]
    testValidator:
        | "validateHuoshanApiKey"
        | "validateBaiLianApiKey"
        | "validateZhipuApiKey"
        | "validateDeepSeekApiKey"
        | "validateOpenAiApiKey"
        | "validateMoonshotApiKey"
        | "validateGeminiApiKey"
        | "validateDeeplApiKey"
        | "validateDeeplxApiKey"
    fields?: Partial<
        Record<
            BaseModelParams,
            {
                label: string
                required: boolean
                placeholder: string
                helperText: string
                helperLink?: { text: string; url: string }
                defaultValue?: string
            }
        >
    >
}[] = [
    {
        type: AiModel_Platform_Enum.HUOSHAN,
        title: "火山引擎",
        description: "使用火山引擎 AI 模型进行翻译",
        items: ["apiKey", "endpoint", "modelName"],
        testValidator: "validateHuoshanApiKey",
        fields: {
            apiKey: {
                label: "火山引擎 API Key",
                required: true,
                placeholder: "请输入火山引擎 API Key",
                helperText: "请确保您的 API Key 有调用权限",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://console.volcengine.com/ark"
                }
            },
            endpoint: {
                label: "接入点 ID",
                required: true,
                placeholder: "请输入接入点 ID，如：ep-20250728140155-bkxw4",
                helperText: "接入点 ID 可在火山引擎控制台的推理接入点页面获取",
                helperLink: {
                    text: "查看接入点",
                    url: "https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "请输入模型名称，如：doubao-lite-4k",
                helperText: "模型名称必须与接入点配置的模型一致",
                helperLink: {
                    text: "查看模型列表",
                    url: "https://www.volcengine.com/docs/82379/1263482"
                },
                defaultValue: "doubao-lite-4k"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.BAILIAN,
        title: "阿里百炼",
        description: "使用阿里百炼 AI 进行翻译",
        items: ["apiKey", "modelName"],
        testValidator: "validateBaiLianApiKey",
        fields: {
            apiKey: {
                label: "阿里百炼 API Key",
                required: true,
                placeholder: "请输入阿里百炼 API Key",
                helperText: "请确保您的 API Key 有调用权限",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://dashscope.console.aliyun.com/apiKey"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "请输入模型名称，如：qwen-turbo",
                helperText: "请选择合适的阿里百炼模型",
                helperLink: {
                    text: "查看模型列表",
                    url: "https://help.aliyun.com/document_detail/2701262.html"
                },
                defaultValue: "qwen-turbo"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.ZHIPU,
        title: "智谱",
        description: "使用智谱 AI 进行翻译",
        items: ["apiKey", "modelName"],
        testValidator: "validateZhipuApiKey",
        fields: {
            apiKey: {
                label: "智谱 API Key",
                required: true,
                placeholder: "请输入智谱 API Key",
                helperText: "请确保您的 API Key 有调用权限",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://open.bigmodel.cn/usercenter/apikeys"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "请输入模型名称，如：glm-4",
                helperText: "请选择合适的智谱模型",
                helperLink: {
                    text: "查看模型列表",
                    url: "https://open.bigmodel.cn/models"
                },
                defaultValue: "glm-4"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.HUNYUAN,
        title: "腾讯混元",
        description: "使用腾讯混元 AI 进行翻译",
        items: ["apiKey", "endpoint", "modelName"],
        testValidator: "validateZhipuApiKey",
        fields: {
            apiKey: {
                label: "腾讯混元 API Key",
                required: true,
                placeholder: "请输入腾讯混元 API Key",
                helperText: "请确保您的 API Key 有调用权限",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://cloud.tencent.com/document/product/1729/101848"
                }
            },
            endpoint: {
                label: "接入点 URL",
                required: true,
                placeholder: "请输入接入点 URL",
                helperText: "腾讯混元 API 的接入点地址",
                helperLink: {
                    text: "查看文档",
                    url: "https://cloud.tencent.com/document/product/1729/101849"
                },
                defaultValue: "https://hunyuan.tencentcloudapi.com"
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "请输入模型名称，如：hunyuan-pro",
                helperText: "请选择合适的腾讯混元模型",
                helperLink: {
                    text: "查看模型列表",
                    url: "https://cloud.tencent.com/document/product/1729/101850"
                },
                defaultValue: "hunyuan-pro"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.DEEPSEEK,
        title: "DeepSeek",
        description: "使用深度求索 AI 进行翻译（支持通用 / 技术文本翻译）",
        items: ["apiKey", "modelName"],
        testValidator: "validateDeepSeekApiKey",
        fields: {
            apiKey: {
                label: "DeepSeek API Key",
                required: true,
                placeholder: "请输入 DeepSeek API Key（格式：sk-xxx）",
                helperText:
                    "API Key 需拥有对话模型调用权限，免费额度可在官网领取",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://platform.deepseek.com/apikeys"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "默认：deepseek-chat",
                helperText:
                    "推荐使用 deepseek-chat（通用翻译），deepseek-coder 适合技术文档",
                helperLink: {
                    text: "查看模型列表",
                    url: "https://platform.deepseek.com/models"
                },
                defaultValue: "deepseek-chat"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.OPENAI,
        title: "ChatGPT（OpenAI）",
        description: "使用 OpenAI ChatGPT 进行翻译（支持多语言精准翻译）",
        items: ["apiKey", "modelName"],
        testValidator: "validateOpenAiApiKey",
        fields: {
            apiKey: {
                label: "OpenAI API Key",
                required: true,
                placeholder: "请输入 OpenAI API Key（格式：sk-xxx）",
                helperText:
                    "需确保 API Key 有 GPT-3.5/GPT-4 模型调用权限，注意额度消耗",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://platform.openai.com/api-keys"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "推荐：gpt-3.5-turbo",
                helperText:
                    "gpt-3.5-turbo（性价比高）、gpt-4（精准度更高，成本较高）",
                helperLink: {
                    text: "查看模型文档",
                    url: "https://platform.openai.com/docs/models/overview"
                },
                defaultValue: "gpt-3.5-turbo"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.MOONSHOT,
        title: "Moonshot（月之暗面）",
        description: "使用月之暗面 AI 进行翻译（支持超长文本与多语言）",
        items: ["apiKey", "modelName"],
        testValidator: "validateMoonshotApiKey",
        fields: {
            apiKey: {
                label: "Moonshot API Key",
                required: true,
                placeholder: "请输入 Moonshot API Key（格式：sk-xxx）",
                helperText:
                    "国内访问速度快，支持 8k/32k 长上下文，适合长文档翻译",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://platform.moonshot.cn/console/api-keys"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "推荐：moonshot-v1-8k",
                helperText:
                    "moonshot-v1-8k（8k 上下文）、moonshot-v1-32k（32k 长上下文）",
                helperLink: {
                    text: "查看模型列表",
                    url: "https://platform.moonshot.cn/docs/model-intro"
                },
                defaultValue: "moonshot-v1-8k"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.GEMINI,
        title: "Gemini",
        description: "使用 Gemini 进行翻译",
        items: ["apiKey", "modelName"],
        testValidator: "validateGeminiApiKey",
        fields: {
            apiKey: {
                label: "Gemini API Key",
                required: true,
                placeholder: "请输入 Gemini API Key（格式：AIzaSyxxx）",
                helperText:
                    "需在 Google Cloud 控制台创建 API Key，支持免费额度",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://makersuite.google.com/app/apikey"
                }
            },
            modelName: {
                label: "模型名称",
                required: true,
                placeholder: "推荐：gemini-pro",
                helperText:
                    "gemini-pro（基础模型）、gemini-ultra（高级模型，需申请访问权限）",
                helperLink: {
                    text: "查看模型文档",
                    url: "https://ai.google.dev/docs/models/gemini"
                },
                defaultValue: "gemini-pro"
            }
        }
    },
    {
        type: AiModel_Platform_Enum.DEEPL,
        title: "DeepL",
        description: "使用 DeepL 进行翻译（支持高质量多语言翻译）",
        items: ["apiKey"],
        testValidator: "validateDeeplApiKey",
        fields: {
            apiKey: {
                label: "DeepL API Key",
                required: true,
                placeholder: "请输入 DeepL API Key（格式：xxxxxx:fx）",
                helperText: "需确保 API Key 有翻译调用权限，注意额度消耗",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://www.deepl.com/pro-api"
                }
            }
        }
    },
    {
        type: AiModel_Platform_Enum.DEEPLX,
        title: "DeepLX",
        description: "使用 DeepLX 进行翻译（支持专业领域翻译）",
        items: ["apiKey"],
        testValidator: "validateDeeplxApiKey",
        fields: {
            apiKey: {
                label: "DeepLX API Key",
                required: true,
                placeholder: "请输入 DeepLX API Key（格式：xxxxxx:fx）",
                helperText: "需确保 API Key 有翻译调用权限，注意额度消耗",
                helperLink: {
                    text: "获取 API Key",
                    url: "https://www.deepl.com/pro-api"
                }
            }
        }
    }
]
