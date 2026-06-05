# 当前支持的AI模型列表

本文档列出了当前插件支持的所有AI模型，排除了SystemLLMModel系统模型。所有模型按平台分类展示，包括模型的枚举值、显示名称和简要说明。

## 1. Gemini模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `GEMINI_LLM.Gemini_2_5_Pro` | gemini-2.5-pro | Gemini 2.5 Pro版本，适用于复杂任务 |
| `GEMINI_LLM.Gemini_2_5_Pro_TTS` | gemini-2.5-pro-preview-tts | Gemini 2.5 Pro预览版，支持TTS功能 |
| `GEMINI_LLM.Gemini_2_5_Flash` | gemini-2.5-flash | Gemini 2.5 Flash版本，平衡性能与成本 |
| `GEMINI_LLM.Gemini_2_5_Flash_Lite` | gemini-2.5-flash-lite | Gemini 2.5 Flash轻量版，适用于一般任务 |
| `GEMINI_LLM.Gemini_2_5_Flash_Lite_preview` | gemini-2.5-flash-lite-preview-09-2025 | Gemini 2.5 Flash轻量预览版 |

## 2. DeepSeek模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `DEEPSEEK_LLM.DEEPSEEK_CHAT` | deepseek-chat | DeepSeek聊天模型，适用于通用对话 |
| `DEEPSEEK_LLM.DEEPSEEK_REASONER` | deepseek-reasoner | DeepSeek推理模型，专注于推理任务 |

## 3. 阿里云百炼模型

阿里云百炼平台提供了多个Qwen系列模型，分为Qwen3系列和Qwen2.5系列。

### 3.1 Qwen3系列

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `ALIYUN_BAILIAN_LLM.QWEN3_MAX` | qwen3-max | 旗舰文本模型，100万Token上下文，复杂任务首选 |
| `ALIYUN_BAILIAN_LLM.QWEN3_PLUS` | qwen3-plus | 平衡效果与成本，131K上下文，多轮对话/创意写作 |
| `ALIYUN_BAILIAN_LLM.QWEN3_TURBO` | qwen3-turbo | 高性价比，60-100 Token/秒输出，基础翻译/问答 |
| `ALIYUN_BAILIAN_LLM.QWEN3_LONG` | qwen3-long | 超长文档模型，1000万Token上下文，合同审查/论文总结 |

### 3.2 Qwen2.5系列

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `ALIYUN_BAILIAN_LLM.QWEN2_5_MAX` | qwen2.5-max | Qwen2.5旗舰，72B参数，高精度文本生成 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_PLUS` | qwen2.5-plus | Qwen2.5平衡版，32B参数，中等复杂任务 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_TURBO` | qwen2.5-turbo | Qwen2.5轻量版，14B参数，低延迟场景 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_LONG` | qwen2.5-long | Qwen2.5长文本版，256K上下文，文档摘要 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_72B_INSTRUCT` | qwen2.5-72b-instruct | Qwen2.5开源版（72B），支持本地部署 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_32B_INSTRUCT` | qwen2.5-32b-instruct | Qwen2.5开源版（32B），二次调优友好 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_14B_INSTRUCT` | qwen2.5-14b-instruct | Qwen2.5开源版（14B），性价比之选 |
| `ALIYUN_BAILIAN_LLM.QWEN2_5_7B_INSTRUCT` | qwen2.5-7b-instruct | Qwen2.5开源版（7B），低资源设备适配 |
| `ALIYUN_BAILIAN_LLM.QWEN_PLUS` | qwen-plus | 早期Qwen Plus版本 |
| `ALIYUN_BAILIAN_LLM.QWEN_TURBO` | qwen-turbo | 早期Qwen Turbo版本 |

## 4. 混元模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `HUNYUAN_LLM.HUNYUAN_LITE` | hunyuan-lite | 混元轻量版模型 |
| `HUNYUAN_LLM.HUNYUAN_STANDARD` | hunyuan-standard | 混元标准版模型 |
| `HUNYUAN_LLM.HUNYUAN_STANDARD_256K` | hunyuan-standard-256K | 混元标准版，支持256K上下文 |
| `HUNYUAN_LLM.HUNYUAN_T1_LATEST` | hunyuan-t1-latest | 混元T1最新版本 |
| `HUNYUAN_LLM.HUNYUAN_T1_20250822` | hunyuan-t1-20250822 | 混元T1 20250822版本 |
| `HUNYUAN_LLM.HUNYUAN_A13B` | hunyuan-a13b | 混元A13B版本 |
| `HUNYUAN_LLM.HUNYUAN_TURBOS_LATEST` | hunyuan-turbos-latest | 混元Turbos最新版本 |
| `HUNYUAN_LLM.HUNYUAN_TURBOS_20250926` | hunyuan-turbos-20250926 | 混元Turbos 20250926版本 |

