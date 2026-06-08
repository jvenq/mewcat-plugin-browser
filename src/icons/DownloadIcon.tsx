import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const DownloadIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
)

export default DownloadIcon
