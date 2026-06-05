import React from "react"
import styled from "styled-components"

interface SwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    className?: string
    size?: "sm" | "md" | "lg"
}

const SwitchContainer = styled.label<{ $disabled: boolean; $size: string }>`
    display: inline-flex;
    align-items: center;
    cursor: ${props => (props.$disabled ? "not-allowed" : "pointer")};
    opacity: ${props => (props.$disabled ? 0.5 : 1)};

    ${props => {
        const sizes = {
            sm: { width: "36px", height: "20px", knob: "16px", offset: "18px" },
            md: { width: "44px", height: "24px", knob: "20px", offset: "22px" },
            lg: { width: "52px", height: "28px", knob: "24px", offset: "26px" }
        }
        const s = sizes[props.$size as keyof typeof sizes] || sizes.md

        return `
            width: ${s.width};
            height: ${s.height};
        `
    }}
`

const SwitchInput = styled.input`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
`

const SwitchTrack = styled.span<{ $checked: boolean; $size: string }>`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: ${props =>
        props.$checked ? "var(--primary-color)" : "var(--gray-300)"};
    border: 1px solid
        ${props =>
            props.$checked ? "var(--border-citrus)" : "var(--border-color)"};
    border-radius: 9999px;
    transition: all var(--transition-fast);
    flex-shrink: 0;
    box-shadow: ${props =>
        props.$checked ? "var(--primary-glow-sm)" : "var(--shadow-xs)"};

    &::before {
        content: "";
        position: absolute;
        top: 2px;
        left: ${props => {
            const sizes = {
                sm: "2px",
                md: "2px",
                lg: "2px"
            }
            return sizes[props.$size as keyof typeof sizes] || sizes.md
        }};
        width: ${props => {
            const sizes = {
                sm: "16px",
                md: "20px",
                lg: "24px"
            }
            return sizes[props.$size as keyof typeof sizes] || "20px"
        }};
        height: ${props => {
            const sizes = {
                sm: "16px",
                md: "20px",
                lg: "24px"
            }
            return sizes[props.$size as keyof typeof sizes] || "20px"
        }};
        background-color: #fff;
        border-radius: 50%;
        transition: all var(--transition-fast);
        box-shadow: ${props =>
            props.$checked
                ? "0 2px 6px rgba(120, 86, 30, 0.28)"
                : "0 1px 3px rgba(120, 86, 30, 0.22)"};
        transform: ${props =>
            props.$checked ? "translateX(calc(100% - 2px))" : "translateX(0)"};
    }

    &:hover {
        box-shadow: ${props =>
            props.$checked
                ? "var(--primary-glow)"
                : "0 0 0 4px rgba(255, 138, 30, 0.1)"};
    }
`

const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    className,
    size = "md"
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            onChange(e.target.checked)
        }
    }

    return (
        <SwitchContainer
            $disabled={disabled}
            $size={size}
            className={className}
        >
            <SwitchInput
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                role="switch"
                aria-checked={checked}
            />
            <SwitchTrack $checked={checked} $size={size} />
        </SwitchContainer>
    )
}

export default Switch
