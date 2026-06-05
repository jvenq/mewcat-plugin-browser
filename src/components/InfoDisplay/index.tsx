import React from "react"
import styled from "styled-components"

interface InfoDisplayProps {
    label: string
    value: string
    type?: "text" | "version" | "strong"
    className?: string
}

const SCxInfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--border-light);

    &:last-child {
        border-bottom: none;
    }
`

const SCxLabel = styled.label`
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    flex-shrink: 0;
`

const SCxValue = styled.span<{ valueType: string }>`
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    font-weight: var(--font-weight-normal);
    text-align: right;
    word-break: break-word;

    ${props =>
        props.valueType === "version" &&
        `
        font-family: var(--font-mono);
        background: var(--bg-tertiary);
        padding: 2px var(--space-2);
        border-radius: var(--radius-sm);
        color: var(--text-amber);
        border: 1px solid var(--border-color);
        display: inline-block;
    `}

    ${props =>
        props.valueType === "strong" &&
        `
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
    `}
`

const InfoDisplay: React.FC<InfoDisplayProps> = ({
    label,
    value,
    type = "text",
    className
}) => {
    return (
        <SCxInfoRow className={className}>
            <SCxLabel>{label}</SCxLabel>
            <SCxValue valueType={type}>{value}</SCxValue>
        </SCxInfoRow>
    )
}

export default InfoDisplay
