# rule.json Schema 文档

`assets/rule.json` 是 mewCat 翻译规则的核心配置文件，包含两部分：

- **`generalRule`**：全局默认规则，适用于所有页面
- **`rules`**：站点特定规则数组（789 条），按 URL/选择器匹配后与 generalRule 合并

本文档仅描述 `generalRule` 的属性。`rules` 中的站点规则使用相同的字段名，但覆盖或扩展 generalRule 的对应值（通过 `RuleEngine.mergeAllRulesConfig()` 完成合并）。

---

## 属性分类说明

- **A 类（已使用）**：代码中直接消费，删除会影响翻译行为
- **B 类（计划功能）**：RuleEngine 在合并时正确处理这些字段，但下游尚未实现消费逻辑；保留是为了减少未来实现的迁移成本

---

## A 类：当前已使用属性

### DOM 选择器

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selectors` | `string[]` | `[]` | 翻译目标选择器（白名单）。空数组 = 全页面模式 |
| `additionalSelectors` | `string[]` | `[h1, h2, ...]` | 补充选择器，强制翻译（即使不在 selectors 范围内） |
| `excludeSelectors` | `string[]` | `["[default-translate]"]` | 排除选择器（最高优先级，永不翻译） |
| `additionalExcludeSelectors` | `string[]` | `[50 个选择器]` | 额外排除选择器，追加到 excludeSelectors |
| `stayOriginalSelectors` | `string[]` | `[]` | 保留原文选择器，元素自身不翻译但处理子元素 |
| `atomicBlockSelectors` | `string[]` | `[3 个]` | 原子块选择器，作为整体翻译不拆分子元素 |
| `extraInlineSelectors` | `string[]` | `[4 个]` | 将匹配元素视为内联元素 |
| `extraBlockSelectors` | `string[]` | `[11 个]` | 将匹配元素视为块级元素 |

### 标签过滤

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `excludeTags` | `string[]` | `[22 个]` | 排除的 HTML 标签（如 SCRIPT、STYLE、SVG） |
| `stayOriginalTags` | `string[]` | `[16 个]` | 保留原文的 HTML 标签（如 CODE、TT、IMG） |
| `allBlockTags` | `string[]` | `[53 个]` | 所有块级标签集合，用于判断元素是否为块级 |
| `preserveTagsInTranslation` | `string[]` | `["A"]` | 翻译时保留的标签及其属性 |

### 文本阈值

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `blockMinTextCount` | `number` | `24` | 块级元素最小字符数，低于此值不翻译 |
| `blockMinWordCount` | `number` | `4` | 块级元素最小单词数，低于此值不翻译 |
| `paragraphMinTextCount` | `number` | `2` | 段落最小字符数 |
| `paragraphMinWordCount` | `number` | `1` | 段落最小单词数 |
| `asideMaxTextCount` | `number` | `1000` | 侧边栏元素最大总字符数（超出则视为主内容） |
| `asideMaxTextCountPerParagraph` | `number` | `0` | 侧边栏每段落最大字符数（0 = 不限） |
| `asideMaxWordCountPerParagraph` | `number` | `0` | 侧边栏每段落最大单词数（0 = 不限） |

### 正则过滤

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `excludeRegexps` | `string[]` | `[3 个]` | 内容排除正则，匹配的整段文本跳过翻译 |
| `noTranslateRegexp` | `string[]` | `[8 个]` | 不翻译正则，匹配的文本块跳过翻译 |
| `excludeSelectorsRegexes` | `Record<string, string[]>` | `{td,th: [...]}` | 选择器特定正则排除，键为 CSS 选择器，值为正则数组 |

### MutationObserver（动态内容监听）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mutationObserverContainerSelectors` | `string[]` | `[]` | 监听动态变化的容器选择器 |
| `mutationExcludeSelectors` | `string[]` | `[11 个]` | 排除监听的选择器，这些元素的变化不触发翻译 |
| `mutationChangeDelay` | `number` | `10` | DOM 变化触发翻译的防抖延迟（毫秒） |

---

## B 类：计划功能属性

这些属性在 `generalRule` 和站点规则中正确保存，`RuleEngine` 合并时也正确处理，但当前没有下游代码消费它们。保留原因和实现路径见各属性说明。

### DOM 扩展选择器

