import React from "react"
import styled, { keyframes } from "styled-components"

interface LoadingDotsProps {
    /** 是否显示loading动画 */
    loading?: boolean
    /** 点的颜色，默认为琥珀色 */
    color?: string
    /** 点的大小，默认为6px */
    size?: number
    /** 点之间的间距，默认为4px */
    gap?: number
    /** 动画时长，默认为1.4秒 */
    duration?: number
}

const breathe = keyframes`
    0%, 100% {
        transform: scale(0.8);
        opacity: 0.4;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
`

const SCxLoadingContainer = styled.div.withConfig({
    shouldForwardProp: prop => prop !== "loading"
})<{ loading: boolean; gap: number }>`
    display: ${props => (props.loading ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    gap: ${props => props.gap}px;
`

const SCxLoadingDot = styled.div<{
    delay: number
    color: string
    size: number
    duration: number
}>`
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: 50%;
    background: ${props => props.color};
    box-shadow: 0 0 ${props => props.size * 1.5}px ${props => props.color};
    animation: ${breathe} ${props => props.duration}s ease-in-out infinite;
    animation-delay: ${props => props.delay}s;
`

/**
 * 琥珀呼吸点 — Amber breathing dots
 * 三个点依次呼吸闪烁，带琥珀光晕
 */
const LoadingDots: React.FC<LoadingDotsProps> = ({
    loading = false,
    color = "var(--primary-color)",
    size = 5,
    gap = 5,
    duration = 1.4
}) => {
    return (
        <SCxLoadingContainer loading={loading} gap={gap}>
            <SCxLoadingDot
                delay={0}
                color={color}
                size={size}
                duration={duration}
            />
            <SCxLoadingDot
                delay={0.2}
                color={color}
                size={size}
                duration={duration}
            />
            <SCxLoadingDot
                delay={0.4}
                color={color}
                size={size}
                duration={duration}
            />
        </SCxLoadingContainer>
    )
}

export default LoadingDots
