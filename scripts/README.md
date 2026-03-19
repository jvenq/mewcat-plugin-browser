# 构建脚本说明

这个目录包含了项目的自定义构建脚本和配置，主要用于生产环境的安全构建。

## 文件说明

### 🔧 核心脚本

- **`buildProduction.mjs`** - 生产环境构建主脚本
- **`removeConsole.mjs`** - Console 语句移除工具
- **`viteConsolePlugin.mjs`** - Vite 插件：构建时移除 console

### ⚙️ 配置文件

- **`plasmo.config.ts`** - Plasmo 框架配置（项目根目录）

## 主要功能

### 🚫 Console 移除

在生产环境构建时自动移除所有 `console` 语句，防止敏感信息泄露：

```bash
# 完整生产构建（推荐）
npm run build:prod

# 简单生产构建
npm run build:prod:simple

# 仅移除现有构建中的 console
npm run remove-console
```

#### 支持的 Console 方法

- `console.log()`
- `console.warn()`
- `console.error()`
- `console.info()`
- `console.debug()`
- `console.trace()`
- `console.table()`
- `console.group()` / `console.groupCollapsed()` / `console.groupEnd()`
- `console.time()` / `console.timeEnd()`
- `console.count()`
- `console.clear()`
- `console.assert()`

### 🛡️ 安全特性

1. **多层环境检测** - 通过多种方式确保正确识别生产环境
2. **敏感数据过滤** - 自动移除生产环境中的 API 密钥等敏感信息
3. **构建时验证** - 类型检查、代码规范检查、构建结果验证
4. **代码压缩** - ESBuild 集成，移除 debugger 和 console

### 📦 构建流程

`npm run build:prod` 执行以下步骤：

1. 🧹 **清理构建缓存**
2. 🔍 **TypeScript 类型检查**
3. 📏 **ESLint 代码规范检查**
4. 🏗️ **Plasmo 生产构建**
5. ✅ **构建结果验证**
6. 🚫 **移除 Console 语句**

## 配置选项

### Vite 插件配置

```javascript
// viteConsolePlugin.mjs
export const productionConfig = {
    enabled: true,
    methods: ['log', 'warn', 'error', ...], // 要移除的方法
    exclude: [/node_modules/],              // 排除的文件
    include: [/\.(js|ts|jsx|tsx)$/]        // 包含的文件
}
```

### Plasmo 配置

```typescript
// plasmo.config.ts
const config: PlasmoConfig = {
    build: {
        viteConfig: {
            plugins: [removeConsolePlugin(productionConfig)],
            define: {
                __DEVELOPMENT__: false,
                __PRODUCTION__: true,
                // ...
            },
            esbuild: {
                drop: ["console", "debugger"] // 额外的移除配置
            }
        }
    }
}
```

## 使用示例

### 开发环境

```bash
# 开发服务器（保留所有 console）
npm run dev

# 开发构建（保留所有 console）
npm run build:dev
```

### 生产环境

```bash
# 完整生产构建
npm run build:prod

# 手动移除已有构建中的 console
npm run remove-console
```

### 验证构建结果

构建完成后，可以检查 `build/` 目录中的文件是否还包含 console 语句：

```bash
# 搜索构建文件中的 console
grep -r "console\." build/

# 如果没有输出，说明 console 已成功移除
```

## 环境变量

- `NODE_ENV=production` - 启用生产模式
- `DEBUG=true` - 开启调试模式（即使在生产环境）

## 故障排除

### Console 未被移除

1. 检查 `NODE_ENV` 环境变量是否设置为 `production`
2. 确认使用的是 `npm run build:prod` 而不是普通的 `plasmo build`
3. 检查 `plasmo.config.ts` 配置是否正确

### 构建失败

1. 运行 `npm run typecheck` 检查类型错误
2. 运行 `npm run lint` 检查代码规范
3. 检查依赖是否完整安装

### 性能问题

Console 移除脚本会并行处理文件以提高性能，如果仍然较慢：

1. 检查是否有大量大文件
2. 考虑调整正则表达式的复杂度
3. 使用 `npm run build:prod:simple` 跳过额外的处理步骤

## 安全注意事项

⚠️ **重要提醒**：

1. 生产构建会自动移除所有 console 语句，包括错误日志
2. 如需在生产环境保留关键错误日志，请使用项目中的 `safeConsole.error()` 方法
3. 敏感信息（如 API 密钥）会在构建时自动清理
4. 建议在部署前验证构建产物不包含敏感信息