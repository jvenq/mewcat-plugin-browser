import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useMemo } from "react"
import styled from "styled-components"

import { AUTO_DETECT_OPTION, languages } from "@/constants"
import {
    accessTokenAtom,
    configAtom,
    fetchUserAtom,
    updateConfigAtom,
    userAtom
} from "@/state"

import "@/styles/popup.scss"
import "@/styles/theme.scss"

import { useAsyncRetry } from "react-use"

import { DOC2X_URL } from "@/constants/common"
import { doc2xRequest } from "@/services/request"
import { Toast, ToastType } from "@/utils/toast"

import NativeSelect from "../components/NativeSelect"
import CustomToggle from "../components/Switch"
import Tooltip from "../components/Tooltip"
import iconImg from "~/assets/icon.png"

// ============================================
// Styled Components - Modern Minimalist Design
// ============================================

const PopupContainer = styled.div`
    width: 320px;
    min-height: 400px;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    font-family: var(--font-family);
    color: var(--text-primary);
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
    width: 40px;
    height: 40px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
`

const HeaderInfo = styled.div`
    flex: 1;
`

const HeaderTitle = styled.h1`
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-1) 0;
    line-height: var(--line-height-tight);
`

const HeaderSubtitle = styled.span`
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
`

const UserCard = styled.div`
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    margin-bottom: var(--space-3);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    transition: all var(--transition-fast);

    &:hover {
        border-color: var(--gray-300);
        box-shadow: var(--shadow-sm);
    }
`

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--gray-100);
    flex-shrink: 0;
`

const AvatarPlaceholder = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--gray-100);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-400);
    flex-shrink: 0;

    svg {
        width: 18px;
        height: 18px;
    }
`

const UserInfo = styled.div`
    flex: 1;
    min-width: 0;
`

const UserName = styled.div`
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const UserStatus = styled.div`
    font-size: var(--font-size-xs);
    color: ${props => {
        const subscribed = props.children?.toString().includes("会员")
        return subscribed ? "var(--success)" : "var(--text-tertiary)"
    }};
