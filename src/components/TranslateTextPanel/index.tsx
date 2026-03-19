import { useAtomValue } from "jotai"
import { clone } from "ramda"
import React, { useLayoutEffect } from "react"
import { useAsyncRetry } from "react-use"
import styled from "styled-components"

import { accessTokenAtom } from "@/state"
import { useConfig } from "@/state/config"
import { TranslationServiceManager } from "@/translation/TranslationServiceManager"
import { AiModel_Platform_Enum } from "@/types"

import LoadingDots from "../LoadingDots"

interface TranslateTextPanelProps {
    data?: string
    onFinished?: () => void
}

const SCxContainer = styled.div`
    width: 100%;
    padding: 8px;
    overflow: hidden auto;
    color: #333;
    position: relative;
    width: 100%;
    max-height: 250px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden auto;
    box-sizing: border-box;
`

const SCxText = styled.div.withConfig({
    shouldForwardProp: prop => !(prop === "loading")
})<{ loading: boolean }>`
    font-size: 16px;
    font-weight: 600;
    opacity: ${props => (props.loading ? 0.5 : 1)};
    transition: opacity 0.2s ease;
`

const SCxErrorText = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: red;
`

const SCxLoadingContainer = styled.div`
    background: rgba(255, 255, 255, 0.9);
    border-radius: 6px;
    width: 100%;
    height: 100px;
    /* padding: 12px 16px; */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`

const SCxLoadingText = styled.span`
    font-size: 12px;
    color: #666;
    font-weight: 500;
`
export const TranslateTextPanel: React.FunctionComponent<
    TranslateTextPanelProps
> = ({ data, onFinished }) => {
    const config = useConfig()
    const accessToken = useAtomValue(accessTokenAtom)

    const {
        value: translateText,
        loading,
        error
    } = useAsyncRetry(async () => {
        if (!data) {
            return
        }
        const newConfig = clone(config)
        newConfig.aiModelList.map(item => {
            if (item.type === AiModel_Platform_Enum.SYSTEM) {
                item.params.apiKey = accessToken
            }
            return item
        })

        const translationManager = new TranslationServiceManager(newConfig)
        const result = await translationManager.translateText(
            [
                {
                    role: "user",
                    content: data
                }
            ],
            "zh-CN"
        )

        return result
    }, [data, config, accessToken])

    useLayoutEffect(() => {
        translateText && !loading && onFinished()
    }, [loading, onFinished, translateText])

    return (
        <SCxContainer>
            <SCxText loading={loading}>{translateText || ""}</SCxText>

            {loading && (
                <SCxLoadingContainer>
                    <LoadingDots loading={true} color="#1976d2" size={4} />
                    <SCxLoadingText>翻译中...</SCxLoadingText>
                </SCxLoadingContainer>
            )}
            {error && <SCxErrorText>{error.message} </SCxErrorText>}
        </SCxContainer>
    )
}
