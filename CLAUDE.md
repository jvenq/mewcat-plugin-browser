# CLAUDE.md — mewCat (译趣喵) 项目文档

> **维护规则**：每次对项目做出修改后，必须在本文件末尾的 [修改记录](#修改记录) 章节追加一条记录，格式见该章节说明。

---

## 项目概述

**名称**：mewCat（译趣喵）  
**类型**：Chrome MV3 浏览器扩展  
**框架**：Plasmo 0.90.5  
**语言**：TypeScript 5.9.2  
**包管理**：pnpm 10.20.0

浏览器翻译插件，支持沉浸式翻译、划词翻译、图片翻译，通过第三方 LLM API 驱动翻译能力。

---

## 目录结构

```
src/
├── background/          # Service Worker（MV3 后台脚本）
│   ├── index.ts         # 右键菜单、消息路由
│   ├── config/          # canvas-sites、hotlink-sites 配置
│   ├── lib/             # hotlink-dnr（声明式网络请求规则）
│   └── messages/        # 消息处理器（translate-request、translate-image、canvas-hook-event、inject-main-world-hook）
│
├── contents/            # 注入页面的 Content Scripts
│   ├── initialize.tsx              # 语言检测与初始化
│   ├── TranslationControlCenter.tsx # 主翻译控制器（浮动按钮）
│   ├── selectionTranslate.tsx      # 划词翻译
│   ├── imageTranslate.tsx          # 图片翻译 UI
│   ├── MewCat.tsx                  # mewCat 页面 token 同步脚本
│   ├── bridges/canvas-hook-bridge.ts
│   └── inject/canvas-image-hook.ts
│
├── popup/               # 弹出窗口（点击扩展图标）
├── sidepanel/           # 侧边栏
├── options/             # 设置页（Basic、TranslateServices、Selection、Image、About）
│
├── components/          # 可复用 React 组件（25+）
├── translation/         # 核心翻译引擎（见下方详述）
├── state/               # Jotai 状态管理
├── services/            # 服务层（HTTP 请求）
├── types/               # TypeScript 类型定义
├── constants/           # 应用常量
├── utils/               # 工具函数
├── hooks/               # React Hooks
└── config/              # 构建时配置（mewCat 页面 URL）
```

---

## 核心架构

### 翻译引擎（src/translation/）

```
ImmersiveTranslator.ts       # 沉浸式翻译编排器（入口）
UniversalTranslator.ts       # 通用翻译器，对接各 LLM 平台
TranslationServiceManager.ts # 根据配置选择并管理翻译器实例
DOMTraverser.ts              # DOM 树遍历与文本节点提取
DomSelector.ts               # DOM 元素选择与去重
MutationObserverManager.ts   # 动态内容监听（SPA 页面）
RuleEngine.ts                # 按站点规则过滤翻译目标
cache/                       # 两级缓存（L1 内存 + L2 IndexedDB）
```

**翻译流程**：
1. `initialize.tsx` 检测页面语言（franc 库）
2. `DOMTraverser` 遍历 DOM，提取待翻译文本节点
3. `RuleEngine` 按站点规则过滤
4. `TieredTranslationCache` 查缓存，命中则直接渲染
5. `TranslationServiceManager` 选取当前模型对应的 `UniversalTranslator`
6. `UniversalTranslator` 构建请求并调用第三方 LLM API
7. 翻译结果写入缓存，`ImmersiveTranslator` 将译文插入 DOM

### 状态管理（src/state/，Jotai）

| Atom | 文件 | 说明 |
|------|------|------|
| `configAtom` | state/config.ts | 主配置，持久化到 Chrome local storage |
| `updateConfigAtom` | state/config.ts | 更新配置的写入 atom |
| `userAtom` | state/user.ts | 用户信息（头像、手机号等） |
| `accessTokenAtom` | state/user.ts | 访问 token，持久化 |
| `refreshTokenAtom` | state/user.ts | 刷新 token，持久化 |
| `fetchUserAtom` | state/user.ts | 触发拉取用户信息 |
| `setAccessTokenAtom` | state/user.ts | 设置 token 并同步到请求头 |

### 服务层（src/services/）

- **request.ts**：`mewCatRequest`（Axios 实例），含 401 自动刷新 token 拦截器
- **user.ts**：调用后端接口获取用户信息、订阅额度、模型列表
- **imageTranslation.ts**：图片翻译服务

### AI 模型系统

**平台枚举**（`src/types/aiModel.ts`）：
```
HUOSHAN / BAILIAN / ZHIPU / HUNYUAN / DEEPSEEK /
OPENAI / MOONSHOT / GEMINI / BASE / SYSTEM / DEEPL / DEEPLX
```

**BaseModel 结构**：
```typescript
{
  id: string
  type: AiModel_Platform_Enum
  enabled: boolean
  name: string
  isSystem: boolean          // true = 系统模型（mewCat 后端）
  params: {
    modelName: string
    baseUrl?: string
    modelVersion: LLMModel
    apiKey: string
  }
}
```

**SYSTEM 模型**：使用 mewCat 后端（`PLASMO_PUBLIC_DOC2X_API_DOMAIN`），无需用户填写 API Key，默认模型为 Doubao-1.5-lite-32K。

**第三方模型**：用户在设置页填写 API Key，`UniversalTranslator` 直接调用对应平台 API。

### CSS 类名 / DOM 属性前缀

所有注入页面的 DOM 标识符统一使用 `mewcat-` 前缀：

| 标识符 | 用途 |
|--------|------|
| `mewcat-container` | 翻译结果容器 |
| `mewcat-wrapper` | 翻译文本包装 |
| `mewcat-error-container` | 错误提示容器 |
| `mewcat-error-modal` | 错误详情弹窗 |
| `mewcat-retry-btn` | 重试按钮 |
| `data-mewcat-parent-node-id` | 翻译节点唯一 ID |
| `data-mewcat-canvas-id` | Canvas 元素 ID |
| `mewcat-canvas-hook` | Canvas Hook 通信频道 |
| `__mewCatCanvasHookState__` | Window 上的 Hook 状态标记 |

---

## 关键配置

### 默认扩展配置（src/state/constants.ts）

```typescript
{
  isSelectedTranslate: true,
  targetLanguage: "zh-CN",
  currentModel: "SYSTEM",
  enableGoogleTranslate: true,
  enableMicrosoftTranslate: true,
  maxRequestsPerSecond: 3,
  maxTextLengthPerRequest: 1024,
  selectionTriggerMode: "shift",
  cacheEnabled: true,
  enableThinking: false,
  enableContext: false,
  enableImageTranslateButton: false
}
```

### 环境变量（.env）

| 变量 | 说明 |
|------|------|
| `PLASMO_PUBLIC_DOC2X_API_DOMAIN` | 后端 API 域名（系统模型使用） |

---

## 构建与开发

```bash
pnpm dev          # 开发模式（热重载）
pnpm build        # 生产构建（Plasmo → 混淆 → ZIP）
pnpm typecheck    # TypeScript 检查
pnpm lint         # ESLint
pnpm format       # Prettier 格式化
pnpm check        # 全量检查
pnpm package      # 打包为带日期的 ZIP
```

**构建流程**：`plasmo build` → `scripts/obfuscate.js`（JS 混淆）→ `scripts/package-with-date.js`（ZIP 打包）

---

## Manifest 权限

```json
{
  "host_permissions": ["<all_urls>", "http://*/*", "https://*/*", "https://v2c.doc2x.noedgeai.com/*"],
  "permissions": ["storage", "tabs", "scripting", "windows", "contextMenus", "declarativeNetRequest", "declarativeNetRequestWithHostAccess"]
}
```

---

## 修改记录

> **格式**：每次修改后在此追加，格式如下：
> ```
> ### YYYY-MM-DD — 简短标题
> **修改内容**：具体改了什么文件、什么逻辑
> **原因**：为什么要改
> ```

---

### 2026-05-11 — 品牌重命名：Doc2X → 译趣喵 (mewCat)

**修改内容**：
- `package.json`：`name` 改为 `mewcat-plugin-browser`，`displayName` 改为 `mewCat`
- `src/config/index.ts`：常量 `DOC2X_MATCHES` → `MEWCAT_MATCHES`，`DOC2X_FRONTEND_URL` → `MEWCAT_FRONTEND_URL`，函数 `isDoc2xPage` → `isMewCatPage`
- `src/constants/common.ts`：`DOC2X_URL` → `MEWCAT_URL`
- `src/state/constants.ts`：系统模型显示名 `"Doc2X"` → `"mewCat"`
- `src/services/request.ts`：`doc2xRequest` → `mewCatRequest`（含拦截器内所有引用）
- `src/services/user.ts`：同步更新 `mewCatRequest`
- `src/state/user.ts`：同步更新 `mewCatRequest`
- `src/popup/index.tsx`、`src/components/SettingsPanel/index.tsx`：UI 标题 `"Doc2X 翻译"` → `"译趣喵"`，import 同步更新
- `src/options/index.tsx`：侧边栏标题 `"Doc2X 翻译助手"` → `"译趣喵"`
- `src/sidepanel/index.tsx`：alt 文本更新
- `src/types/user.ts`：`Doc2xUserInfo` → `MewCatUserInfo`
- `src/types/canvas-hook.ts`：channel 常量 `"doc2x-canvas-hook"` → `"mewcat-canvas-hook"`
- `src/contents/bridges/canvas-hook-bridge.ts`：所有 `doc2x-canvas-*` 属性/前缀 → `mewcat-canvas-*`
- `src/contents/inject/canvas-image-hook.ts`：函数名 `installDoc2xCanvasImageHook` → `installMewCatCanvasImageHook`，window 状态标记 `__doc2xCanvasHookState__` → `__mewCatCanvasHookState__`，canvas 属性前缀更新
- `src/background/messages/inject-main-world-hook.ts`：同步更新函数引用
- `src/utils/dom.ts`：所有 CSS 类名 `doc2x-*` → `mewcat-*`，DOM 属性 `data-doc2x-*` → `data-mewcat-*`
- `src/translation/DomSelector.ts`、`DOMTraverser.ts`、`MutationObserverManager.ts`：同步更新属性/选择器
- `src/contents/imageTranslate.tsx`：canvas overlay 属性更新
- `src/background/messages/translate-image.ts`：canvas 属性查询更新
- `src/contents/Doc2x.tsx` → 重命名为 `src/contents/MewCat.tsx`，内部组件名、函数名全部更新
- `README.md`：标题更新

**原因**：将插件品牌从 Doc2X 完整迁移到译趣喵 (mewCat)，移除所有对外可见的 Doc2X 标识。后端 API 域名（`doc2x.noedgeai.com`）作为功能性端点保留不变。
