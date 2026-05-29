import React from "react"
import styled from "styled-components"

interface NavigationItem {
    id: string
    label: string
    description: string
}

interface OptionsSidebarProps {
    title: string
    subtitle: string
    navigationItems: NavigationItem[]
    activeTab: string
    onTabChange: (tabId: string) => void
    className?: string
}

const SidebarContainer = styled.aside`
    width: 280px;
    height: 100%;
    background: linear-gradient(180deg, #18140f 0%, #14100b 100%);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(245, 166, 35, 0.1) 50%,
            transparent 100%
        );
        pointer-events: none;
    }
`

const SidebarHeader = styled.div`
    padding: var(--space-6) var(--space-5);
    border-bottom: 1px solid var(--border-light);
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: var(--space-5);
        right: var(--space-5);
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent 0%,
            var(--primary-color) 50%,
            transparent 100%
        );
        opacity: 0.3;
    }
`

const SidebarTitle = styled.h1`
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-2) 0;
    line-height: var(--line-height-tight);
    letter-spacing: -0.01em;
    font-family: var(--font-family);

    &::first-letter {
        color: var(--primary-color);
    }
`

const SidebarSubtitle = styled.p`
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    margin: 0;
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: var(--font-mono);
`

const NavList = styled.nav`
    padding: var(--space-4) var(--space-3);
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);

    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--border-amber);
        border-radius: var(--radius-full);

        &:hover {
            background: var(--primary-color);
        }
    }
`

const NavItem = styled.button<{ $active: boolean }>`
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: ${props =>
        props.$active ? "var(--primary-light)" : "transparent"};
    border: 1px solid
        ${props => (props.$active ? "var(--border-amber)" : "transparent")};
    border-radius: var(--radius-md);
    text-align: left;
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: ${props =>
        props.$active
            ? "var(--font-weight-semibold)"
            : "var(--font-weight-normal)"};
    color: ${props =>
        props.$active ? "var(--primary-color)" : "var(--text-secondary)"};
    display: flex;
    align-items: center;
    transition: all var(--transition-fast);
    position: relative;
    font-family: var(--font-family);

    &::before {
        content: "";
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${props =>
            props.$active ? "var(--primary-color)" : "var(--text-tertiary)"};
        margin-right: var(--space-3);
        flex-shrink: 0;
        opacity: ${props => (props.$active ? "1" : "0.4")};
        transition: all var(--transition-fast);
        box-shadow: ${props =>
            props.$active ? "0 0 6px var(--primary-color)" : "none"};
    }

    &:hover {
        background: ${props =>
            props.$active ? "var(--primary-light)" : "var(--primary-muted)"};
        color: ${props =>
            props.$active ? "var(--primary-color)" : "var(--text-primary)"};
        border-color: ${props =>
            props.$active ? "var(--border-amber)" : "var(--border-light)"};
        transform: translateX(2px);

        &::before {
            opacity: 1;
        }
    }

    &:active {
        transform: translateX(0);
    }

    ${props =>
        props.$active &&
        `
        &::after {
            content: "";
            position: absolute;
            left: -1px;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 60%;
            background: var(--gradient-amber);
            border-radius: 0 2px 2px 0;
            box-shadow: var(--primary-glow-sm);
        }
    `}
`

const OptionsSidebar: React.FC<OptionsSidebarProps> = ({
    title,
    subtitle,
    navigationItems,
    activeTab,
    onTabChange,
    className
}) => {
    return (
        <SidebarContainer className={className}>
            <SidebarHeader>
                <SidebarTitle>{title}</SidebarTitle>
                <SidebarSubtitle>{subtitle}</SidebarSubtitle>
            </SidebarHeader>
            <NavList>
                {navigationItems.map(item => (
                    <NavItem
                        key={item.id}
                        $active={activeTab === item.id}
                        onClick={() => onTabChange(item.id)}
                    >
                        {item.label}
                    </NavItem>
                ))}
            </NavList>
        </SidebarContainer>
    )
}

export default OptionsSidebar
