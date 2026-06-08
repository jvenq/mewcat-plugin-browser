import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const PlayIcon: React.FC<SvgIconProps> = ({ className, style }) => (
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
        <path d="M5 3l14 9-14 9V3z" />
    </svg>
)

export default PlayIcon
