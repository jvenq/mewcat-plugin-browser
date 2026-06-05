# 译趣喵 (mewCat) 浏览器翻译插件

一个强大的浏览器扩展，提供实时网页翻译功能，支持多种翻译模式和自定义配置。

## 功能特点

### 核心功能
- **沉浸式翻译**：智能识别页面内容，批量翻译并在原位置显示翻译结果
- **划词翻译**：选中文本即可快速翻译
- **右键菜单翻译**：通过右键菜单快速翻译选中内容
- **悬浮按钮控制**：可拖拽的浮动按钮，一键开启/关闭翻译

### 翻译模式
- **HTML标准翻译**：基于HTML标准的网页翻译
- **沉浸式翻译**：智能识别页面布局，保持原有排版风格
- **通用翻译器**：支持多种翻译API服务

### 高级特性
- **智能语言检测**：自动检测源语言（基于franc库）
- **自定义翻译规则**：支持为不同网站设置专属翻译规则
- **域名过滤**：可配置包含/排除特定域名
- **翻译样式自定义**：多种翻译显示样式可选
- **增量翻译**：支持动态内容的实时翻译
- **调试模式**：提供详细的翻译过程调试信息

## 技术栈

- **框架**: [Plasmo](https://docs.plasmo.com/) - 现代化的浏览器扩展开发框架
- **前端框架**: React 18
- **状态管理**: Jotai
- **样式**: Styled Components
- **语言**: TypeScript
- **构建工具**: Plasmo Build System
- **包管理**: pnpm

## 主题体系 — 阳光柑橘 (Sunlit Citrus)

> ⚠️ **新增/修改任何 UI 前请先阅读本节**，确保视觉与当前主题一致。

当前主题为 **阳光柑橘 (Sunlit Citrus)**：清亮暖白底 + 柑橘→鲜绿招牌渐变 + 大圆角 + 柔和漫射暖阴影 + 圆润显示体，明亮、友好、通透。

### 单一数据源

全部设计令牌集中在 **`src/styles/theme.scss`**（CSS 变量 + SCSS mixin），popup / options / sidepanel 三个外壳与 40+ 组件均引用这些令牌。**改主题只需改这一个文件的值**，所有组件自动级联。

### 核心令牌

| 类别 | 变量 | 值 |
|-----|-----|-----|
| 背景 | `--bg-base` / `--bg-primary` / `--bg-secondary` / `--bg-tertiary` | `#fbf6ec` 暖奶白 / `#fffdf8` 主表面 / `#ffffff` 卡片 / `#f6efe1` 内嵌 |
| 主色 | `--primary-color` / `--primary-hover` / `--primary-active` | `#ff8a1e` / `#ff9f44` / `#f0760a` |
| 点缀 | `--accent-green` / `--accent-yellow` | `#5fb84c` 鲜绿 / `#ffc22e` 暖黄 |
| 招牌渐变 | `--gradient-citrus` | `linear-gradient(135deg, #ff7a1e 0%, #ffc22e 52%, #8bc53f 100%)`（日→果→叶） |
| 文字 | `--text-primary` / `--text-secondary` / `--text-tertiary` / `--text-amber` | `#2b2117` / `#6e614e` / `#9e907a` / `#e07712` |
| 边框 | `--border-color` / `--border-citrus` | `rgba(70,50,25,.1)` / `rgba(255,138,30,.4)` |
| 圆角 | `--radius-sm/md/lg/xl/full` | `8 / 12 / 16 / 22 / 9999` px（偏大、圆润友好） |
| 阴影 | `--shadow-sm/md/lg` / `--shadow-primary` | 暖色漫射 `rgba(120,86,30,*)`（非黑色硬阴影）/ 柑橘辉光 |
| 氛围 | `--sun-glow` | 右上角阳光径向光晕 |
| 字体 | `--font-display` / `--font-family` / `--font-mono` | 圆润显示体（`ui-rounded`/`SF Pro Rounded`/`Baloo 2`）/ 正文（`Plus Jakarta Sans` + 系统）/ 等宽（`DM Mono`） |

> 字体一律走「命名 + 系统回退」，**不引入远程 `@import`**（规避 MV3 CSP）。

### 可复用 Mixin（`theme.scss`）

`btn-primary` / `btn-secondary` / `btn-danger`、`input-base`、`card-base` / `card-hover` / `card-elevated`、`list-item`、`divider`、`citrus-scrollbar`、`citrus-badge`。

### 三条约定（务必遵守）

1. **改主题只改值、不改变量名** —— 历史改名的渐变/边框/mixin 保留别名，保证存量组件不破。
2. **新 UI 一律用 `var(--token)` 或 mixin，禁止硬编码色值** —— 这样才能随主题自动切换。
3. **页面注入 UI 是例外** —— content script 注入到任意宿主页面时，`:root` 上的主题变量**不可用**，必须使用**字面色值**，并与令牌保持一致：主色 `#ff8a1e`、渐变 `#ff7a1e→#ffc22e→#8bc53f`、文字 `#2b2117`/`#6e614e`、奶油内嵌 `#f6efe1`、暖色遮罩 `rgba(43,30,12,.45)`、暖色阴影 `rgba(120,86,30,*)`。参见 `src/utils/dom.ts`（loading / 错误弹窗）与 `src/contents/TranslationControlCenter.tsx`（悬浮按钮）。

> 主题演进历史见 [`CLAUDE.md`](./CLAUDE.md) 的「修改记录」章节。

## 项目结构

```
├── src/
│   ├── background/          # 后台脚本
│   │   └── messages/        # 消息处理
│   ├── components/          # React组件
│   │   ├── ApiKeyInput/     # API密钥输入
│   │   ├── CustomSelect/    # 自定义选择器
│   │   ├── CustomToggle/    # 开关组件
│   │   ├── Icon/            # 图标组件
│   │   ├── LoadingDots/     # 加载动画
│   │   ├── Tooltip/         # 提示框
│   │   ├── TranslateTextPanel/ # 翻译面板
│   │   └── UrlManager/      # URL管理器
│   ├── contents/            # 内容脚本
│   │   ├── TranslationControlCenter.tsx  # 翻译控制中心
│   │   ├── initialize.tsx   # 初始化脚本
│   │   └── selectionTranslate.tsx # 划词翻译
│   ├── translation/         # 翻译核心模块
│   │   ├── ImmersiveTranslator.ts    # 沉浸式翻译器
│   │   ├── HtmlStandardTranslator.ts # HTML标准翻译器
│   │   ├── UniversalTranslator.ts    # 通用翻译器
│   │   └── ApiKeyValidator.ts        # API密钥验证
│   ├── services/            # 服务层
│   │   ├── TranslationServiceManager.ts # 翻译服务管理
│   │   └── request.ts       # 网络请求封装
│   ├── state/               # 状态管理
│   │   ├── config.ts        # 配置状态
│   │   └── user.ts          # 用户状态
│   ├── utils/               # 工具函数
│   │   ├── domUtils.ts      # DOM操作工具
│   │   ├── debugUtils.ts    # 调试工具
│   │   ├── securityManager.ts # 安全管理
│   │   └── translationStyles.ts # 翻译样式
│   ├── popup/               # 弹出窗口
│   ├── options/             # 选项页面
│   └── sidepanel/           # 侧边栏面板
├── assets/                  # 静态资源
├── scripts/                 # 构建脚本
└── package.json
```

## 安装与开发

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 打包扩展
```bash
pnpm package
```

## 脚本命令

> 以下与 `package.json` 的 `scripts` 保持同步，修改脚本后请一并更新本表。

### 开发与构建

| 命令 | 说明 |
|-----|-----|
| `pnpm dev` | 启动开发服务器，支持热重载（`plasmo dev`） |
| `pnpm build` | 生产构建：`plasmo build` → 混淆 → 生产 zip |
| `pnpm package` | 打包扩展为带日期的 zip（`scripts/package-with-date.js`） |
| `pnpm package:dev` | 打包开发版（`scripts/package-dev.js`） |
| `pnpm crx` | 构建 `.crx` 包（`scripts/build-crx.js`） |
| `pnpm obfuscate` | JS 代码混淆（`scripts/obfuscate.js`） |
| `pnpm clean` | 清理构建产物与依赖 |

### 质量检查

| 命令 | 说明 |
|-----|-----|
| `pnpm check` | **全量检查**：typecheck + lint + 格式 + hotlink 规则 + 拼写 |
| `pnpm typecheck` | TypeScript 类型检查（`tsc --noEmit`） |
| `pnpm lint` | ESLint 检查 |
| `pnpm format` | Prettier 格式化（写入） |
| `pnpm format:check` | Prettier 仅校验不写入 |
| `pnpm spell` | cspell 拼写检查 |
| `pnpm knip` | 未使用依赖/导出检查 |

### hotlink 规则（沉浸式翻译站点同步）

| 命令 | 说明 |
|-----|-----|
| `pnpm sync:hotlink-rules` | 重新生成 `src/background/config/hotlink-sites.generated.ts` |
| `pnpm check:hotlink-rules` | 校验生成文件是否过期（`pnpm check` 会调用） |

### 其它

| 命令 | 说明 |
|-----|-----|
| `pnpm commit` | 使用 commitizen 交互式提交（`git cz`） |

## 浏览器权限

扩展需要以下权限：
- `tabs` - 访问标签页信息
- `scripting` - 注入内容脚本
- `windows` - 管理浏览器窗口
- `contextMenus` - 创建右键菜单
- `https://*/*` - 访问所有HTTPS网站（用于翻译功能）

## 主要功能模块

### 沉浸式翻译器 (ImmersiveTranslator)
- 智能识别页面内容结构
- 批量翻译优化
- 保持原有页面布局
- 支持增量更新

### 翻译服务管理器 (TranslationServiceManager)
- 支持多种翻译API
- 自动重试机制
- 错误处理和降级策略

### 安全管理器 (SecurityManager)
- XSS防护
- 内容过滤
- API密钥加密存储

## 调试功能

项目内置了完善的调试系统，包括：
- 元素选择器调试
- 翻译规则匹配调试
- 性能监控
- 错误日志记录

## 配置文件

- `eslint.config.mjs` - ESLint配置
- `prettier.config.mjs` - Prettier代码格式化配置
- `tsconfig.json` - TypeScript配置
- `cspell.json` - 拼写检查配置
- `knip.json` - 依赖检查配置

## 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`pnpm commit`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目为私有项目，版权所有。

## 版本

v0.0.1

## 联系方式

如有问题或建议，请提交Issue。