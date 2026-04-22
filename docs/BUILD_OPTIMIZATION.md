# 生产环境构建优化文档

本文档说明了项目的生产环境构建优化策略。

## 构建流程

生产环境构建执行以下步骤：

```bash
pnpm build
# 等同于：plasmo build && pnpm zip:prod
# 其中 zip:prod = pnpm obfuscate && pnpm clean:prod:zip && pnpm package
```

## 优化策略

### 1. Webpack 代码压缩 (`plasmo.config.js`)

#### JavaScript 压缩 (Terser)

使用 `terser-webpack-plugin` 进行 JavaScript 代码压缩：

**压缩选项：**
- ✅ 移除 `console.log`
- ✅ 移除 `debugger` 语句
- ✅ 移除未使用的代码（dead code elimination）
- ✅ 移除未使用的函数
- ✅ 内联函数（inline level 2）
- ✅ 合并变量
- ✅ 优化 if-return 和 if-continue
- ✅ 折叠常量表达式
- ✅ 移除未使用的变量

**混淆选项：**
- ✅ 混淆变量名（toplevel）
- ✅ 混淆类名
- ✅ 混淆函数名

**格式选项：**
- ✅ 移除所有注释
- ✅ 使用 ASCII 编码
- ✅ 并行处理（提高构建速度）

#### CSS 压缩

使用 `css-minimizer-webpack-plugin` 进行 CSS 压缩：

- ✅ 移除所有注释
- ✅ 规范化空白字符
- ✅ 优化颜色值
- ✅ 压缩字体值
- ✅ 压缩渐变
- ✅ 压缩选择器

#### 代码分割优化

- **Vendor 分离**: 将 `node_modules` 中的第三方库分离到独立的 chunk
- **公共代码提取**: 至少被 2 个模块引用的代码提取到公共 chunk
- **确定性 ID**: 使用确定性的模块和 chunk ID，有利于缓存

### 2. JavaScript 代码混淆 (`scripts/obfuscate.js`)

在 Webpack 压缩之后，使用 `javascript-obfuscator` 进行额外的代码混淆。

#### 混淆功能

**控制流混淆：**
- ✅ 控制流扁平化（50% 阈值）
- ✅ 死代码注入（20% 阈值）

**字符串混淆：**
- ✅ 字符串数组化
- ✅ Base64 编码
- ✅ 字符串数组旋转和打乱
- ✅ 字符串数组包装器（函数调用）

**标识符混淆：**
- ✅ 十六进制命名
- ✅ 数字转表达式

**安全功能：**
- ✅ 禁用控制台输出
- ⚠️ 调试保护（已禁用，避免影响调试）
- ⚠️ 自卫功能（已禁用，浏览器扩展不适用）

#### 排除规则

以下文件不会被混淆（保持兼容性）：
- `node_modules/` 中的文件
- `vendors.*.js` (webpack vendor bundle)
- `runtime.*.js` (webpack runtime)

## 性能影响

### 文件大小优化

- **JavaScript**: 通常减少 60-80%
- **CSS**: 通常减少 30-50%
- **总体包大小**: 减少 50-70%

### 运行时性能

- **混淆代码**: 可能略微降低运行速度（~5-10%）
- **压缩代码**: 不影响运行速度
- **加载速度**: 文件更小，加载更快

## 配置说明

### 开发环境

开发环境不启用压缩和混淆，以便于调试：

```bash
pnpm dev
```

### 生产环境

生产环境完整优化流程：

```bash
pnpm build
```

### 仅打包（不混淆）

如果需要打包但不混淆（用于调试生产版本）：

```bash
plasmo build
pnpm package
```

## 注意事项

1. **调试困难**: 混淆后的代码难以调试，建议在混淆前充分测试
2. **构建时间**: 混淆会增加构建时间（约 20-30 秒）
3. **错误追踪**: 建议保留 source map 用于错误追踪（当前已禁用）
4. **兼容性**: 某些动态代码可能会被混淆破坏，需要添加到排除列表

## 故障排除

### 混淆后功能异常

如果混淆后发现某些功能异常：

1. 在 `scripts/obfuscate.js` 中添加排除规则
2. 调整混淆选项（降低阈值或禁用某些功能）
3. 检查是否使用了动态代码（如 `eval`、`Function` 构造函数）

### URI Malformed 错误

如果混淆时出现 "URI malformed" 错误：

**原因**：
- Base64 编码的字符串包含特殊字符
- 高强度混淆配置与代码不兼容

**解决方案**（已在当前版本修复）：
- 移除 `stringArrayEncoding: ["base64"]`，改为 `[]`
- 降低混淆强度阈值
- 使用 `mangled` 标识符生成器代替 `hexadecimal`
- 添加混淆后代码验证

### 构建失败

如果构建失败：

1. 检查 Node.js 版本（建议 16+）
2. 清理缓存：`pnpm clean`
3. 重新安装依赖：`pnpm install`
4. 检查是否有语法错误

### 混淆耗时过长

如果混淆时间超过 1 分钟：

1. 降低混淆强度（减小阈值）
2. 增加排除规则（跳过大文件）
3. 禁用某些混淆功能：
   - `controlFlowFlattening: false`
   - `deadCodeInjection: false`

## 优化建议

1. **定期测试**: 每次修改混淆配置后都要进行完整测试
2. **渐进式优化**: 从低强度混淆开始，逐步提高
3. **关键代码保护**: 对敏感逻辑使用更强的混淆
4. **性能监控**: 监控混淆后的运行性能
5. **A/B 测试**: 对比混淆前后的用户体验

## 相关文件

- `plasmo.config.js` - Webpack 压缩配置
- `scripts/obfuscate.js` - 代码混淆脚本
- `package.json` - 构建脚本定义
