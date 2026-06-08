import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const PaletteIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 .83.67 1.5 1.5 1.5.83 0 1.5-.67 1.5-1.5 0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83.67 1.5 1.5 1.5S12 12.83 12 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
        <circle cx="6.5" cy="11.5" r="1.5" />
        <circle cx="9.5" cy="7.5" r="1.5" />
        <circle cx="14.5" cy="7.5" r="1.5" />
        <circle cx="17.5" cy="11.5" r="1.5" />
    </svg>
)

export default PaletteIcon
