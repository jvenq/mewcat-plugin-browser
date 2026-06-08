import React from "react"
import styled, { keyframes } from "styled-components"

import { SpinnerIcon, TranslateIcon } from "@/icons"

interface ImageTranslateButtonProps {
    /** 是否显示 */
    visible: boolean
    /** 是否正在翻译 */
    translating: boolean
    /** 点击事件 */
    onClick: () => void
    /** 按钮位置 */
    position: { x: number; y: number }
    /** 鼠标进入按钮 */
    onMouseEnter?: () => void
    /** 鼠标离开按钮 */
    onMouseLeave?: () => void
}

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const SCxButton = styled.button.withConfig({
    shouldForwardProp: prop => !["visible", "translating"].includes(prop)
})<{ visible: boolean; translating: boolean }>`
    position: fixed;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7748f9 0%, #9d6fff 100%);
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 12px rgba(119, 72, 249, 0.4);
    cursor: ${props => (props.translating ? "not-allowed" : "pointer")};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    opacity: ${props => (props.visible ? 1 : 0)};
    pointer-events: ${props => (props.visible ? "auto" : "none")};
    animation: ${props => (props.visible ? fadeIn : "none")} 0.15s ease;
    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        transform: ${props => (props.translating ? "scale(1)" : "scale(1.1)")};
        box-shadow: 0 6px 16px rgba(119, 72, 249, 0.5);
    }

    &:active {
        transform: ${props => (props.translating ? "scale(1)" : "scale(0.95)")};
    }

    color: white;

    svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
        animation: ${props => (props.translating ? spin : "none")} 1s linear
            infinite;
    }
`

export const ImageTranslateButton: React.FC<ImageTranslateButtonProps> = ({
    visible,
    translating,
    onClick,
    position,
    onMouseEnter,
    onMouseLeave
}) => {
    return (
        <SCxButton
            visible={visible}
            translating={translating}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
            title={translating ? "翻译中..." : "点击翻译图片"}
        >
            {translating ? <SpinnerIcon /> : <TranslateIcon />}
        </SCxButton>
    )
}
