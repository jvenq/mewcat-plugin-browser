import React from "react"
import styled from "styled-components"

interface OptionsContentHeaderProps {
    title: string
    description: string
    className?: string
}

const HeaderContainer = styled.div`
    margin-bottom: var(--space-6);
`

const ContentTitle = styled.h2`
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
    line-height: var(--line-height-tight);
`

const ContentDescription = styled.p`
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0;
    line-height: var(--line-height-normal);
    display: flex;
    align-items: center;
    gap: var(--space-2);

    &::before {
        content: "";
        display: inline-block;
        width: 3px;
        height: 14px;
        background: var(--primary-color);
        border-radius: 2px;
    }
`

const OptionsContentHeader: React.FC<OptionsContentHeaderProps> = ({
    title,
    description,
    className
}) => {
    return (
        <HeaderContainer className={className}>
            <ContentTitle>{title}</ContentTitle>
            <ContentDescription>{description}</ContentDescription>
        </HeaderContainer>
    )
}

export default OptionsContentHeader
