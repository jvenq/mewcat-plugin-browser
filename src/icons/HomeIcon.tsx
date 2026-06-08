import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const HomeIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
)

export default HomeIcon
