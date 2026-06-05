# UniversalTranslator.ts 文档

## 概述

`UniversalTranslator` 是一个通用的AI翻译器，支持多个AI服务提供商，包括豆包、百炼和智谱。它实现了统一的翻译接口，提供灵活的翻译配置和错误处理机制。

## 枚举

### AiModel_Platform_Enum

```typescript
export enum AiModel_Platform_Enum {
    DOUBAO = "doubao",
    BAILIAN = "bailian", 
    ZHIPU = "zhipu"
}
```

定义支持的AI服务提供商类型：
- `DOUBAO`: 字节跳动豆包AI服务
- `BAILIAN`: 阿里云百炼AI服务  
- `ZHIPU`: 智谱AI服务

## 类结构

### UniversalTranslator

```typescript
export class UniversalTranslator implements TranslatorInterface
```

通用AI翻译器，实现了标准翻译接口，支持多个AI服务提供商。

## 构造函数

```typescript
constructor(provider: AiModel_Platform_Enum, config: TranslatorConfig)
```

创建通用翻译器实例。

**参数**
- `provider` (AiModel_Platform_Enum): AI服务提供商类型
- `config` (TranslatorConfig): 翻译器配置对象

**功能**
- 设置API密钥、模型和AI角色
- 根据提供商确定对应的API基础URL
- 初始化翻译器配置

## 核心属性

- `apiKey`: string - API密钥
- `baseUrl`: string - API基础URL地址
- `model`: string - 使用的AI模型名称
- `aiRole`: AiRole - AI角色配置
- `provider`: AiModel_Platform_Enum - 当前使用的AI服务提供商

## 核心方法

### URL配置

#### getBaseUrl()
根据服务提供商获取对应的基础URL。

```typescript
private getBaseUrl(provider: AiModel_Platform_Enum, customUrl?: string): string
```

**参数**
- `provider` (AiModel_Platform_Enum): AI服务提供商
- `customUrl` (string, 可选): 自定义URL

**返回值**
- `string`: 对应的API基础URL

**默认URL配置**
- 豆包: `https://ark.cn-beijing.volces.com/api/v3`
- 百炼: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- 智谱: `https://open.bigmodel.cn/api/paas/v4`

### 请求配置

#### buildHeaders()
构建HTTP请求头。

```typescript
private buildHeaders(): Record<string, string>
```

**返回值**
包含Content-Type和Authorization的请求头对象。

#### buildSystemPrompt()
构建系统提示词。

```typescript
private buildSystemPrompt(targetLang: string, sourceLang: string = "auto", isKeyValue: boolean = false): string
```

**参数**
- `targetLang` (string): 目标语言
- `sourceLang` (string): 源语言，默认为"auto"
- `isKeyValue` (boolean): 是否为键值对格式，默认为false

**返回值**
- `string`: 构建的系统提示词

**功能**
- 根据语言参数生成翻译指令
- 支持自动检测源语言
- 支持键值对格式翻译

### 翻译功能

#### translate()
执行标准文本翻译。

```typescript
async translate(messages: Message[], targetLang: string, sourceLang: string = "auto", signal?: AbortSignal): Promise<string>
```

**参数**
- `messages` (Message[]): 待翻译的消息数组
- `targetLang` (string): 目标语言
- `sourceLang` (string): 源语言，默认为"auto"
- `signal` (AbortSignal, 可选): 取消信号

**返回值**
- `Promise<string>`: 翻译结果文本

**功能流程**
1. 验证输入消息
2. 构建请求配置
3. 发送翻译请求
4. 处理响应和错误
5. 返回翻译结果

**示例**
```typescript
const translator = new UniversalTranslator(AiModel_Platform_Enum.HUOSHAN, {
    apiKey: 'your-api-key',
    model: 'your-model'
});

const result = await translator.translate(
    [{ content: 'Hello world', role: 'user' }],
    '中文'
);
console.log(result); // "你好世界"
```

#### translate2()
执行批量键值对格式翻译。

```typescript
async translate2(messages: Message[], targetLang: string, sourceLang: string = "auto", signal?: AbortSignal): Promise<Record<string, string>>
```

**参数**
- `messages` (Message[]): 待翻译的消息数组
- `targetLang` (string): 目标语言  
- `sourceLang` (string): 源语言，默认为"auto"
- `signal` (AbortSignal, 可选): 取消信号

**返回值**
- `Promise<Record<string, string>>`: 键值对格式的翻译结果

**功能**
- 使用特殊的系统提示词生成JSON格式输出
- 支持批量翻译多个文本片段
- 保持原始ID与翻译结果的映射关系

