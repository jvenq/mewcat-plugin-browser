const crx = require("crx")
const path = require("path")
const fs = require("fs")

const sourceDir = path.resolve(__dirname, "../build/chrome-mv3") // 构建目录
const outputDir = path.resolve(__dirname, "../release") // 输出目录
const privateKeyPath = path.resolve(__dirname, "../key.pem") // 私钥文件（用于签名）

// 如果没有私钥，crx 会自动生成，但建议保存一份用于更新插件
const packCrx = async () => {
    const builder = new crx({
        appId: "your-extension-id", // 可选：插件ID
        codebase: "https://example.com/your-extension.crx", // 可选：更新URL
        privateKey: fs.existsSync(privateKeyPath) ? fs.readFileSync(privateKeyPath) : null
    })

    const crxBuffer = await builder.load(sourceDir)
    const crxPath = path.join(outputDir, "extension.crx")

    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(crxPath, crxBuffer)

    // 如果是新生成的私钥，保存它
    if (!fs.existsSync(privateKeyPath)) {
        fs.writeFileSync(privateKeyPath, builder.key)
    }

    console.log(`[CRX 打包完成] ${crxPath}`)
}

packCrx().catch(err => {
    console.error("打包 CRX 出错:", err)
})
