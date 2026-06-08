import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const ArrowRightIcon: React.FC<SvgIconProps> = ({ className, style }) => (
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
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

export default ArrowRightIcon
