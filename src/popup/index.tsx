import { useAtom, useSetAtom } from "jotai"
import styled from "styled-components"

import { AUTO_DETECT_OPTION, languages } from "@/constants"
import { configAtom, updateConfigAtom } from "@/state"

import "@/styles/popup.scss"
import "@/styles/theme.scss"

import { useAsyncRetry } from "react-use"

import NativeSelect from "../components/NativeSelect"
import CustomToggle from "../components/Switch"
import Tooltip from "../components/Tooltip"
import iconImg from "~/assets/icon.png"

// ============================================
// 夜·琥珀 — Popup
// ============================================

const PopupContainer = styled.div`
    width: 320px;
    min-height: 420px;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    font-family: var(--font-family);
    color: var(--text-primary);
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--gradient-amber);
        opacity: 0.8;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--border-light);
`

const Logo = styled.img`
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-primary-sm);
`

const HeaderInfo = styled.div`
    flex: 1;
`

const HeaderTitle = styled.h1`
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0 0 2px 0;
    line-height: var(--line-height-tight);
    letter-spacing: -0.01em;
`

const HeaderSubtitle = styled.span`
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: var(--font-mono);
`

const HeaderDot = styled.span`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-color);
    animation: amberPulse 2s ease-in-out infinite;
    flex-shrink: 0;

    @keyframes amberPulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
    }
`

const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: var(--space-3);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
`

const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px var(--space-3);
    border-bottom: 1px solid var(--border-light);
    transition: background var(--transition-fast);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: var(--primary-muted);
    }
`

const ListItemLabel = styled.span`
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    font-weight: var(--font-weight-normal);
    display: flex;
    align-items: center;
    gap: var(--space-2);
`

const HelpIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid var(--text-tertiary);
    color: var(--text-tertiary);
    font-size: 9px;
    font-weight: var(--font-weight-bold);
    cursor: help;
    transition: all var(--transition-fast);

    &:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: var(--primary-light);
    }
`

const ModelSelectWrapper = styled.div`
    width: 130px;
    flex-shrink: 0;
`

const LanguageRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
    padding: var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
`

const LanguageBox = styled.div`
    flex: 1;
    min-width: 0;
`

const LanguageLabel = styled.label`
    display: block;
    font-size: 10px;
    color: var(--text-tertiary);
    margin-bottom: 6px;
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: var(--font-mono);
`

const LanguageLabelRight = styled(LanguageLabel)`
    text-align: right;
`

const ArrowIcon = styled.span`
    color: var(--text-amber-dim);
    display: flex;
    align-items: flex-end;
    padding-bottom: 4px;
    flex-shrink: 0;

    svg {
        width: 16px;
        height: 16px;
    }
`

const SettingsButton = styled.button`
    width: 100%;
    padding: var(--space-3);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    font-family: var(--font-family);
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    transition: all var(--transition-fast);

    svg {
        width: 14px;
        height: 14px;
    }

    &:hover {
        background: var(--primary-light);
        border-color: var(--border-amber);
        color: var(--primary-color);
        box-shadow: var(--primary-glow-sm);
    }
`

function IndexPopup() {
    const [config] = useAtom(configAtom)
    const updateConfig = useSetAtom(updateConfigAtom)

    const languageOptions = [AUTO_DETECT_OPTION, ...languages.languages]
    const targetLanguageOptions = languages.languages

    const { value: currentTabUrl } = useAsyncRetry<URL>(() => {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                const currentTab = tabs[0]
                if (currentTab) {
                    const url = currentTab.url
                    return resolve(new URL(url))
                }
                reject(new Error("无法获取当前标签页"))
            })
        })
    }, [])

    const isAlwayTranslateSite = config.alwaysTranslateUrls?.includes(
        currentTabUrl?.hostname || ""
    )

    const modelOptions =
        config.aiModelList
            ?.filter(model => model.enabled)
            ?.map(model => ({
                value: model.id,
                label: model.name || "意外数据"
            })) || []

    const handleToggleTranslation = (checked: boolean) => {
        updateConfig({ isSelectedTranslate: checked })
    }

    const handleToggleContext = (checked: boolean) => {
        updateConfig({ enableContext: checked })
    }

    const handleDetectedLanguageChange = (value: string) => {
        updateConfig({ detectedLanguage: value })
    }

    const handleTargetLanguageChange = (value: string) => {
        updateConfig({ targetLanguage: value })
    }

    const handleCurrentModelChange = (value: string) => {
        updateConfig({ currentModel: value })
    }

    const handleAddTranslationSite = () => {
        if (!currentTabUrl?.hostname) {
            return
        }
        updateConfig({
            alwaysTranslateUrls: isAlwayTranslateSite
                ? config.alwaysTranslateUrls?.filter(
                      url => url !== currentTabUrl?.hostname
                  )
                : [
                      ...(config.alwaysTranslateUrls || []),
                      currentTabUrl?.hostname
                  ]
        })
    }

    const handleOpenSettings = () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
    }

    return (
        <PopupContainer>
            <Header>
                <Logo src={iconImg} alt="mewCat" />
                <HeaderInfo>
                    <HeaderTitle>译趣喵</HeaderTitle>
                    <HeaderSubtitle>智能翻译助手</HeaderSubtitle>
                </HeaderInfo>
                <HeaderDot />
            </Header>

            <Section>
                <ListItem>
                    <ListItemLabel>启用划词翻译</ListItemLabel>
                    <CustomToggle
                        checked={config.isSelectedTranslate}
                        onChange={handleToggleTranslation}
                    />
                </ListItem>
                <ListItem>
                    <ListItemLabel>
                        AI 智能上下文
                        <Tooltip
                            content="结合网页上下文提升翻译效果。需要配置 LLM 翻译服务商。注意：开启后会增加翻译时长。"
                            position="top"
                            width={200}
                        >
                            <HelpIcon>?</HelpIcon>
                        </Tooltip>
                    </ListItemLabel>
                    <CustomToggle
                        checked={config.enableContext ?? false}
                        onChange={handleToggleContext}
                    />
                </ListItem>
                <ListItem>
                    <ListItemLabel>总是翻译此网站</ListItemLabel>
                    <CustomToggle
                        checked={isAlwayTranslateSite}
                        onChange={handleAddTranslationSite}
                    />
                </ListItem>
                <ListItem>
                    <ListItemLabel>翻译模型</ListItemLabel>
                    <ModelSelectWrapper>
                        <NativeSelect
                            value={String(config.currentModel)}
                            onChange={handleCurrentModelChange}
                            options={modelOptions}
                            placeholder="选择模型"
                            size="sm"
                        />
                    </ModelSelectWrapper>
                </ListItem>
            </Section>

            <LanguageRow>
                <LanguageBox>
                    <LanguageLabel>网页语言</LanguageLabel>
                    <NativeSelect
                        value={config.detectedLanguage}
                        disabled
                        onChange={handleDetectedLanguageChange}
                        options={languageOptions}
                        placeholder="检测中..."
                        size="sm"
                    />
                </LanguageBox>
                <ArrowIcon>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </ArrowIcon>
                <LanguageBox>
                    <LanguageLabelRight>目标语言</LanguageLabelRight>
                    <NativeSelect
                        value={config.targetLanguage}
                        onChange={handleTargetLanguageChange}
                        options={targetLanguageOptions}
                        placeholder="选择语言"
                        size="sm"
                    />
                </LanguageBox>
            </LanguageRow>

            <SettingsButton onClick={handleOpenSettings}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                高级设置
            </SettingsButton>
        </PopupContainer>
    )
}

export default IndexPopup
