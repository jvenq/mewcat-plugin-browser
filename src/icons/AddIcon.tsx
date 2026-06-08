import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const AddIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
)

export default AddIcon
