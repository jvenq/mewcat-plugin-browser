import React from "react"
import styled from "styled-components"

interface OptionsSectionProps {
    title: string
    rightSection?: React.ReactNode
    layout?: "default" | "grid" | "horizontal"
    children: React.ReactNode
    className?: string
}

const Section = styled.div`
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-4) var(--space-5);
    margin-bottom: var(--space-4);
    border: 1px solid var(--border-color);
    position: relative;
    transition: all var(--transition-base);

    &:hover {
        border-color: var(--gray-300);
    }
`

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-light);
    margin: 0 0 var(--space-4) 0;
    padding-bottom: var(--space-3);
`

const SectionTitle = styled.h3`
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    display: flex;
    justify-content: baseline;
    gap: var(--space-2);
    position: relative;
    margin: 0;

    &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary-color);
        margin-right: var(--space-2);
        flex-shrink: 0;
        margin-top: 5px;
    }
`

const SectionContent = styled.div<{ layout?: string }>`
    display: ${props => {
        switch (props.layout) {
            case "grid":
                return "grid"
            case "horizontal":
                return "flex"
            default:
                return "block"
        }
    }};

    ${props =>
        props.layout === "grid" &&
        `
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: var(--space-3);
        }
    `}

    ${props =>
        props.layout === "horizontal" &&
        `
        gap: var(--space-4);
        align-items: flex-start;

        > * {
            flex: 1;
        }

        @media (max-width: 768px) {
            flex-direction: column;
            gap: var(--space-3);
        }
    `}
`

const OptionsSection: React.FC<OptionsSectionProps> = ({
    title,
    rightSection,
    layout = "default",
    children,
    className
}) => {
    return (
        <Section className={className}>
            <SectionHeader>
                <SectionTitle>{title}</SectionTitle>
                <div>{rightSection}</div>
            </SectionHeader>
            <SectionContent layout={layout}>{children}</SectionContent>
        </Section>
    )
}

export default OptionsSection
