import React from "react"

export interface SvgIconProps {
    className?: string
    style?: React.CSSProperties
}

export const LoadingIcon: React.FC<SvgIconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.25"
        />
        <path
            d="M12 2C6.48 2 2 6.48 2 12"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
        >
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="1s"
                from="0 12 12"
                to="360 12 12"
                repeatCount="indefinite"
            />
        </path>
    </svg>
)

export default LoadingIcon
