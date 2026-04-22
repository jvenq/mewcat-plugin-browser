# Doc2X 侧边栏翻译浏览器插件

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

| 命令 | 说明 |
|-----|-----|
| `pnpm dev` | 启动开发服务器，支持热重载 |
| `pnpm build` | 构建生产版本 |
| `pnpm build:dev` | 构建开发版本 |
| `pnpm package` | 打包扩展为zip文件 |
| `pnpm lint` | 运行ESLint检查 |
| `pnpm typecheck` | TypeScript类型检查 |
| `pnpm format` | 格式化代码 |
| `pnpm check` | 运行所有检查（类型、lint、格式、拼写） |
| `pnpm spell` | 拼写检查 |
| `pnpm commit` | 使用commitizen提交代码 |
| `pnpm clean` | 清理构建产物和依赖 |

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