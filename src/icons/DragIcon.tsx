import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const DragIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
    </svg>
)

export default DragIcon
