import { useSetAtom } from "jotai"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { always, tryCatch } from "ramda"
import { useEffect } from "react"

import { DOC2X_MATCHES, isDoc2xPage } from "@/config"
import { accessTokenAtom, setAccessTokenAtom } from "@/state"
import type { Doc2xUserInfo } from "@/types"

// 使用统一的配置
// Plasmo 需要在构建时静态分析，不能使用运行时计算的值
export const config: PlasmoCSConfig = {
    matches: DOC2X_MATCHES
}

export const getShadowHostId = () => "plasmo-doc2x"

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body

function parseDoc2xUser(userInfoStr: string): Doc2xUserInfo | null {
    return tryCatch<Doc2xUserInfo | null>(
        JSON.parse, // 尝试解析
        always<Doc2xUserInfo | null>(null) // 解析失败时返回空对象（可自定义）
    )(userInfoStr || "{}")
}

export default function Doc2x() {
    const setAccessToken = useSetAtom(accessTokenAtom)
    const setRefreshToken = useSetAtom(setAccessTokenAtom)

    useEffect(() => {
        // 运行时检查：确保只在 Doc2X 页面执行
        if (!isDoc2xPage()) {
            console.log("[Doc2x] 当前页面不是 Doc2X 页面，跳过加载")
            return
        }

        window.addEventListener("storage", e => {
            if (e.key === "userInfoStorage") {
                const userInfo = parseDoc2xUser(e.newValue)
                if (!userInfo) {
                    return
                }
                const accessToken = userInfo?.state?.token || ""
                accessToken && setAccessToken(accessToken)
                const refreshToken = userInfo?.state?.refreshToken || ""
                refreshToken && setRefreshToken(refreshToken)
            }
        })

        const userInfoStr = localStorage.getItem("userInfoStorage")
        const userInfo = parseDoc2xUser(userInfoStr)
        if (userInfo) {
            const accessToken = userInfo?.state?.token || ""
            accessToken && setAccessToken(accessToken)
            const refreshToken = userInfo?.state?.refreshToken || ""
            refreshToken && setRefreshToken(refreshToken)
        }
    }, [setAccessToken, setRefreshToken])

    return null
}
