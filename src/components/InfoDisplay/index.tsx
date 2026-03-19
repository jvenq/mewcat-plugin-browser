import React from "react"
import styled from "styled-components"

interface InfoDisplayProps {
    label: string
    value: string
    type?: "text" | "version" | "strong"
    className?: string
}

const SCxInfoRow = styled.div`
    margin-bottom: var(--spacing-xl);

    &:last-child {
        margin-bottom: 0;
    }
`

const SCxLabel = styled.label`
    display: block;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
`

const SCxValue = styled.span<{ valueType: string }>`
    font-size: var(--font-size-base);
    color: var(--text-primary);
    font-weight: var(--font-weight-normal);

    ${props =>
        props.valueType === "version" &&
        `
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        background: var(--gray-50);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-small);
        color: var(--primary-color);
        border: 1px solid rgba(25, 118, 210, 0.1);
        display: inline-block;
    `}

    ${props =>
        props.valueType === "strong" &&
        `
        font-weight: var(--font-weight-semibold);
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
