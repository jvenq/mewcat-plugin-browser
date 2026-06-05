# 测试目录说明

## 目录结构

```
test/
├── README.md                    # 本文件：测试目录说明
├── test-401-interceptor.ts      # 401 响应拦截器测试 ✨ NEW
├── test-token-refresh.ts        # Token 刷新机制测试（需要额外依赖）
├── test-token-refresh.html      # Token 刷新测试（浏览器版）
└── archive/                     # 已归档的测试文件
    └── web3-test.js             # Web3 连接测试（已停用）
```

## 测试文件说明

### 1. Token 刷新测试

**test-401-interceptor.ts** - 401 响应拦截器测试 ✨ **推荐使用**
- **完全模拟** `src/services/request.ts` 中的 401 拦截器实现
- **无需额外依赖**，使用 Node.js 内置功能和 axios
- 测试场景：
  1. ✅ 单个请求触发 401，自动刷新 token
  2. ✅ 多个并发请求触发 401，只刷新一次 token
  3. ✅ refresh token 无效，清除 token 并返回错误
- 状态：**所有测试通过** ✅

运行方式：
```bash
pnpm test:401
# 或
pnpm run test:401
```

---

**test-token-refresh.ts** - Token 刷新机制测试（旧版）
- 测试 `src/services/request.ts` 中的 401 响应拦截器
- 验证 token 自动刷新机制
- 测试场景：
  1. 单个请求触发 401，自动刷新 token
  2. 多个并发请求触发 401，只刷新一次 token
  3. refresh token 无效，清除 token 并返回错误
- 依赖：`axios-mock-adapter`（需要安装）

当前状态：需要安装 `axios-mock-adapter` 才能运行

**test-token-refresh.html** - Token 刷新测试（浏览器可视化）
- 可视化模拟 token 刷新流程
- 包含完整的测试场景模拟
- 实时显示 Storage 状态
- 详细的日志输出

运行方式：
直接用浏览器打开 test-token-refresh.html 文件

---

### 2. 已归档测试

**archive/web3-test.js** - Web3 连接测试
- 原因：项目已移除 web3 依赖
- 内容：测试 Sepolia 测试网连接
- 状态：已停用
- 功能：
  - 连接到 Sepolia 测试网
  - 获取网络信息、区块号、Gas 价格
  - 创建测试账户
  - 查询地址余额

如需恢复此测试，需要重新安装 web3 依赖：
```bash
pnpm add -D web3
```

---

## 如何运行测试

### 运行 401 拦截器测试 ✨ 推荐
```bash
pnpm test:401
# 或
pnpm run test:401
```

### 运行 Token 刷新测试
由于需要额外依赖，暂时未添加到 package.json，可以：
1. 安装依赖：`pnpm add -D axios-mock-adapter`
2. 运行：`npx tsx ./test/test-token-refresh.ts`
3. 或直接打开 HTML 版本

---

## 测试维护说明

### 添加新测试
1. 在 test/ 目录下创建测试文件
2. 命名规范：`test-<功能名>.ts` 或 `test-<功能名>.html`
3. 在本 README.md 中添加说明
4. 在 package.json 的 scripts 中添加快捷命令

### 归档测试
当测试不再适用或依赖已移除时：
1. 将文件移至 `test/archive/` 目录
2. 在本 README.md 中标注归档原因
3. 从 package.json 中移除相关脚本

---

## 注意事项

1. **环境要求**:
   - Node.js 版本：建议使用项目指定版本
   - 包管理器：强制使用 pnpm
2. **Mock 依赖**: token 刷新测试需要 `axios-mock-adapter`，暂未添加到项目依赖中
3. **浏览器测试**: HTML 测试文件可直接在浏览器中打开，或通过本地服务器访问

---

## 相关文档

- [Connect RPC 文档](https://connectrpc.com/docs/web/getting-started)
- [Axios 拦截器文档](https://axios-http.com/docs/interceptors)
