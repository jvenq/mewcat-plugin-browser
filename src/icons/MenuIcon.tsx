import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const MenuIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
)

export default MenuIcon
