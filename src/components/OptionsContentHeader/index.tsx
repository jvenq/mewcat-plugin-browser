import React from "react"
import styled from "styled-components"

interface OptionsContentHeaderProps {
    title: string
    description: string
    className?: string
}

const HeaderContainer = styled.div`
    margin-bottom: var(--space-6);
    position: relative;
`

const ContentTitle = styled.h2`
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-3) 0;
    line-height: var(--line-height-tight);
    font-family: var(--font-display);
    letter-spacing: -0.02em;

    &::first-letter {
        color: var(--primary-color);
    }
`

const ContentDescription = styled.p`
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0;
    line-height: var(--line-height-normal);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-family);

    &::before {
        content: "";
        display: inline-block;
        width: 3px;
        height: 16px;
        background: var(--gradient-amber);
        border-radius: 2px;
        box-shadow: var(--primary-glow-sm);
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
