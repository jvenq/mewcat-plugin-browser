import { useAtom, useSetAtom } from "jotai"
import * as React from "react"

import { InfoDisplay, OptionsSection, ToggleRow } from "@/components"
import { EXTENSION_INFO } from "@/constants"
import { configAtom, updateConfigAtom } from "@/state"

export const About: React.FunctionComponent = () => {
    const [config] = useAtom(configAtom)
    const updateConfig = useSetAtom(updateConfigAtom)

    return (
        <>
            <OptionsSection title="扩展设置">
                {/* <ToggleRow
                    title="启用扩展"
                    description="开启或关闭翻译扩展功能"
                    checked={config.extensionEnabled !== false}
                    onChange={checked => updateConfig({ extensionEnabled: checked })}
                /> */}
                <ToggleRow
                    title="启用本地缓存"
                    description="缓存翻译结果以提高性能"
                    checked={config.cacheEnabled !== false}
                    onChange={checked =>
                        updateConfig({ cacheEnabled: checked })
                    }
                />
            </OptionsSection>

            <OptionsSection title="扩展信息">
                <InfoDisplay
                    label="版本号"
                    value={EXTENSION_INFO.version}
                    type="version"
                />
                <InfoDisplay
                    label="作者"
                    value={EXTENSION_INFO.author}
                    type="strong"
                />
                <InfoDisplay
                    label="描述"
                    value={EXTENSION_INFO.description}
                    type="text"
                />
            </OptionsSection>
        </>
    )
}
