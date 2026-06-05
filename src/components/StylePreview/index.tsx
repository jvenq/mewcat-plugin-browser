import React from "react"
import styled from "styled-components"

import type { TranslationStyleType } from "@/types/translationStyle"
import { getTranslationStyleCSS } from "@/utils"

interface StylePreviewProps {
    style: TranslationStyleType
    className?: string
}

const SCxPreviewContainer = styled.div`
    /* background: var(--gradient-primary); */
    /* border: 1px solid var(--border-light); */
    /* border-radius: var(--border-radius); */
    /* padding: var(--spacing-lg); */
    position: relative;
    overflow: hidden;

    /* &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--gradient-header);
        opacity: 0.8;
    } */
`

const SCxPreviewText = styled.div.withConfig({
    shouldForwardProp: prop => prop !== "styleName"
})<{ styleName: TranslationStyleType }>`
    ${props => getTranslationStyleCSS(props.styleName)}
`

const StylePreview: React.FC<StylePreviewProps> = ({ style, className }) => {
    return (
        <SCxPreviewContainer className={className}>
            <SCxPreviewText styleName={style}>
                This is a translation example 这是一个翻译示例
            </SCxPreviewText>
        </SCxPreviewContainer>
    )
}

export default StylePreview
