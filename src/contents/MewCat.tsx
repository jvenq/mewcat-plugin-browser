import { useSetAtom } from "jotai"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { always, tryCatch } from "ramda"
import { useEffect } from "react"

import { MEWCAT_MATCHES, isMewCatPage } from "@/config"
import { accessTokenAtom, setAccessTokenAtom } from "@/state"
import type { MewCatUserInfo } from "@/types"

export const config: PlasmoCSConfig = {
    matches: MEWCAT_MATCHES
}

export const getShadowHostId = () => "plasmo-mewcat"

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body

function parseMewCatUser(userInfoStr: string): MewCatUserInfo | null {
    return tryCatch<MewCatUserInfo | null>(
        JSON.parse,
        always<MewCatUserInfo | null>(null)
    )(userInfoStr || "{}")
}

export default function MewCat() {
    const setAccessToken = useSetAtom(accessTokenAtom)
    const setRefreshToken = useSetAtom(setAccessTokenAtom)

    useEffect(() => {
        if (!isMewCatPage()) {
            console.log("[MewCat] 当前页面不是 mewCat 页面，跳过加载")
            return
        }

        window.addEventListener("storage", e => {
            if (e.key === "userInfoStorage") {
                const userInfo = parseMewCatUser(e.newValue)
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
        const userInfo = parseMewCatUser(userInfoStr)
        if (userInfo) {
            const accessToken = userInfo?.state?.token || ""
            accessToken && setAccessToken(accessToken)
            const refreshToken = userInfo?.state?.refreshToken || ""
            refreshToken && setRefreshToken(refreshToken)
        }
    }, [setAccessToken, setRefreshToken])

    return null
}