**示例**
```typescript
const results = await translator.translate2(
    [{ content: 'id1:Hello\nid2:World', role: 'user' }],
    '中文'
);
console.log(results); // { "id1": "你好", "id2": "世界" }
```

### 连接检测

#### checkConnection()
检测与AI服务的连接状态。

```typescript
async checkConnection(): Promise<boolean>
```

**返回值**
- `Promise<boolean>`: 连接是否正常

**功能**
- 发送测试请求验证API可达性
- 验证API密钥有效性
- 检查服务响应格式

**示例**
```typescript
const isConnected = await translator.checkConnection();
if (isConnected) {
    console.log('连接正常');
} else {
    console.log('连接失败，请检查配置');
}
```

### 错误处理

#### handleError()
处理翻译过程中的错误。

```typescript
private handleError(error: unknown): void
```

**参数**
- `error` (unknown): 捕获的错误对象

**错误类型处理**
- `401`: API密钥无效或已过期
- `429`: 请求频率过高，需要稍后重试
- `400`: 请求参数错误

**功能**
- 根据HTTP状态码提供具体错误信息
- 统一错误消息格式
- 便于上层调用者处理

## 服务提供商特殊配置

### 百炼服务配置
当使用阿里云百炼服务时，会应用以下特殊配置：

#### translate() 方法
- `temperature`: 0.1 (降低随机性)
- `max_tokens`: 4000 (最大输出长度)

#### translate2() 方法  
- `temperature`: 0.01 (进一步降低随机性以确保JSON格式)
- `max_tokens`: 4000 (最大输出长度)

## 请求配置

### 通用配置
- **超时时间**: 30秒
- **Content-Type**: application/json
- **认证方式**: Bearer Token

### 模型请求格式
```typescript
interface AIModelRequest {
    model: string;
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
}
```

## 错误处理机制

### 取消处理
- 支持AbortSignal取消正在进行的请求
- 区分取消和失败的不同处理逻辑
- 提供清晰的取消状态反馈

### 网络错误
- 自动检测网络连接问题
- 提供重试建议
- 记录详细错误日志

### API错误
- 解析HTTP状态码
- 提供用户友好的错误消息
- 支持错误恢复策略

## 使用模式

### 基本使用
```typescript
// 创建翻译器实例
const translator = new UniversalTranslator(AiModel_Platform_Enum.HUOSHAN, {
    apiKey: 'your-api-key',
    model: 'ep-20250728140155-bkxw4',
    aiRole: AiRole.PROFESSIONAL
});

// 执行翻译
const result = await translator.translate(
    [{ content: 'Hello, how are you?', role: 'user' }],
    '中文'
);
```

### 批量翻译
```typescript
// 批量翻译多个文本
const messages = [
    { content: 'text1:Hello\ntext2:World\ntext3:AI', role: 'user' }
];

const results = await translator.translate2(messages, '中文');
// 结果: { "text1": "你好", "text2": "世界", "text3": "人工智能" }
```

### 连接检测
```typescript
// 在翻译前检测连接
if (await translator.checkConnection()) {
    const result = await translator.translate(messages, '中文');
} else {
    console.error('无法连接到翻译服务');
}
```

### 取消翻译
```typescript
// 创建取消控制器
const controller = new AbortController();

// 启动翻译（可取消）
const translationPromise = translator.translate(
    messages, 
    '中文', 
    'auto', 
    controller.signal
);

// 在需要时取消
setTimeout(() => controller.abort(), 5000);
```

## 架构优势

1. **多服务商支持**: 统一接口支持多个AI服务提供商
2. **灵活配置**: 支持自定义API端点和模型参数
3. **错误恢复**: 完善的错误处理和重试机制
4. **取消支持**: 支持请求取消，避免资源浪费
5. **类型安全**: 完整的TypeScript类型定义
6. **批量处理**: 支持批量翻译提高效率

## 依赖关系

- `axios`: HTTP请求库
- `TranslatorInterface`: 翻译器接口定义
- `TranslatorConfig`: 配置类型定义
- `AiRole`: AI角色枚举
- `AiRoleSystemPrompts`: AI角色系统提示词

## 注意事项

1. **API密钥安全**: 确保API密钥安全存储，避免泄露
2. **请求频率**: 注意各服务商的API调用频率限制
3. **模型选择**: 根据需求选择合适的AI模型
4. **错误重试**: 实现适当的重试逻辑处理临时故障
5. **内存管理**: 及时取消不需要的请求避免内存泄露
6. **配置验证**: 在使用前验证配置的完整性和正确性