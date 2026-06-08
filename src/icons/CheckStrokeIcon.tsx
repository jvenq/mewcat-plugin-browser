import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const CheckStrokeIcon: React.FC<SvgIconProps> = ({ className, style }) => (
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
        <path d="M20 6L9 17l-5-5" />
    </svg>
)

export default CheckStrokeIcon
