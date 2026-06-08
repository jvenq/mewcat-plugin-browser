import React from "react"
import styled from "styled-components"

import {
    AddIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    CheckIcon,
    CloseIcon,
    CopyIcon,
    DeleteIcon,
    DownloadIcon,
    DragIcon,
    EditIcon,
    ErrorIcon,
    EyeIcon,
    EyeOffIcon,
    FavoriteIcon,
    HelpIcon,
    HomeIcon,
    InfoIcon,
    LanguageIcon,
    LinkIcon,
    LoadingIcon,
    MenuIcon,
    PaletteIcon,
    RefreshIcon,
    SaveIcon,
    SearchIcon,
    SettingsIcon,
    StarIcon,
    SuccessIcon,
    TestIcon,
    TranslateIcon,
    UploadIcon,
    WarningIcon
} from "@/icons"

export interface IconProps {
    name: string
    size?: number | string
    color?: string
    className?: string
    style?: React.CSSProperties
    onClick?: () => void
}

const SCxIconContainer = styled.div.withConfig({
    shouldForwardProp: prop => prop !== "clickable"
})<{ size: number | string; clickable: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${props =>
        typeof props.size === "number" ? `${props.size}px` : props.size};
    height: ${props =>
        typeof props.size === "number" ? `${props.size}px` : props.size};
    cursor: ${props => (props.clickable ? "pointer" : "default")};
    flex-shrink: 0;

    svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
        transition: all 0.2s ease;
    }

    &:hover svg {
        ${props => (props.clickable ? "transform: scale(1.1);" : "")}
    }
`

const iconMap: Record<string, React.FC> = {
    // 翻译相关
    translate: TranslateIcon,
    check: CheckIcon,
    success: SuccessIcon,
    language: LanguageIcon,

    // 可见性
    eye: EyeIcon,
    "eye-off": EyeOffIcon,

    // 操作
    test: TestIcon,
    loading: LoadingIcon,
    close: CloseIcon,
    settings: SettingsIcon,
    link: LinkIcon,
    drag: DragIcon,
    help: HelpIcon,
    add: AddIcon,
    delete: DeleteIcon,
    edit: EditIcon,
    save: SaveIcon,
    refresh: RefreshIcon,
    copy: CopyIcon,

    // 导航
    home: HomeIcon,
    search: SearchIcon,
    menu: MenuIcon,

    // 箭头
    "arrow-down": ArrowDownIcon,
    "arrow-up": ArrowUpIcon,

    // 状态
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon,

    // 文件操作
    download: DownloadIcon,
    upload: UploadIcon,

    // 装饰
    star: StarIcon,
    favorite: FavoriteIcon,
    palette: PaletteIcon
}

const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    color = "currentColor",
    className,
    style,
    onClick
}) => {
    const IconComponent = iconMap[name]

    if (!IconComponent) {
        console.warn(
            `Icon "${name}" not found. Available icons:`,
            Object.keys(iconMap)
        )
        return null
    }

    return (
        <SCxIconContainer
            size={size}
            clickable={!!onClick}
            className={className}
            style={{ color, ...style }}
            onClick={onClick}
        >
            <IconComponent />
        </SCxIconContainer>
    )
}

export default Icon

export type IconName = keyof typeof iconMap

export {
    AddIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    CheckIcon,
    CloseIcon,
    CopyIcon,
    DeleteIcon,
    DownloadIcon,
    DragIcon,
    EditIcon,
    ErrorIcon,
    EyeIcon,
    EyeOffIcon,
    FavoriteIcon,
    HelpIcon,
    HomeIcon,
    InfoIcon,
    LanguageIcon,
    LinkIcon,
    LoadingIcon,
    MenuIcon,
    PaletteIcon,
    RefreshIcon,
    SaveIcon,
    SearchIcon,
    SettingsIcon,
    StarIcon,
    SuccessIcon,
    TestIcon,
    TranslateIcon,
    UploadIcon,
    WarningIcon
}
