import { clone } from "ramda"
import * as React from "react"
import { useCallback, useRef, useState } from "react"
import styled from "styled-components"

import "@/styles/theme.scss"

import { AUTO_DETECT_OPTION, languages } from "@/constants"
import { useConfig } from "@/state/config"
import { TranslationServiceManager } from "@/translation/TranslationServiceManager"

import LoadingDots from "../components/LoadingDots"
import NativeSelect from "../components/NativeSelect"
import {
    CheckStrokeIcon,
    ClipboardIcon,
    CopyStrokeIcon,
    PlayIcon,
    SwapIcon,
    XIcon
} from "@/icons"
import iconImg from "~/assets/icon.png"

// ============================================
// 夜·琥珀 — Side Panel
// ============================================

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
        180deg,
        var(--bg-primary) 0%,
        var(--bg-base) 100%
    );
    background-image:
        var(--sun-glow),
        linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-base) 100%);
    font-family: var(--font-family);
    color: var(--text-primary);
`

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: var(--space-4);
        right: var(--space-4);
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent 0%,
            var(--primary-color) 50%,
            transparent 100%
        );
        opacity: 0.28;
    }
`

const Logo = styled.img`
    width: 26px;
    height: 26px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-primary-sm);
`

const HeaderTitle = styled.h1`
    font-family: var(--font-display);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin: 0;
    flex: 1;
    letter-spacing: -0.01em;
`

const HeaderBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px var(--space-2);
    color: var(--text-amber);
    background: var(--primary-light);
    border: 1px solid rgba(255, 138, 30, 0.24);
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.06em;
    text-transform: uppercase;

    &::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--primary-color);
        box-shadow: 0 0 6px var(--primary-color);
        animation: amberBadgePulse 2s ease-in-out infinite;
    }

    @keyframes amberBadgePulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.45;
        }
    }
`

// ============================================
// Quick Translate
// ============================================

const TranslatePane = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--space-3) var(--space-4) var(--space-4);
    gap: var(--space-3);
    overflow-y: auto;
    min-height: 0;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--border-amber);
        border-radius: var(--radius-full);
    }
`

const LanguageRow = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-2);
`

const LangBox = styled.div`
    flex: 1;
    min-width: 0;
`

const SwapButton = styled.button`
    width: 32px;
    height: 32px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all var(--transition-fast);

    svg {
        width: 14px;
        height: 14px;
    }

    &:hover:not(:disabled) {
        border-color: var(--border-amber);
        color: var(--primary-color);
        background: var(--primary-muted);
        box-shadow: var(--primary-glow-sm);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

const TextAreaWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`

const StyledTextarea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: var(--space-3);
    padding-right: var(--space-8);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-sm);
    font-family: var(--font-family);
    line-height: var(--line-height-relaxed);
    color: var(--text-primary);
    resize: vertical;
    box-sizing: border-box;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-xs);

    &::placeholder {
        color: var(--text-tertiary);
    }

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        background: var(--bg-secondary);
        box-shadow:
            0 0 0 3px rgba(255, 138, 30, 0.14),
            var(--shadow-sm);
    }
`

const ClearButton = styled.button`
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    width: 20px;
    height: 20px;
    border: 1px solid var(--border-color);
    background: var(--bg-tertiary);
    border-radius: 50%;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);

    svg {
        width: 10px;
        height: 10px;
    }

    &:hover {
        background: var(--error-bg);
        border-color: var(--error-border);
        color: var(--error);
    }
`

const ActionRow = styled.div`
    display: flex;
    gap: var(--space-2);
`

const PasteButton = styled.button`
    flex: 1;
    padding: var(--space-2) var(--space-3);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
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
        border-color: var(--border-amber);
        color: var(--primary-color);
        background: var(--primary-muted);
    }
`

const TranslateButton = styled.button<{ $loading?: boolean }>`
    flex: 2;
    padding: var(--space-2) var(--space-4);
    background: var(--gradient-amber);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-inverse);
    cursor: ${p => (p.$loading ? "not-allowed" : "pointer")};
    opacity: ${p => (p.$loading ? 0.8 : 1)};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    transition: all var(--transition-fast);

    svg {
        width: 14px;
        height: 14px;
    }

    &:hover:not(:disabled) {
        box-shadow: var(--shadow-primary);
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        transform: scale(0.98);
    }
`

const Divider = styled.div`
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent 0%,
        var(--border-color) 50%,
        transparent 100%
    );
`

const ResultBox = styled.div`
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    min-height: 100px;
    padding: var(--space-3);
    position: relative;
    flex: 1;
    box-shadow: var(--shadow-xs);
`

const ResultText = styled.div<{ $empty?: boolean; $error?: boolean }>`
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
    color: ${p =>
        p.$error
            ? "var(--error)"
            : p.$empty
              ? "var(--text-tertiary)"
              : "var(--text-primary)"};
    white-space: pre-wrap;
    word-break: break-word;
    min-height: 60px;
`

const ResultActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-2);
    gap: var(--space-2);
