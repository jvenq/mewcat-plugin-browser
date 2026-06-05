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
    padding: var(--space-5) var(--space-6);
    margin-bottom: var(--space-5);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    position: relative;
    transition: all var(--transition-base);

    &:hover {
        border-color: var(--border-citrus);
        box-shadow: var(--shadow-md);
    }
`

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-light);
    margin: 0 0 var(--space-5) 0;
    padding-bottom: var(--space-4);
`

const SectionTitle = styled.h3`
    font-family: var(--font-display);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    letter-spacing: -0.01em;
    margin: 0;

    &::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: var(--gradient-citrus);
        flex-shrink: 0;
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
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-5);

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            gap: var(--space-4);
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
