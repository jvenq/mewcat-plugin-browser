# Volcano 配置结构升级指南

## 概述

为了提供更好的模型配置管理和更清晰的配置结构，我们对 Volcano（火山引擎）配置进行了重构。新的配置结构将接入点ID（endpoint）设为必传参数，并添加了明确的模型名称参数。

## 新的配置结构

### VolcanoConfig 接口

```typescript
export interface VolcanoConfig {
    /** API密钥（必传） */
    apiKey: string
    /** 接入点ID（必传） */
    endpoint: string
    /** 模型名称（必传） */
    modelName: string
    /** 基础URL（可选） */
    baseUrl?: string
}
```

### ExtensionConfig 中的变更

```typescript
export interface ExtensionConfig {
    /** 是否启用火山翻译 */
    enableVolcanoTranslate?: boolean

    /** 火山翻译配置 */
    volcanoConfig?: VolcanoConfig
    
    // ... 其他配置
}
```

## 迁移指南

### 旧配置结构

```typescript
// 旧版本
interface OldConfig {
    enableVolcanoTranslate?: boolean
    volcanoApiKey?: string        // API密钥
    volcanoModel?: string         // 模型/接入点ID（可选）
}
```

### 新配置结构

```typescript
// 新版本
interface NewConfig {
    enableVolcanoTranslate?: boolean
    volcanoConfig?: {
        apiKey: string            // API密钥（必传）
        endpoint: string          // 接入点ID（必传）
        modelName: string         // 模型名称（必传）
        baseUrl?: string          // 基础URL（可选）
    }
}
```

### 配置迁移示例

```typescript
// 旧配置
const oldConfig = {
    enableVolcanoTranslate: true,
    volcanoApiKey: "cc770f20-a654-4226-b024-cfa91df124d1",
    volcanoModel: "ep-20250728140155-bkxw4"
}

// 新配置
const newConfig = {
    enableVolcanoTranslate: true,
    volcanoConfig: {
        apiKey: "cc770f20-a654-4226-b024-cfa91df124d1",
        endpoint: "ep-20250728140155-bkxw4",
        modelName: "doubao-lite-4k",
        baseUrl: "https://ark.cn-beijing.volces.com/api/v3" // 可选
    }
}
```

## UI 配置变更

### 新的配置界面

新版本在设置界面提供了三个独立的输入字段：

1. **API Key 输入框**
   - 用于输入火山引擎API密钥
   - 支持实时验证功能

2. **接入点ID 输入框**
   - 用于输入火山引擎接入点ID
   - 格式示例：`ep-20250728140155-bkxw4`
   - 支持帮助链接到官方控制台

3. **模型名称 输入框**
   - 用于输入具体的模型名称
   - 格式示例：`doubao-lite-4k`
   - 必须与接入点配置的模型一致

### 验证机制增强

```typescript
// 新的API密钥验证方法
ApiKeyValidator.validateVolcanoApiKey(apiKey, endpoint, modelName)
```

验证时会检查：
- API密钥的有效性
- 接入点ID是否存在
- 模型名称是否匹配

## 开发指南

### 使用新配置

```typescript
// 在 TranslationServiceManager 中使用
if (this.config.enableVolcanoTranslate) {
    const volcanoConfig = this.config.volcanoConfig
    if (volcanoConfig?.apiKey && 
        volcanoConfig.endpoint && 
        volcanoConfig.modelName) {
        
        const translator = new UniversalTranslator(AiModel_Platform_Enum.HUOSHAN, {
            apiKey: volcanoConfig.apiKey,
            model: volcanoConfig.endpoint,
            aiRole: this.config.aiRole,
            baseUrl: volcanoConfig.baseUrl
        })
    }
}
```

### 配置验证

```typescript
// 完整配置验证
const isValid = await ApiKeyValidator.validateVolcanoApiKey(
    volcanoConfig.apiKey,
    volcanoConfig.endpoint,
    volcanoConfig.modelName
)
```

### 批量验证

```typescript
const results = await ApiKeyValidator.validateApiKeys({
    volcanoConfig: {
        apiKey: "your-api-key",
        endpoint: "ep-20250728140155-bkxw4",
        modelName: "doubao-lite-4k"
    },
    aliBaiApiKey: "bailian-key",
    zhiPuApiKey: "zhipu-key"
})
```

## 优势说明

### 1. 更清晰的配置结构
- 将相关配置项组织在一起
- 明确区分必传和可选参数
- 提供更好的类型安全

### 2. 更好的用户体验
- 分离的输入字段让用户更容易理解每个参数的作用
- 独立的帮助链接和说明文本
- 实时验证提供即时反馈

### 3. 更强的扩展性
- 易于添加新的Volcano相关配置
- 支持不同模型的独立配置
- 为未来的多模型支持做好准备

### 4. 更好的错误处理
- 详细的配置缺失提示
- 明确的字段级验证
- 更精确的错误定位

## 注意事项

1. **向后兼容性**：旧版本的配置将不再支持，需要重新配置
2. **必填字段**：endpoint和modelName现在是必填字段
3. **验证要求**：所有三个核心字段都必须正确填写才能通过验证
4. **模型匹配**：modelName必须与endpoint配置的实际模型保持一致

## 获取配置信息

### 火山引擎控制台
- API Key：https://console.volcengine.com/ark
- 接入点列表：https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint
- 模型文档：https://www.volcengine.com/docs/82379/1263482

确保在配置时参考官方文档，获取正确的接入点ID和模型名称。