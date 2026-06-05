import React from "react"
import styled from "styled-components"

import CustomToggle from "../Switch"

interface ToggleRowProps {
    title: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
    className?: string
}

const SCxToggleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    margin-bottom: var(--space-2);
    transition: all var(--transition-fast);

    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        background: var(--bg-tertiary);
        border-color: var(--border-light);
    }
`

const SCxToggleLabel = styled.div`
    flex: 1;
    min-width: 0;
`

const SCxToggleTitle = styled.div`
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
`

const SCxToggleDescription = styled.div`
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    line-height: var(--line-height-normal);
`

const ToggleRow: React.FC<ToggleRowProps> = ({
    title,
    description,
    checked,
    onChange,
    className
}) => {
    return (
        <SCxToggleRow className={className}>
            <SCxToggleLabel>
                <SCxToggleTitle>{title}</SCxToggleTitle>
                <SCxToggleDescription>{description}</SCxToggleDescription>
            </SCxToggleLabel>
            <CustomToggle checked={checked} onChange={onChange} />
        </SCxToggleRow>
    )
}

export default ToggleRow