#### `additionalStayOriginalSelectors`

```json
"additionalStayOriginalSelectors": ["span.katex", ".MathJax", ".MathJax_SVG", ...]
```

- **当前状态**：JSON 中有 31 个数学公式相关选择器（KaTeX、MathJax、LaTeX 等），但 `DOMTraverser.matchesStayOriginalSelectors()` 只读取 `rule.stayOriginalSelectors`，未合并此字段
- **实现路径**：在 `DOMTraverser.matchesStayOriginalSelectors()` 中合并两个数组：
  ```ts
  return this.matchesAnySelector(element, [
      ...(this.rule.stayOriginalSelectors || []),
      ...(this.rule.additionalStayOriginalSelectors || [])
  ])
  ```

#### `inlineTags`

```json
"inlineTags": ["A", "ABBR", "FONT", "B", "EM", "SPAN", ...]
```

- **当前状态**：JSON 中有 47 个标签，RuleEngine 支持站点规则通过 `inlineTags.add` / `inlineTags.remove` 修改此列表，但 `DOMTraverser` 目前仅用 `allBlockTags` 判断块/内联
- **实现路径**：在 DOMTraverser 判断内联标签时，读取 `rule.inlineTags` 作为内联标签白名单

### 内容注入

#### `injectedCss`

```json
"injectedCss": [
    ".immersive-translate-target-wrapper {word-break:break-word; user-select:text;}",
    ...
]
```

- **当前状态**：站点规则中大量使用此字段修复各站点的布局问题，JSON 中保存了值，但无代码将这些 CSS 注入到页面
- **实现路径**：在 `ImmersiveTranslator.initialize()` 后注入 `rule.injectedCss` 到 `<style>` 标签

### SPA 页面兼容

#### `waitForSelectors` + `waitForSelectorsTimeout`

```json
"waitForSelectors": [],
"waitForSelectorsTimeout": 3000
```

- **说明**：等待这些 CSS 选择器对应的元素出现后再启动翻译，用于 React/Vue 等 SPA 框架渲染完成前的等待
- **实现路径**：在 `ImmersiveTranslator.translate()` 入口处，对 `waitForSelectors` 中的每个选择器执行 `waitForElement()` 轮询

### 术语保护

#### `glossaries`

```json
"glossaries": [
    { "k": "LLM", "v": "" },
    { "k": "LLMs", "v": "" }
]
```

- **说明**：`v` 为空字符串表示翻译时跳过该词（保留原文）；`v` 非空时替换为指定译文
- **实现路径**：在 `UniversalTranslator` 构建提示词时，附加类似 `"以下术语翻译保持原文：LLM, LLMs"` 的指令

### 输入框翻译

#### `inputConfig`

```json
"inputConfig": {
    "clearContentEnable": true,
    "execCommandDeleteEnable": false,
    "enableRangeDeleteContent": false,
    "autoLanguageEnable": true,
    "autoLanguagePageEnable": false,
    "autoLanguageSites": ["Youtube", "Twitter", "Telegram", "Whatsapp", "Reddit"],
    "autoLanguageSitesMainland": []
}
```

- **说明**：输入框翻译功能（将用户输入实时翻译后回写输入框）
- **实现路径**：实现 `inputTranslate.tsx` content script，读取此配置控制行为

### 图片翻译配置

#### `imageRule`

- **说明**：mewCat 已有图片翻译功能（`imageTranslate.tsx`），但配置是硬编码的，未从 `rule.imageRule` 读取
- **实现路径**：重构 `imageTranslate.tsx`，改为从 `ruleEngine.mergeAllRulesConfig().imageRule` 读取配置，支持站点级覆盖
- **当前 imageRule 中有用的字段**：`enable`、`enableMouseHover`、`hoverMinWidth`/`hoverMinHeight`、`concurrency`、`noTranslateRegexes`

### 翻译容器构建优化

#### `skipBuildContainerSelectors` + `buildContainerSelectors` + `enableSkipBuildContainer`

```json
"skipBuildContainerSelectors": ["br", "hr", "em"],
"buildContainerSelectors": ["td"],
"enableSkipBuildContainer": false
```

- **说明**：控制哪些元素不包装翻译容器（如 br/hr 不需要），哪些元素必须包装（如 td）
- **实现路径**：在 DOMTraverser 构建翻译容器的阶段消费这些选择器