`

const RefreshButton = styled.button`
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    flex-shrink: 0;

    svg {
        width: 14px;
        height: 14px;
    }

    &:hover {
        background: var(--gray-100);
        color: var(--primary-color);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &[data-loading="true"] {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`

const QuotaGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-4);
`

const QuotaItem = styled.div`
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--border-color);
    transition: all var(--transition-fast);

    &:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-sm);
        transform: translateY(-1px);
    }
`

const QuotaLabel = styled.div`
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    margin-bottom: var(--space-2);
    font-weight: var(--font-weight-medium);
`

const QuotaValue = styled.div`
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
`

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: var(--space-4);
`

const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--border-light);

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    &:first-child {
        padding-top: 0;
    }
`

const ListItemLabel = styled.span`
    font-size: var(--font-size-sm);
    color: var(--text-primary);
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
    font-size: 10px;
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
    gap: var(--space-3);
    margin-top: var(--space-1);
    padding: var(--space-3);
    background: rgba(119, 72, 249, 0.04);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
`

const LanguageBox = styled.div`
    flex: 1;
    min-width: 0;
`

const LanguageLabel = styled.label`
    display: block;
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    margin-bottom: var(--space-2);
    font-weight: var(--font-weight-medium);
`

const LanguageLabelRight = styled(LanguageLabel)`
    text-align: right;
`

const ArrowIcon = styled.span`
    color: var(--text-tertiary);
    display: flex;
    align-items: flex-end;
    padding-bottom: var(--space-1);
    flex-shrink: 0;

    svg {
        width: 16px;
        height: 16px;
    }
`

const SettingsButton = styled.button`
    width: 100%;
    margin-top: var(--space-5);
    padding: var(--space-3);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    transition: all var(--transition-fast);

    svg {
        width: 16px;
        height: 16px;
    }

    &:hover {
        background: var(--primary-light);
        border-color: var(--primary-color);
        color: var(--primary-color);
        box-shadow: var(--shadow-sm);
    }
`

function IndexPopup() {
    const [config] = useAtom(configAtom)
    const accessToken = useAtomValue(accessTokenAtom)
    const user = useAtomValue(userAtom)
    console.log("🚀 ~ IndexPopup ~ user:", user)
    const fetchUser = useSetAtom(fetchUserAtom)

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

    const { retry: fetchUserRetry, loading } = useAsyncRetry(async () => {
        doc2xRequest.defaults.headers.Authorization = `Bearer ${accessToken}`
        if (config.currentModel === "SYSTEM") {
            if (!accessToken) {
                Toast.show({
                    message: (
                        <span>
                            请先登录
                            <a
                                href="https://doc2x.noedgeai.com"
                                target="_blank"
                                style={{
                                    color: "white",
                                    display: "block",
                                    textDecoration: "underline",
                                    wordBreak: "auto-phrase"
                                }}
                            >
                                https://doc2x.noedgeai.com
                            </a>
                        </span>
                    ),
                    type: ToastType.WARNING
                })
                return Promise.reject(new Error("请先去登录"))
            }
        } else {
            Toast.show({
                message: "使用自定义 API 模型，可无需登录",
                type: ToastType.WARNING
            })
            return Promise.resolve()
        }
        try {
            await fetchUser()
        } catch (error) {
            Toast.show({
                message: `获取用户信息失败, 请重新打开 ${DOC2X_URL}`,
                type: ToastType.ERROR
            })
            return Promise.reject(error)
        }
    }, [accessToken, fetchUser])

    const isAlwayTranslateSite = config.alwaysTranslateUrls?.includes(
        currentTabUrl?.hostname || ""
    )

    const userLevelName = useMemo(() => {
        if (user?.subscriptRemainQuota?.subscribed) {
            return user?.subscriptRemainQuota?.subscription_level === 1
                ? "会员"
                : "年度会员"
        }
        return "Free"
    }, [
        user?.subscriptRemainQuota?.subscribed,
        user?.subscriptRemainQuota?.subscription_level
    ])

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
                <Logo src={iconImg} alt="Doc2X" />
                <HeaderInfo>
                    <HeaderTitle>Doc2X 翻译</HeaderTitle>
                    <HeaderSubtitle>智能翻译助手</HeaderSubtitle>
                </HeaderInfo>
            </Header>

            <UserCard>
                {user.avatar ? (
                    <Avatar
                        src={user.avatar}
                        alt={user.username || "用户头像"}
                    />
                ) : (
                    <AvatarPlaceholder>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </AvatarPlaceholder>
                )}
                <UserInfo>
                    <UserName>
                        {user.phone ? user.username || "未命名" : "未登录"}
                    </UserName>
                    <UserStatus>{userLevelName}</UserStatus>
                </UserInfo>
                {loading ? null : (
                    <RefreshButton
                        onClick={fetchUserRetry}
                        title="刷新用户信息"
                        data-loading={loading.toString()}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M23 4v6h-6M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                    </RefreshButton>
                )}
            </UserCard>

            {user && (
                <QuotaGrid>
                    <QuotaItem>
                        <QuotaLabel>解析额度</QuotaLabel>
                        <QuotaValue>
                            {Number(user?.freeRemainQuota?.available_pages) +
                                Number(
                                    user?.subscriptRemainQuota?.available_pages
                                ) || "0"}
                        </QuotaValue>
                    </QuotaItem>
                    <QuotaItem>
                        <QuotaLabel>高级积分</QuotaLabel>
                        <QuotaValue>
                            {(
                                Number(
                                    user?.subscriptRemainQuota
                                        ?.available_points ?? 0
                                ) / 100
                            ).toFixed(2)}
                        </QuotaValue>
                    </QuotaItem>
                </QuotaGrid>
            )}

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