`

const IconButton = styled.button<{ $success?: boolean }>`
    padding: var(--space-1) var(--space-2);
    border: 1px solid
        ${p => (p.$success ? "var(--success-border)" : "var(--border-color)")};
    border-radius: var(--radius-sm);
    background: ${p => (p.$success ? "var(--success-bg)" : "transparent")};
    font-size: var(--font-size-xs);
    color: ${p => (p.$success ? "var(--success)" : "var(--text-tertiary)")};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all var(--transition-fast);

    svg {
        width: 12px;
        height: 12px;
    }

    &:hover {
        color: var(--primary-color);
        border-color: var(--border-amber);
        background: var(--primary-muted);
    }
`

const LoadingBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4);
    color: var(--text-tertiary);
    font-size: var(--font-size-xs);
`

// ============================================
// Component
// ============================================

const SlidePanel: React.FunctionComponent = () => {
    const [inputText, setInputText] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState(false)
    const [sourceLang, setSourceLang] = useState("auto")
    const [targetLang, setTargetLang] = useState("zh-CN")
    const abortRef = useRef<AbortController | null>(null)

    const config = useConfig()

    const sourceOptions = [AUTO_DETECT_OPTION, ...languages.languages]
    const targetOptions = languages.languages

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInputText(text)
        } catch {
            // clipboard permission denied, user can type manually
        }
    }, [])

    const handleTranslate = useCallback(async () => {
        const text = inputText.trim()
        if (!text || loading) {
            return
        }

        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setLoading(true)
        setError("")
        setResult("")

        try {
            const newConfig = clone(config)
            if (sourceLang !== "auto") {
                newConfig.detectedLanguage = sourceLang
            }

            const manager = new TranslationServiceManager(newConfig)
            const translated = await manager.translateText(
                [{ role: "user", content: text }],
                targetLang
            )
            setResult(translated || "")
        } catch (e) {
            if ((e as Error)?.name !== "AbortError") {
                setError((e as Error)?.message || "翻译失败，请重试")
            }
        } finally {
            setLoading(false)
        }
    }, [inputText, loading, config, sourceLang, targetLang])

    const handleSwapLang = useCallback(() => {
        if (sourceLang === "auto") {
            return
        }
        setSourceLang(targetLang)
        setTargetLang(sourceLang)
        setInputText(result)
        setResult("")
    }, [sourceLang, targetLang, result])

    const handleCopy = useCallback(async () => {
        if (!result) {
            return
        }
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }, [result])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                handleTranslate()
            }
        },
        [handleTranslate]
    )

    return (
        <Container>
            <Header>
                <Logo src={iconImg} alt="mewCat" />
                <HeaderTitle>快捷翻译</HeaderTitle>
                <HeaderBadge>mewCat</HeaderBadge>
            </Header>

            <TranslatePane>
                <LanguageRow>
                    <LangBox>
                        <NativeSelect
                            value={sourceLang}
                            onChange={setSourceLang}
                            options={sourceOptions}
                            placeholder="源语言"
                            size="sm"
                        />
                    </LangBox>
                    <SwapButton
                        onClick={handleSwapLang}
                        title="交换语言"
                        disabled={sourceLang === "auto"}
                    >
                        <SwapIcon />
                    </SwapButton>
                    <LangBox>
                        <NativeSelect
                            value={targetLang}
                            onChange={setTargetLang}
                            options={targetOptions}
                            placeholder="目标语言"
                            size="sm"
                        />
                    </LangBox>
                </LanguageRow>

                <TextAreaWrapper>
                    <StyledTextarea
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            "输入或粘贴要翻译的文本…\nCtrl+Enter 快速翻译"
                        }
                        rows={5}
                    />
                    {inputText && (
                        <ClearButton
                            onClick={() => {
                                setInputText("")
                                setResult("")
                                setError("")
                            }}
                            title="清空"
                        >
                            <XIcon />
                        </ClearButton>
                    )}
                </TextAreaWrapper>

                <ActionRow>
                    <PasteButton onClick={handlePaste}>
                        <ClipboardIcon />
                        粘贴
                    </PasteButton>
                    <TranslateButton
                        onClick={handleTranslate}
                        $loading={loading}
                        disabled={loading || !inputText.trim()}
                    >
                        {loading ? (
                            <LoadingDots
                                loading
                                color="var(--text-inverse)"
                                size={4}
                            />
                        ) : (
                            <PlayIcon />
                        )}
                        {loading ? "翻译中…" : "翻译"}
                    </TranslateButton>
                </ActionRow>

                <Divider />

                <ResultBox>
                    {loading ? (
                        <LoadingBox>
                            <LoadingDots
                                loading
                                color="var(--primary-color)"
                                size={4}
                            />
                            翻译中…
                        </LoadingBox>
                    ) : (
                        <ResultText $empty={!result && !error} $error={!!error}>
                            {error || result || "翻译结果将显示在这里"}
                        </ResultText>
                    )}
                    {result && !loading && (
                        <ResultActions>
                            <IconButton $success={copied} onClick={handleCopy}>
                                {copied ? (
                                    <>
                                        <CheckStrokeIcon />
                                        已复制
                                    </>
                                ) : (
                                    <>
                                        <CopyStrokeIcon />
                                        复制
                                    </>
                                )}
                            </IconButton>
                        </ResultActions>
                    )}
                </ResultBox>
            </TranslatePane>
        </Container>
    )
}

export default SlidePanel
