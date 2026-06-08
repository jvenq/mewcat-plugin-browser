import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const WarningIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
)

export default WarningIcon
