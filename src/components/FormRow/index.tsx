import React from "react"
import styled, { css } from "styled-components"

import type { FormRowProps } from "./types"

const FormRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    transition: all var(--transition-fast);

    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        background: var(--bg-tertiary);
        border-color: var(--border-light);
    }
`

const Label = styled.label<{ required: boolean }>`
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);

    ${({ required }) =>
        required &&
        css`
            &::after {
                margin-left: 6px;
                content: "*";
                color: var(--error);
                font-size: var(--font-size-xs);
            }
        `}
`

const Description = styled.p`
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    margin: 0;
    line-height: var(--line-height-normal);
`

const FormRowComponent: React.FC<FormRowProps> = ({
    label,
    description,
    required,
    children,
    className,
    style
}) => {
    return (
        <FormRow className={className} style={style}>
            <Label required={required}>{label}</Label>
            {description && <Description>{description}</Description>}
            {children}
        </FormRow>
    )
}

FormRowComponent.displayName = "FormRow"

export default FormRowComponent