### MutationObserver 扩展配置

这组属性已在 JSON 末尾定义，为 MutationObserver 提供更细粒度的控制，待 `MutationObserverManager` 扩展后消费：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mutationExcludeContainsSelectors` | `string[]` | `[15 个]` | 包含这些子选择器的父元素不触发翻译 |
| `mutationObserverEnabled` | `boolean` | `true` | 是否启用 MutationObserver |
| `mutationEnableUrlChange` | `boolean` | `true` | 是否监听 URL 变化并重新翻译（SPA 路由） |
| `mutationCheckSelfUpdate` | `boolean` | `true` | 是否检测翻译结果自身的变化（防死循环） |
| `mutationBuildTimeout` | `number` | `100` | 构建翻译容器的防抖延迟（毫秒） |
| `mutationConsumeTimeout` | `number` | `100` | 文本变化处理的防抖延迟（毫秒） |
| `mutationRepeatTranslateNum` | `number` | `3` | 同一节点最多翻译次数（防死循环） |
| `skipDynamicMarkSelectors` | `string[]` | `[2 个]` | 跳过动态标记元素（如插件自身注入的 wrapper） |
| `mutationBlockUrls` | `string[]` | `[3 个]` | 不启用 MutationObserver 的 URL 列表 |

---

## 站点规则（rules 数组）

`rules` 数组包含 **789 条**站点特定规则，每条规则可包含 `GeneralRule` 和 `SiteRule` 中的任意字段，通过以下机制与 `generalRule` 合并：

- **数组字段**：两者合并后去重（`selectors`、`excludeTags` 等）
- **对象字段**：深度合并（`excludeSelectorsRegexes`、`imageRule` 等）
- **`.add`/`.remove` 操作**：`excludeTags.add`、`stayOriginalTags.remove` 等在合并后修改数组
- **基础类型**：站点规则覆盖 generalRule

详见 `RuleEngine.deepMergeRules()`。

---

## 已删除属性

以下属性曾存在于 `generalRule`，已在 2026-06-05 清理中移除：

| 属性/类别 | 删除原因 |
|---------|---------|
| `subtitleRule`（~500 行）、`enableSubtitle`、`ytAsrConfig` | mewCat 无字幕功能 |
| `aiWriting`（~200 行）、`aiRule` | mewCat 无 AI 写作功能 |
| `bodyRule`、`enableServerDetectLanguage` | 复杂 AI 内容检测，未在 mewCat 实现 |
| `pdfNew*`、`isPdf`、`pdfUrlExtractRule` | mewCat 无 PDF 阅读模式 |
| `touchShortcuts*`、`fingerCount*` | 无移动端触控功能 |
| `mouseHoverHoldKey`、`mousePressHoldTranslateDelay`、`mouseHoverExcludeSelectors` | 鼠标悬停翻译与 mewCat 划词逻辑不同 |
| `darkModeRule` | 深色模式检测未实现 |
| `privacyProtocolVersion`、`privacyProtocolEnableTime` | 原版产品法务数据 |
| `purifyRichHtml`、`domPurifyAddTags` | DOMPurify 未集成 |
| `longBuildDomLength`、`detectTextBufferLength`、`smallCodeLength` 等 7 个 | 原版内部性能调参 |
| `pageLangDetectWeight`、`detectionServiceOrder` | mewCat 用 franc 做语言检测 |
| `shareConfig`、`searchEnhancementConfig` | 分享/搜索增强功能未实现 |
| `isOnBoardingPage`、`isEbook`、`isEbookBuilder`、`isSubtitleBuilder` | 其他产品模式 |
| `ignoreZhCNandZhTW`、`showSponsorOnSafari` | 原版产品专属 |
| `wrapperPrefix`/`wrapperSuffix`、`targetWrapperTag` | 原版 Smart Wrapper 功能 |
| `globalAttributes`、`initialSelectorGlobalAttributes` 等 | DOM 属性注入未实现 |
| `preTranslateLimiter`、`condition`、`normalizeBody` | 复杂条件规则系统未实现 |
| 含 `_v.[x.x.x]` 的版本化键（7 个） | RuleEngine 不解析点号键名，从未生效 |
| `mutationConfig` | 已被独立的 `mutation*` 字段替代 |
