import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const ArrowUpIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M7 14l5-5 5 5z" />
    </svg>
)

export default ArrowUpIcon
