# ApiKeyValidator.ts 文档

## 概述

`ApiKeyValidator` 是一个API密钥验证器类，用于验证各种AI翻译服务的API Key是否有效。该类提供了对火山引擎(豆包)、阿里百炼、智谱AI等平台的API密钥验证功能。

## 类结构

### ApiKeyValidator

```typescript
export class ApiKeyValidator
```

一个静态工具类，提供各种AI翻译服务的API Key验证方法。

## 静态方法

### validateVolcanoApiKey()

验证火山引擎(豆包)API Key是否有效。

**语法**
```typescript
static async validateVolcanoApiKey(apiKey: string, endpoint?: string, modelName?: string): Promise<boolean>
```

**参数**
- `apiKey` (string): 火山引擎API密钥
- `endpoint` (string, 可选): 接入点ID，用于连接验证
- `modelName` (string, 可选): 模型名称，用于完整配置验证

**返回值**
- `Promise<boolean>`: 返回验证结果，true表示有效，false表示无效

**示例**
```typescript
// 基础验证
const isValid = await ApiKeyValidator.validateVolcanoApiKey("your-api-key");

// 完整验证
const isValidComplete = await ApiKeyValidator.validateVolcanoApiKey(
    "your-api-key", 
    "ep-20250728140155-bkxw4", 
    "doubao-lite-4k"
);
console.log(isValidComplete); // true 或 false
```

### validateBaiLianApiKey()

验证阿里百炼API Key是否有效。

**语法**
```typescript
static async validateBaiLianApiKey(apiKey: string): Promise<boolean>
```

**参数**
- `apiKey` (string): 阿里百炼API密钥

**返回值**
- `Promise<boolean>`: 返回验证结果

**示例**
```typescript
const isValid = await ApiKeyValidator.validateBaiLianApiKey("your-bailian-key");
```

### validateZhipuApiKey()

验证智谱AI API Key是否有效。

**语法**
```typescript
static async validateZhipuApiKey(apiKey: string): Promise<boolean>
```

**参数**
- `apiKey` (string): 智谱AI API密钥

**返回值**
- `Promise<boolean>`: 返回验证结果

**示例**
```typescript
const isValid = await ApiKeyValidator.validateZhipuApiKey("your-zhipu-key");
```

### validateApiKeys()

批量验证多个API密钥。

**语法**
```typescript
static async validateApiKeys(keys: {
    volcanoConfig?: {
        apiKey: string;
        endpoint: string;
        modelName: string;
    };
    aliBaiApiKey?: string;
    zhiPuApiKey?: string;
}): Promise<{
    volcano: boolean;
    bailian: boolean;
    zhipu: boolean;
}>
```

**参数**
- `keys` (object): 包含各平台API密钥的对象
  - `volcanoConfig` (object, 可选): 火山引擎完整配置
    - `apiKey` (string): API密钥
    - `endpoint` (string): 接入点ID
    - `modelName` (string): 模型名称
  - `aliBaiApiKey` (string, 可选): 阿里百炼API密钥
  - `zhiPuApiKey` (string, 可选): 智谱AI API密钥

**返回值**
- `Promise<object>`: 包含各平台验证结果的对象

**示例**
```typescript
const results = await ApiKeyValidator.validateApiKeys({
    volcanoConfig: {
        apiKey: "volcano-key",
        endpoint: "ep-20250728140155-bkxw4",
        modelName: "doubao-lite-4k"
    },
    aliBaiApiKey: "bailian-key",
    zhiPuApiKey: "zhipu-key"
});

console.log(results);
// {
//     volcano: true,
//     bailian: false,
//     zhipu: true
// }
```

## 工作原理

1. **验证机制**: 通过创建对应的`UniversalTranslator`实例，调用其`checkConnection()`方法来验证API密钥有效性
2. **并发处理**: `validateApiKeys`方法使用`Promise.allSettled`来并发验证多个密钥，提高验证效率
3. **错误处理**: 每个验证方法都包含try-catch错误处理，确保单个验证失败不会影响其他验证
4. **日志记录**: 验证失败时会在控制台输出详细的错误信息

## 依赖关系

- `UniversalTranslator`: 用于实际的API连接验证
- `AiModel_Platform_Enum`: 枚举类型，定义支持的AI服务提供商
- `AiRole`: AI角色配置类型

## 使用场景

1. **用户设置验证**: 在用户输入API密钥时进行实时验证
2. **配置检查**: 应用启动时检查已保存的API密钥是否仍然有效
3. **批量检查**: 一次性验证多个平台的API密钥状态
4. **故障排除**: 诊断翻译服务无法正常工作的原因

## 注意事项

1. **网络依赖**: 验证过程需要网络连接，可能受到网络状况影响
2. **异步操作**: 所有验证方法都是异步的，需要使用await或Promise处理
3. **API配额**: 验证过程会消耗少量API调用次数
4. **超时机制**: 内部设置了合理的超时时间，避免长时间等待

## 错误处理

验证失败时，方法会：
1. 在控制台输出错误信息
2. 返回false表示验证失败
3. 不会抛出异常，保证应用稳定性

## 性能优化

- 使用并发验证提高批量检查效率
- 设置合理的超时时间避免长时间阻塞
- 错误处理机制确保单点失败不影响整体功能