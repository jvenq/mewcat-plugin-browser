#!/usr/bin/env node

/**
 * 打包开发版本的扩展
 * 将 chrome-mv3-dev 目录 以开发环境打包为 chrome-mv3-dev.zip
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const buildDir = path.join(__dirname, "..", "build")
const devDir = path.join(buildDir, "chrome-mv3-dev")
const zipFile = path.join(buildDir, "chrome-mv3-dev.zip")

// 检查开发构建目录是否存在
if (!fs.existsSync(devDir)) {
    console.error("❌ 错误: chrome-mv3-dev 目录不存在")
    console.error("   请先运行: pnpm build --development")
    process.exit(1)
}

// 删除旧的 zip 文件
if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile)
    console.log("🗑️  删除旧的 zip 文件")
}

try {
    // 进入 build 目录并打包
    console.log("📦 正在打包 chrome-mv3-dev...")

    // 使用系统的 zip 命令
    execSync("zip -r chrome-mv3-dev.zip chrome-mv3-dev", {
        cwd: buildDir,
        stdio: "inherit"
    })

    // 获取文件大小
    const stats = fs.statSync(zipFile)
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)

    console.log(`✅ 打包完成: chrome-mv3-dev.zip (${fileSizeInMB} MB)`)
} catch (error) {
    console.error("❌ 打包失败:", error.message)
    process.exit(1)
}
