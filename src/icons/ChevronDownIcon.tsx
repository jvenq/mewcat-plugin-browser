import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const ChevronDownIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
)

export default ChevronDownIcon
