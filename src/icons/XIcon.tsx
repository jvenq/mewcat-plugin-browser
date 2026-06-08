import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const XIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
    >
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
)

export default XIcon