## 5. OpenAI模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `OPENAI_LLM.GPT_5` | gpt-5 | GPT-5模型（未发布） |
| `OPENAI_LLM.GPT_5_CHAT` | gpt-5-chat | GPT-5聊天模型（未发布） |
| `OPENAI_LLM.GPT_5_MINI` | gpt-5-mini | GPT-5 Mini模型（未发布） |
| `OPENAI_LLM.GPT_5_NANO` | gpt-5-nano | GPT-5 Nano模型（未发布） |

## 6. 月之暗面模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `MOONSHOT_LLM.KIMI_K2_0905_PREVIEW` | kimi-k2-0905-preview | Kimi K2 0905预览版（未公开API ID） |
| `MOONSHOT_LLM.KIMI_K2_0711_PREVIEW` | kimi-k2-0711-preview | Kimi K2 0711预览版（未公开API ID） |
| `MOONSHOT_LLM.KIMI_K2_TURBO_PREVIEW` | kimi-k2-turbo-preview | Kimi K2 Turbo预览版（未公开API ID） |
| `MOONSHOT_LLM.KIMI_LATEST_8K` | kimi-latest-8k | Kimi最新版，8K上下文（未公开API ID） |
| `MOONSHOT_LLM.KIMI_LATEST_32K` | kimi-latest-32k | Kimi最新版，32K上下文（未公开API ID） |
| `MOONSHOT_LLM.KIMI_LATEST_64K` | kimi-latest-64k | Kimi最新版，64K上下文（未公开API ID） |

## 7. 智谱模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `ZHIPU_LLM.GLM_4_5` | glm-4.5 | 智谱GLM-4.5模型 |
| `ZHIPU_LLM.GLM_4_5_AIR` | glm-4.5-air | 智谱GLM-4.5 Air轻量版 |
| `ZHIPU_LLM.GLM_4_5_X` | glm-4.5-x | 智谱GLM-4.5 X增强版 |
| `ZHIPU_LLM.GLM_4_5_AIRX` | glm-4.5-airx | 智谱GLM-4.5 AirX轻量增强版 |
| `ZHIPU_LLM.GLM_4_5_FLASH` | glm-4.5-flash | 智谱GLM-4.5 Flash极速版 |
| `ZHIPU_LLM.GLM_4_6` | glm-4.6 | 智谱GLM-4.6增强版 |
| `ZHIPU_LLM.GLM_4_AIRX` | glm-4-airx | 智谱GLM-4 AirX轻量增强版 |

## 8. 火山方舟模型

| 枚举值 | 显示名称 | 说明 |
|-------|---------|------|
| `Huoshan_LLM.doubao_seed_1_6` | doubao-seed-1.6 | 火山方舟豆包Seed 1.6版本 |
| `Huoshan_LLM.doubao_seed_1_6_flash` | doubao-seed-1.6-flash | 火山方舟豆包Seed 1.6 Flash极速版 |
| `Huoshan_LLM.doubao_seed_1_6_thinking` | doubao-seed-1.6-thinking | 火山方舟豆包Seed 1.6思维链版 |
| `Huoshan_LLM.deepseek_v3_1_terminus` | deepseek-v3.1-terminus | 火山方舟DeepSeek V3.1 Terminus版 |
| `Huoshan_LLM.deepseek_v3_1_250821` | deepseek-v3.1-250821 | 火山方舟DeepSeek V3.1 250821版本 |
| `Huoshan_LLM.doubao_1_5_vision_lite` | doubao-1.5-vision-lite-250315 | 火山方舟豆包1.5视觉轻量版 |
| `Huoshan_LLM.doubao_1_5_lite` | doubao-1.5-lite-32k-250115 | 火山方舟豆包1.5轻量版，32K上下文 |
| `Huoshan_LLM.kimi_k2` | kimi-k2-250821 | 火山方舟Kimi K2 250821版本 |

## 模型平台映射

下表展示了模型枚举类型与平台枚举的对应关系：

| 平台枚举 | 对应模型枚举类型 |
|---------|----------------|
| `AiModel_Platform_Enum.GEMINI` | `GEMINI_LLM` |
| `AiModel_Platform_Enum.DEEPSEEK` | `DEEPSEEK_LLM` |
| `AiModel_Platform_Enum.BAILIAN` | `ALIYUN_BAILIAN_LLM` |
| `AiModel_Platform_Enum.ZHIPU` | `ZHIPU_LLM` |
| `AiModel_Platform_Enum.HUNYUAN` | `HUNYUAN_LLM` |
| `AiModel_Platform_Enum.OPENAI` | `OPENAI_LLM` |
| `AiModel_Platform_Enum.MOONSHOT` | `MOONSHOT_LLM` |
| `AiModel_Platform_Enum.HUOSHAN` | `Huoshan_LLM` |

## 注意事项

1. 部分模型标注为"未发布"或"未公开API ID"，这些模型可能需要特定权限或还未正式上线。
2. 模型的具体能力和性能可能随版本更新而变化。
3. 如需使用特定模型，请确保已配置正确的API密钥和访问权限。
4. 不同模型在文本生成、理解能力、上下文长度等方面存在差异，请根据实际需求选择合适的模型。