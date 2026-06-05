import React from "react"
import styled from "styled-components"

import Icon from "../Icon"

interface SelectionDotProps {
    x: number
    y: number
    onClick: () => void
    onMouseEnter?: () => void
    interactionMode: "click" | "hover"
    triggerMode?: "direct" | "dot" | "shift" | "ctrl"
}

const SCxDot = styled.div<{ x: number; y: number }>`
    position: fixed;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    z-index: 100000;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    transform: translate(-50%, -100%) translateY(-8px);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    animation: fadeInScale 0.2s ease-out forwards;

    &:hover {
        transform: translate(-50%, -100%) translateY(-8px) scale(1.1);
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }

    &:active {
        transform: translate(-50%, -100%) translateY(-8px) scale(0.95);
    }

    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(-8px) scale(0.8);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(-8px) scale(1);
        }
    }
`

const SCxTooltip = styled.div.withConfig({
    shouldForwardProp: prop => prop !== "show"
})<{ show: boolean }>`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: ${props => (props.show ? 1 : 0)};
    visibility: ${props => (props.show ? "visible" : "hidden")};
    transition: all 0.2s ease;
    pointer-events: none;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
    }
`

/**
 * 划词翻译触发点组件
 * 支持不同触发模式下的显示和交互
 */
const SelectionDot = React.forwardRef<HTMLDivElement, SelectionDotProps>(
    (
        { x, y, onClick, onMouseEnter, interactionMode, triggerMode = "dot" },
        ref
    ) => {
        const [showTooltip, setShowTooltip] = React.useState(false)

        const handleMouseEnter = () => {
            setShowTooltip(true)
            if (interactionMode === "hover" && onMouseEnter) {
                onMouseEnter()
            }
        }

        const handleMouseLeave = () => {
            setShowTooltip(false)
        }

        const handleClick = () => {
            if (interactionMode === "click") {
                onClick()
            }
        }

        // 根据触发模式生成提示文本
        const getTooltipText = () => {
            const interaction = interactionMode === "hover" ? "悬停" : "点击"
            switch (triggerMode) {
                case "shift":
                    return `${interaction}翻译 (需按住Shift)`
                case "ctrl":
                    return `${interaction}翻译 (需按住Ctrl)`
                case "dot":
                    return `${interaction}翻译`
                case "direct":
                default:
                    return `${interaction}翻译`
            }
        }

        // 根据触发模式调整图标
        const getIcon = () => {
            switch (triggerMode) {
                case "shift":
                    return "keyboard"
                case "ctrl":
                    return "keyboard"
                case "dot":
                case "direct":
                default:
                    return "translate"
            }
        }

        return (
            <SCxDot
                ref={ref}
                x={x}
                y={y}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Icon name={getIcon()} size={14} color="white" />
                <SCxTooltip show={showTooltip}>{getTooltipText()}</SCxTooltip>
            </SCxDot>
        )
    }
)

export default SelectionDot
