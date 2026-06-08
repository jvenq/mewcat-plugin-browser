import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const SpinnerIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style}>
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray="31.4 31.4"
            strokeLinecap="round"
        />
    </svg>
)

export default SpinnerIcon
