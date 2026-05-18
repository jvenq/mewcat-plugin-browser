import { useAtom } from "jotai"
import type { PlasmoGetInlineAnchor } from "plasmo"

import "react"

import styled, { StyleSheetManager } from "styled-components"

import Icon from "../components/Icon"
import SelectionDot from "../components/SelectionDot"
import { TranslateTextPanel } from "../components/TranslateTextPanel"

import "../constants"

import { useMemo } from "react"

import {
    INTERACTION_MODE_OPTIONS,
    plasmoShadowRootContainerId,
    TRIGGER_MODE_OPTIONS
} from "../constants"
import { useSelectionTranslate } from "../hooks/useSelectionTranslate"
import { configAtom } from "../state"

export const getShadowHostId = () => "plasmo-overlay-selection"

const rootId = "selectionRoot"

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body

const SCxContainer = styled.div.withConfig({
    shouldForwardProp: prop => !(prop === "isVisible")
})<{ isVisible: boolean }>`
    position: fixed;
    width: 338px;
    min-height: 120px;
    /* max-height: 300px; */
    z-index: 99999;
    background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(25, 118, 210, 0.2);
    border: 1px solid rgba(25, 118, 210, 0.1);
    backdrop-filter: blur(10px);
    opacity: ${props => (props.isVisible ? 1 : 0)};
    transform: ${props =>
        props.isVisible
            ? "translateY(0) scale(1)"
            : "translateY(-8px) scale(0.95)"};
    /* transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); */
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
    }
`

const SCxHeader = styled.div`
    padding: 12px 16px 8px 16px;
    border-bottom: 1px solid rgba(25, 118, 210, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const SCxTitle = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: #1976d2;
    display: flex;
    align-items: center;
    gap: 6px;

    .icon-translate {
        width: 18px;
        height: 18px;
        background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

const SCxCloseButton = styled.button`
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #666;
    font-size: 12px;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(25, 118, 210, 0.1);
        color: #1976d2;
    }
`

const SCxContent = styled.div``

const SelectionTranslate = () => {
    const [config] = useAtom(configAtom)

    const getRootElement = () =>
        (document.querySelector(`#${getShadowHostId()}`)?.shadowRoot ??
            undefined) as unknown as HTMLElement | undefined

    // 使用划词翻译 Hook
    const {
        state,
        dotRef,
        containerRef,
        actions,
        config: selectionConfig
    } = useSelectionTranslate<HTMLDivElement>({
        shadowId: plasmoShadowRootContainerId,
        config
    })

    const triggerModelLabel = useMemo(
        () =>
            TRIGGER_MODE_OPTIONS.find(
                v => v.value === config.selectionTriggerMode
            )?.label,
        [config.selectionTriggerMode]
    )

    const interactionModeLabel = useMemo(
        () =>
            INTERACTION_MODE_OPTIONS.find(
                v => v.value === config.selectionInteractionMode
            )?.label,
        [config.selectionInteractionMode]
    )
    return (
        <StyleSheetManager target={getRootElement()}>
            <div id={rootId}>
                {/* 触发点组件 - dot模式或按键模式下显示 */}
                {state.isDotVisible && state.triggerDot && (
                    <SelectionDot
                        x={state.triggerDot.x}
                        y={state.triggerDot.y}
                        onClick={actions.onDotClick}
                        onMouseEnter={actions.onDotHover}
                        interactionMode={selectionConfig.interactionMode}
                        triggerMode={selectionConfig.triggerMode}
                        ref={dotRef}
                    />
                )}
                {/* 翻译面板 */}
                <SCxContainer
                    isVisible={state.isVisible && !!state.text}
                    style={{
                        top: state.position?.top || 0,
                        left: state.position?.left || 0,
                        opacity: state.isVisible ? 1 : 0,
                        pointerEvents: state.isVisible ? "auto" : "none"
                    }}
                    ref={containerRef}
                >
                    <SCxHeader>
                        <SCxTitle>
                            <div className="icon-translate">
                                <Icon
                                    name="translate"
                                    size={12}
                                    color="white"
                                />
                            </div>
                            划词翻译
                            {/* 显示当前触发模式 */}
                            {selectionConfig.triggerMode !== "direct" && (
                                <span
                                    style={{
                                        fontSize: "10px",
                                        opacity: 0.7,
                                        marginLeft: "4px"
                                    }}
                                >
                                    ( {triggerModelLabel}-{interactionModeLabel}
                                    )
                                </span>
                            )}
                        </SCxTitle>
                        <SCxCloseButton onClick={actions.hideAll}>
                            <Icon name="close" size={12} />
                        </SCxCloseButton>
                    </SCxHeader>

                    <SCxContent>
                        <TranslateTextPanel
                            data={state.text}
                            onFinished={actions.onComputeRect}
                        />
                    </SCxContent>
                </SCxContainer>
            </div>
        </StyleSheetManager>
    )
}

export default SelectionTranslate
