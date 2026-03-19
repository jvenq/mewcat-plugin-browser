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
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
`

const SidebarHeader = styled.div`
    padding: var(--space-6) var(--space-5);
    border-bottom: 1px solid var(--border-light);
    background: linear-gradient(to bottom, var(--bg-secondary), var(--gray-50));
`

const SidebarTitle = styled.h1`
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin: 0 0 var(--space-3) 0;
    line-height: var(--line-height-tight);
    letter-spacing: -0.02em;
`

const SidebarSubtitle = styled.p`
    font-size: var(--font-size-sm);
    color: var(--text-tertiary);
    margin: 0;
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.02em;
`

const NavList = styled.nav`
    padding: var(--space-5) var(--space-3);
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
`

const NavItem = styled.button<{ $active: boolean }>`
    width: 100%;
    padding: var(--space-4) var(--space-4);
    background: ${props =>
        props.$active ? "var(--primary-light)" : "transparent"};
    border: none;
    border-radius: var(--radius-md);
    text-align: left;
    cursor: pointer;
    font-size: var(--font-size-base);
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

    &:hover {
        background: ${props =>
            props.$active ? "var(--primary-light)" : "var(--gray-100)"};
        color: ${props =>
            props.$active ? "var(--primary-color)" : "var(--text-primary)"};
        transform: translateX(2px);
    }

    &:active {
        transform: translateX(0);
    }

    &::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: ${props =>
            props.$active ? "var(--primary-color)" : "var(--gray-400)"};
        margin-right: var(--space-3);
        flex-shrink: 0;
        opacity: ${props => (props.$active ? "1" : "0.6")};
        transition: all var(--transition-fast);
    }

    ${props =>
        props.$active &&
        `
        &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 60%;
            background: var(--primary-color);
            border-radius: 0 2px 2px 0;
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
