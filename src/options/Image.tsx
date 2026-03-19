import { useAtom, useSetAtom } from "jotai"
import * as React from "react"

import { FormRow, NativeSelect, OptionsSection, Switch } from "@/components"
import { configAtom, updateConfigAtom } from "@/state"

export const Image: React.FunctionComponent = () => {
    const [config] = useAtom(configAtom)
    const updateConfig = useSetAtom(updateConfigAtom)

    return (
        <>
            <OptionsSection title="图片翻译">
                <FormRow
                    label="图片上显示快捷翻译按钮"
                    description="鼠标悬浮在图片上时显示翻译按钮，点击可翻译图片"
                >
                    <Switch
                        checked={config.enableImageTranslateButton || false}
                        onChange={checked =>
                            updateConfig({ enableImageTranslateButton: checked })
                        }
                    />
                </FormRow>

                <FormRow
                    label="图片翻译服务商"
                    description="当前使用系统默认翻译服务"
                >
                    <NativeSelect
                        value={config.imageTranslateProvider || "系统"}
                        onChange={() => {}}
                        disabled
                        options={[
                            { value: "系统", label: "系统" }
                        ]}
                    />
                </FormRow>
            </OptionsSection>
        </>
    )
}
