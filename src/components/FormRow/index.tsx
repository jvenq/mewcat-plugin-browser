import React from "react"
import styled, { css } from "styled-components"

import type { FormRowProps } from "./types"

const FormRow = styled.div`
    margin-bottom: var(--space-3);
    padding: var(--space-1) var(--space-3);
    transition: all var(--transition-fast);

    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        background: var(--gray-50);
        border-radius: var(--radius-md);
    }
`

const Label = styled.label<{ required: boolean }>`
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
    position: relative;
    padding-left: var(--space-3);

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--gray-400);
    }

    ${({ required }) =>
        required &&
        css`
            &::after {
                margin-left: 8px;
                content: "*";
                color: var(--error);
                font-size: var(--font-size-xs);
            }
        `}
`

const Description = styled.p`
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin: var(--space-1) 0 0 0;
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
            {children}
            {description && <Description>{description}</Description>}
        </FormRow>
    )
}

FormRowComponent.displayName = "FormRow"

export default FormRowComponent
