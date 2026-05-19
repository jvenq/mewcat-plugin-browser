import { useAtom, useSetAtom } from "jotai"
import * as React from "react"

import { CustomSelect, FormRow, OptionsSection, ToggleRow } from "@/components"
import {
    DISABLED_SITES_OPTIONS,
    INTERACTION_MODE_OPTIONS,
    TRIGGER_MODE_OPTIONS
} from "@/constants"
import { configAtom, updateConfigAtom } from "@/state"

export const Selection: React.FunctionComponent = () => {
    const [config] = useAtom(configAtom)
    const updateConfig = useSetAtom(updateConfigAtom)

    return (
        <>
            <OptionsSection title="划词翻译设置">
                <ToggleRow
                    title="启用划词翻译"
                    description="选中文本时显示翻译选项"
                    checked={config.isSelectedTranslate || false}
                    onChange={checked =>
                        updateConfig({ isSelectedTranslate: checked })
                    }
                />

                <FormRow label="触发方式" description="选择划词翻译的触发方式">
                    <CustomSelect
                        value={config.selectionTriggerMode || "direct"}
                        onChange={value =>
                            updateConfig({
                                selectionTriggerMode: value as
                                    | "direct"
                                    | "dot"
                                    | "shift"
                                    | "ctrl"
                            })
                        }
                        options={TRIGGER_MODE_OPTIONS}
                        placeholder="选择触发方式"
                    />
                </FormRow>

                <FormRow label="交互方式" description="选择如何激活翻译面板">
                    <CustomSelect
                        value={config.selectionInteractionMode || "click"}
                        onChange={value =>
                            updateConfig({
                                selectionInteractionMode: value as
                                    | "click"
                                    | "hover"
                            })
                        }
                        options={INTERACTION_MODE_OPTIONS}
                        placeholder="选择交互方式"
                    />
                </FormRow>

                <FormRow
                    label="禁用网站"
                    description="在这些网站上不启用划词翻译"
                >
                    <CustomSelect
                        value={config.selectionDisabledSites || []}
                        onChange={value =>
                            updateConfig({
                                selectionDisabledSites: value as string[]
                            })
                        }
                        options={DISABLED_SITES_OPTIONS}
                        placeholder="选择禁用划词翻译的网站"
                        multiple
                    />
                </FormRow>
            </OptionsSection>
        </>
    )
}
