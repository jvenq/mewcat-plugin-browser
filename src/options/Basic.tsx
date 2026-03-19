import { useAtom, useSetAtom } from "jotai"
import * as React from "react"

import {
    CustomSelect,
    FormRow,
    NumberInput,
    OptionsSection,
    StylePreview,
    UrlManager
} from "@/components"
import {
    DEFAULT_VALUES,
    languages,
    TRANSLATION_STYLE_OPTIONS
} from "@/constants"
import { configAtom, updateConfigAtom } from "@/state"
import type { TranslationStyleType } from "@/types/translationStyle"

export const Basic: React.FunctionComponent = () => {
    const [config] = useAtom(configAtom)
    const updateConfig = useSetAtom(updateConfigAtom)

    const languageOptions = languages.languages

    return (
        <>
            <OptionsSection title="翻译语言配置" layout="grid">
                <FormRow
                    label="总是翻译"
                    description="检测到这些语言时将自动翻译"
                >
                    <CustomSelect
                        value={config.alwaysTranslateLanguages || []}
                        onChange={value =>
                            updateConfig({
                                alwaysTranslateLanguages: value as string[]
                            })
                        }
                        options={languageOptions}
                        placeholder="选择语言"
                        multiple
                    />
                </FormRow>
                <FormRow
                    label="永不翻译"
                    description="选中的语言将不会被自动翻译"
                >
                    <CustomSelect
                        value={config.neverTranslateLanguages || []}
                        onChange={value =>
                            updateConfig({
                                neverTranslateLanguages: value as string[]
                            })
                        }
                        options={languageOptions}
                        placeholder="选择语言"
                        withinPortal
                        multiple
                    />
                </FormRow>
            </OptionsSection>

            <OptionsSection title="翻译网址配置" layout="grid">
                <FormRow
                    label="总是翻译"
                    description="在这些网址上将自动启用翻译"
                >
                    <UrlManager
                        urls={config.alwaysTranslateUrls || []}
                        onUrlsChange={urls => {
                            updateConfig({ alwaysTranslateUrls: urls })
                        }}
                        placeholder="输入网址，如：example.com"
                        emptyText="暂无配置"
                    />
                </FormRow>
                <FormRow
                    label="永不翻译"
                    description="在这些网址上将永不启用翻译"
                >
                    <UrlManager
                        urls={config.neverTranslateUrls || []}
                        onUrlsChange={urls =>
                            updateConfig({ neverTranslateUrls: urls })
                        }
                        placeholder="输入网址，如：example.com"
                        emptyText="暂无配置"
                    />
                </FormRow>
            </OptionsSection>

            <OptionsSection title="显示设置" layout="grid">
                <FormRow
                    label="译文显示样式"
                    description="选择翻译文本的显示样式"
                >
                    <CustomSelect
                        value={config.translationStyle || "highlight"}
                        onChange={value =>
                            updateConfig({
                                translationStyle: value as TranslationStyleType
                            })
                        }
                        options={TRANSLATION_STYLE_OPTIONS}
                        placeholder="选择译文样式"
                    />
                    <StylePreview
                        style={config.translationStyle || "highlight"}
                    />
                </FormRow>

                <FormRow
                    label="自动翻译延迟"
                    description="网页自动翻译时等待网页加载多少毫秒"
                >
                    <NumberInput
                        value={
                            config.autoTranslateDelay ||
                            DEFAULT_VALUES.autoTranslateDelay
                        }
                        onChange={value =>
                            updateConfig({ autoTranslateDelay: value })
                        }
                        placeholder={String(DEFAULT_VALUES.autoTranslateDelay)}
                        min={100}
                        max={3000}
                    />
                </FormRow>
            </OptionsSection>
        </>
    )
}
