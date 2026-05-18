import {
    DndContext,
    MouseSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useAtom, useSetAtom } from "jotai"
import { nanoid } from "nanoid"
import { move } from "ramda"
import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"

import {
    ApiKeyInput,
    Button,
    CustomSelect,
    FormRow,
    ModelTestPanel,
    NumberInput,
    OptionsSection,
    Switch
} from "@/components"
import { AddModel } from "@/components/AddModel"
import { DEFAULT_VALUES, platformNameMap } from "@/constants"
import { AiRoleOptions, AiRoleSystemPrompts } from "@/constants/aiRole"
import { aiModelListMap } from "@/constants/model"
import { configAtom, updateAiModelConfigAtom, updateConfigAtom } from "@/state"
import { storage } from "@/state/constants"
import { hideScrollBar } from "@/styles/scroll"
import { ApiKeyValidator } from "@/translation/ApiKeyValidator"
import type { AiModel_Platform_Enum } from "@/types"
import { AiRole, type BaseModel, type LLMModel } from "@/types"
import {
    getLLMModelName,
    getModelByModelList,
    isModelThinkingCapable
} from "@/utils/llmModel"
import { Toast, ToastType } from "@/utils/toast"

import { AI_MODEL_UI_LIST } from "./constants"

const ModelListContainer = styled.div`
    display: flex;
    gap: var(--space-6);
    min-height: 400px;
    max-height: 600px;
`

const ModelList = styled.div`
    width: 280px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    max-height: 100%;
    overflow: auto;
    border-radius: var(--radius-md);
    ${hideScrollBar}
`

const ModelConfigContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-height: 100%;
    overflow: auto;
    ${hideScrollBar}
`

const ModelHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-3);
    gap: var(--space-4);
`

const ModelHeaderContent = styled.div`
    flex: 1;
    min-width: 0;
`

const ModelHeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
    padding-top: 2px;
`

const ModelTitle = styled.h3`
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
`

const ModelDescription = styled.p`
    margin: var(--space-2) 0 0 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
`

const ConfigForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
`

const ModelItem = styled.div<{ $selected: boolean }>`
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: ${props =>
        props.$selected ? "var(--primary-light)" : "transparent"};
    color: ${props =>
        props.$selected ? "var(--primary-color)" : "var(--text-primary)"};
    transition: all var(--transition-fast);
    border: 1px solid
        ${props => (props.$selected ? "var(--primary-color)" : "transparent")};

    &:hover {
        background: ${props =>
            props.$selected ? "var(--primary-light)" : "var(--gray-100)"};
        border-color: ${props =>
            props.$selected ? "var(--primary-color)" : "var(--gray-300)"};
    }
`

const ModelItemContent = styled.div`
    flex: 1;
    min-width: 0;
`

const ModelItemTitle = styled.div`
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: var(--space-2);
`

const ModelItemSubtitle = styled.div`
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const ModelItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
`

const StatusDot = styled.div<{ $enabled: boolean }>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props =>
        props.$enabled ? "var(--success)" : "var(--gray-400)"};
    flex-shrink: 0;
`

const RoleHelperText = styled.div`
    margin-top: var(--space-2);
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
    line-height: var(--line-height-normal);
`

const LoadingSpinner = styled.div`
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.6s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`

const TestSection = styled.div`
    margin-bottom: var(--space-5);
    padding: var(--space-4);
    background: var(--gray-50);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
`

const TestHeader = styled.div`
    margin-bottom: var(--space-3);
`

const TestTitle = styled.h4`
    margin: 0 0 var(--space-1) 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
`

const TestDescription = styled.p`
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
`

function LeftPanelItem({
    model,
    isEnabled,
    isSelected,
    isDragging,
    onClick,
    onToggleEnabled,
    id
}: {
    id: string
    model: BaseModel
    isEnabled: boolean
    isSelected: boolean
    isDragging: boolean
    onClick: React.MouseEventHandler<HTMLDivElement>
    onToggleEnabled: (enabled: boolean) => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: isDragging ? "0 0 0 4px var(--primary-color)" : undefined
    }

    const handleSwitchClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <ModelItem
            key={model.type}
            {...attributes}
            {...listeners}
            onClick={onClick}
            ref={setNodeRef}
            $selected={isSelected}
            style={style}
        >
            <StatusDot $enabled={isEnabled} />
            <ModelItemContent>
                <ModelItemTitle>{model.name}</ModelItemTitle>
                <ModelItemSubtitle>
                    {model.params.modelVersion
                        ? getLLMModelName(model.params.modelVersion)
                        : "未绑定模型"}
                </ModelItemSubtitle>
            </ModelItemContent>
            <ModelItemActions onClick={handleSwitchClick}>
                <Switch
                    checked={isEnabled}
                    onChange={onToggleEnabled}
                    size="sm"
                />
            </ModelItemActions>
        </ModelItem>
    )
}

export const TranslateServices: React.FunctionComponent = () => {
    const [config] = useAtom(configAtom)
    const updateConfig = useSetAtom(updateConfigAtom)
    const updateAiModelConfig = useSetAtom(updateAiModelConfigAtom)
    const [dragId, setDragId] = useState<string | null>(null)
    const [activeId, setActiveId] = useState<string>(config?.aiModelList[0]?.id)

    // 单个模型测试状态
    const [testStatus, setTestStatus] = useState<{
        [key: string]: "idle" | "loading" | "success" | "error"
    }>({})
    const [testTimers, setTestTimers] = useState<{
        [key: string]: NodeJS.Timeout
    }>({})
    const [testCountdown, setTestCountdown] = useState<{
        [key: string]: number
    }>({})

    // 使用 ref 来跟踪上一个 activeId
    const prevActiveIdRef = useRef<string | undefined>(activeId)

    const currentModelData: BaseModel | undefined = config?.aiModelList?.find?.(
        m => m.id === activeId
    )
    const currentModelConfig = AI_MODEL_UI_LIST.find?.(
        m => m.type === currentModelData?.type
    )
    const modelOptions = useMemo(() => {
        if (!activeId) {
            return []
        }
        return (
            aiModelListMap.get(currentModelData?.type)?.map?.(model => ({
                value: model,
                label: getLLMModelName(model) || "意外数据"
            })) || []
        )
    }, [activeId, currentModelData?.type])

    const handleTestModel = useCallback(() => {
        const apiKey = currentModelData.params?.apiKey || ""
        const testParams = {
            apiKey,
            type: currentModelData.type,
            baseUrl: currentModelData.params?.baseUrl || "",
            model:
                getLLMModelName(currentModelData?.params?.modelVersion) || "",
            endpoint: currentModelData.params?.endpoint
        }
        const validatorMethod =
            ApiKeyValidator[currentModelConfig.testValidator]
        if (typeof validatorMethod !== "function") {
            throw new Error(`未找到${currentModelData.name}的API Key验证方法`)
        }
        return testParams.apiKey
            ? validatorMethod(testParams)
            : Promise.reject(new Error("请先填写完整的配置信息"))
    }, [currentModelConfig?.testValidator, currentModelData])

    // 测试单个模型
    const handleTestSingleModel = useCallback(
        async (modelId: string) => {
            const model = getModelByModelList(
                config?.aiModelList || [],
                modelId
            )
            if (!model) {
                return
            }

            // 清除之前的定时器
            if (testTimers[modelId]) {
                clearTimeout(testTimers[modelId])
            }

            setTestStatus(prev => {
                return { ...prev, [modelId]: "loading" }
            })
            setTestCountdown(prev => ({ ...prev, [modelId]: 0 }))

            const startTime = Date.now()

            try {
                // 动态导入 UniversalTranslator 和 AiRole
                const { UniversalTranslator } = await import(
                    "@/translation/UniversalTranslator"
                )
                const { AiRole } = await import("@/types")
                const accessToken = await storage.get<string>("accessToken")
                // 创建 UniversalTranslator 实例
                const translator = new UniversalTranslator(model.type, {
                    apiKey: model.params.apiKey,
                    baseUrl: model.params.baseUrl,
                    model: getLLMModelName(model.params.modelVersion),
                    aiRole: AiRole.DEFAULT,
                    endpoint: model.params.endpoint
                })

                // 使用 translateText 进行测试
                const testMessage = [
                    {
                        role: "user" as const,
                        content: "Hello, world!"
                    }
                ]

                const translatedText = await translator.translateBatch(
                    testMessage,
                    config.targetLanguage
                )

                // 计算耗时
                const duration = Date.now() - startTime

                // 验证翻译结果
                const success =
                    translatedText &&
                    translatedText.trim().length > 0 &&
                    translatedText.toLowerCase() !== "hello, world!"

                setTestStatus(prev => ({
                    ...prev,
                    [modelId]: success ? "success" : "error"
                }))

                // 显示测试结果 toast
                Toast.show({
                    type: success ? ToastType.SUCCESS : ToastType.ERROR,
                    message: success
                        ? `${model.name} 测试成功 (${duration}ms)`
                        : `${model.name} 测试失败: 翻译结果无效`,
                    duration: 3000
                })

                // 开始倒计时
                setTestCountdown(prev => ({ ...prev, [modelId]: 5 }))

                // 每秒更新倒计时
                let countdown = 5
                const countdownInterval = setInterval(() => {
                    countdown -= 1
                    if (countdown > 0) {
                        setTestCountdown(prev => ({
                            ...prev,
                            [modelId]: countdown
                        }))
                    } else {
                        clearInterval(countdownInterval)
                    }
                }, 1000)

                // 5秒后恢复为idle状态
                const timer = setTimeout(() => {
                    setTestStatus(prev => ({ ...prev, [modelId]: "idle" }))
                    setTestCountdown(prev => {
                        const newCountdown = { ...prev }
                        delete newCountdown[modelId]
                        return newCountdown
                    })
                    setTestTimers(prev => {
                        const newTimers = { ...prev }
                        delete newTimers[modelId]
                        return newTimers
                    })
                }, 5000)

                setTestTimers(prev => ({ ...prev, [modelId]: timer }))
            } catch (error) {
                const duration = Date.now() - startTime
                setTestStatus(prev => ({ ...prev, [modelId]: "error" }))

                // 显示测试失败 toast
                Toast.show({
                    type: ToastType.ERROR,
                    message: `${model.name} 测试失败 (${duration}ms): ${error instanceof Error ? error.message : "未知错误"}`,
                    duration: 3000
                })

                // 开始倒计时
                setTestCountdown(prev => ({ ...prev, [modelId]: 5 }))

                // 每秒更新倒计时
                let countdown = 5
                const countdownInterval = setInterval(() => {
                    countdown -= 1
                    if (countdown > 0) {
                        setTestCountdown(prev => ({
                            ...prev,
                            [modelId]: countdown
                        }))
                    } else {
                        clearInterval(countdownInterval)
                    }
                }, 1000)

                // 5秒后恢复为idle状态
                const timer = setTimeout(() => {
                    setTestStatus(prev => ({ ...prev, [modelId]: "idle" }))
                    setTestCountdown(prev => {
                        const newCountdown = { ...prev }
                        delete newCountdown[modelId]
                        return newCountdown
                    })
                    setTestTimers(prev => {
                        const newTimers = { ...prev }
                        delete newTimers[modelId]
                        return newTimers
                    })
                }, 5000)

                setTestTimers(prev => ({ ...prev, [modelId]: timer }))
            }
        },
        [config?.aiModelList, config?.targetLanguage, testTimers]
    )

    // 清理定时器
    useEffect(() => {
        return () => {
            Object.values(testTimers).forEach(timer => clearTimeout(timer))
        }
    }, [testTimers])

    // 切换模型时清空测试状态
    useEffect(() => {
        const prevActiveId = prevActiveIdRef.current

        // 如果 activeId 发生变化，清空之前模型的测试状态
        if (prevActiveId && prevActiveId !== activeId) {
            // 清除之前模型的测试状态
            setTestStatus(prev => {
                const newStatus = { ...prev }
                delete newStatus[prevActiveId]
                return newStatus
            })
            setTestCountdown(prev => {
                const newCountdown = { ...prev }
                delete newCountdown[prevActiveId]
                return newCountdown
            })
            // 清除定时器
            if (testTimers[prevActiveId]) {
                clearTimeout(testTimers[prevActiveId])
                setTestTimers(prev => {
                    const newTimers = { ...prev }
                    delete newTimers[prevActiveId]
                    return newTimers
                })
            }
        }

        // 更新 ref
        prevActiveIdRef.current = activeId
    }, [activeId, testTimers])

    // 获取按钮文本
    const getTestButtonText = useCallback(
        (modelId: string) => {
            const status = testStatus[modelId] || "idle"
            const countdown = testCountdown[modelId]

            switch (status) {
                case "loading":
                    return (
                        <>
                            <LoadingSpinner />
                            <span style={{ marginLeft: "8px" }}>测试</span>
                        </>
                    )
                case "success":
                    return countdown ? `测试成功 (${countdown}s)` : "测试成功"
                case "error":
                    return countdown ? `测试失败 (${countdown}s)` : "测试失败"
                default:
                    return "测试"
            }
        },
        [testStatus, testCountdown]
    )

    const onDragStart = useCallback(
        (e: DragStartEvent) => {
            setDragId(e.active.id.toString())
        },
        [setDragId]
    )

    const onDragEnd = useCallback(
        ({ active, over }: DragEndEvent) => {
            setDragId(null)
            if (active.id === over?.id) {
                return
            }
            const newModelList = [...(config?.aiModelList || [])]
            const activeIndex = newModelList.findIndex(
                model => model.id === active.id
            )
            const overIndex = newModelList.findIndex(
                model => model.id === over?.id
            )
            if (activeIndex !== -1 && overIndex !== -1) {
                updateConfig({
                    aiModelList: move(activeIndex, overIndex, newModelList)
                })
            }
        },
        [config?.aiModelList, updateConfig]
    )

    const onRemoveModel = useCallback(
        (id: string) => {
            updateConfig({
                aiModelList:
                    config?.aiModelList?.filter?.(model => model.id !== id) ||
                    []
            })
        },
        [config?.aiModelList, updateConfig]
    )

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
    )

    const handleAddModel = useCallback(
        (platform: AiModel_Platform_Enum) => {
            updateConfig({
                aiModelList: [
                    ...(config?.aiModelList || []),
                    {
                        id: nanoid(),
                        type: platform,
                        enabled: true,
                        name: platformNameMap[platform],
                        params: {
                            modelName: "",
                            modelVersion: null,
                            apiKey: "",
                            baseUrl: "",
                            endpoint: ""
                        }
                    }
                ]
            })
        },
        [config?.aiModelList, updateConfig]
    )

    // 当前模型选项（只显示已启用的模型）
    const currentModelOptions = useMemo(
        () =>
            config?.aiModelList
                ?.filter(model => model.enabled)
                ?.map(model => ({
                    value: model.id,
                    label: model.name || "未命名模型"
                })) || [],
        [config?.aiModelList]
    )

    // 处理当前模型切换
    const handleCurrentModelChange = useCallback(
        (value: string) => {
            const selectedModel = config?.aiModelList?.find(
                model => model.id === value
            )

            // 如果切换到不支持思考的模型，自动禁用思考能力
            if (selectedModel && !isModelThinkingCapable(selectedModel)) {
                updateConfig({
                    currentModel: value,
                    enableThinking: false
                })
            } else {
                updateConfig({ currentModel: value })
            }
        },
        [config?.aiModelList, updateConfig]
    )

    // 监听模型删除，如果当前选中的模型被删除，自动切换到第一个可用模型
    useEffect(() => {
        const currentModel = config?.currentModel
        const modelExists = config?.aiModelList?.some(
            model => model.id === currentModel && model.enabled
        )

        if (!modelExists && config?.aiModelList?.length > 0) {
            // 找到第一个启用的模型
            const firstEnabledModel = config.aiModelList.find(
                model => model.enabled
            )
            if (firstEnabledModel) {
                // 如果新模型不支持思考，自动禁用思考能力
                if (!isModelThinkingCapable(firstEnabledModel)) {
                    updateConfig({
                        currentModel: firstEnabledModel.id,
                        enableThinking: false
                    })
                } else {
                    updateConfig({ currentModel: firstEnabledModel.id })
                }
            }
        }
    }, [config?.aiModelList, config?.currentModel, updateConfig])

    useEffect(() => {
        if (!activeId && config?.aiModelList?.length) {
            setActiveId(config.aiModelList[0].id)
        }
    }, [activeId, config?.aiModelList])

    // 检查当前模型是否支持思考能力
    const currentModelSupportsThinking = useMemo(() => {
        const currentModel = config?.aiModelList?.find(
            model => model.id === activeId
        )
        return isModelThinkingCapable(currentModel)
    }, [activeId, config?.aiModelList])

    return (
        <>
            <OptionsSection title="模型">
                <FormRow
                    label="当前ai模型"
                    description="选择当前用于翻译的AI模型"
                >
                    <CustomSelect
                        value={String(config.currentModel)}
                        onChange={value =>
                            typeof value === "string" &&
                            handleCurrentModelChange(value)
                        }
                        options={currentModelOptions}
                        placeholder="选择模型"
                    />
                </FormRow>
            </OptionsSection>
            <OptionsSection
                title="AI模型"
                rightSection={<AddModel onItemClick={handleAddModel} />}
            >
                <ModelListContainer>
                    <DndContext
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        modifiers={[restrictToVerticalAxis]}
                        sensors={sensors}
                    >
                        <SortableContext
                            items={
                                config?.aiModelList.map(model => model.id) || []
                            }
                            strategy={verticalListSortingStrategy}
                        >
                            <ModelList>
                                {config?.aiModelList?.map(model => (
                                    <LeftPanelItem
                                        key={model.id}
                                        id={model.id}
                                        model={model}
                                        isDragging={
                                            dragId === model.id.toString()
                                        }
                                        isEnabled={model.enabled}
                                        isSelected={activeId === model.id}
                                        onClick={() => setActiveId(model.id)}
                                        onToggleEnabled={enabled =>
                                            updateAiModelConfig({
                                                id: model.id,
                                                enabled
                                            })
                                        }
                                    />
                                ))}
                            </ModelList>
                        </SortableContext>
                    </DndContext>
                    <ModelConfigContainer>
                        {currentModelData && (
                            <>
                                <ModelHeader>
                                    <ModelHeaderContent>
                                        <ModelTitle>
                                            {currentModelData.name}
                                        </ModelTitle>
                                        <ModelDescription>
                                            {currentModelConfig?.description}
                                        </ModelDescription>
                                    </ModelHeaderContent>
                                    <ModelHeaderActions>
                                        <Button
                                            type="primary"
                                            size="sm"
                                            onClick={() =>
                                                handleTestSingleModel(
                                                    currentModelData.id
                                                )
                                            }
                                            disabled={
                                                testStatus[
                                                    currentModelData.id
                                                ] === "loading" ||
                                                testStatus[
                                                    currentModelData.id
                                                ] === "success" ||
                                                testStatus[
                                                    currentModelData.id
                                                ] === "error"
                                            }
                                        >
                                            {getTestButtonText(
                                                currentModelData.id
                                            )}
                                        </Button>

                                        <Button
                                            type="secondary"
                                            size="sm"
                                            onClick={() =>
                                                onRemoveModel(
                                                    currentModelData.id
                                                )
                                            }
                                        >
                                            删除模型
                                        </Button>
                                    </ModelHeaderActions>
                                </ModelHeader>
                                <ConfigForm>
                                    {currentModelConfig?.items?.map(item => {
                                        const fieldConfig =
                                            currentModelConfig.fields[item]
                                        if (!fieldConfig) {
                                            return null
                                        }
                                        if (item === "modelVersion") {
                                            return (
                                                <FormRow
                                                    key={item}
                                                    label={fieldConfig.label}
                                                    required={
                                                        fieldConfig.required
                                                    }
                                                >
                                                    <CustomSelect
                                                        value={
                                                            currentModelData
                                                                ?.params?.[item]
                                                        }
                                                        onChange={value =>
                                                            typeof value ===
                                                                "number" &&
                                                            updateAiModelConfig(
                                                                {
                                                                    id: currentModelData.id,
                                                                    params: {
                                                                        modelVersion:
                                                                            value as LLMModel
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        withinPortal
                                                        options={modelOptions}
                                                        placeholder="选择翻译模型"
                                                    />
                                                </FormRow>
                                            )
                                        }
                                        return (
                                            <FormRow
                                                key={item}
                                                label={fieldConfig.label}
                                                required={fieldConfig.required}
                                            >
                                                <ApiKeyInput
                                                    label={fieldConfig.label}
                                                    value={
                                                        currentModelData
                                                            ?.params?.[item]
                                                            ? String(
                                                                  currentModelData
                                                                      ?.params?.[
                                                                      item
                                                                  ]
                                                              )
                                                            : ""
                                                    }
                                                    disabledVisitable={
                                                        item !== "apiKey"
                                                    }
                                                    onChange={value => {
                                                        updateAiModelConfig({
                                                            id: currentModelData.id,
                                                            params: {
                                                                [item]: value
                                                            }
                                                        })
                                                    }}
                                                    placeholder={
                                                        fieldConfig.placeholder
                                                    }
                                                    helperText={
                                                        fieldConfig.helperText
                                                    }
                                                    helperLink={
                                                        fieldConfig.helperLink
                                                    }
                                                    onTest={
                                                        item === "apiKey"
                                                            ? handleTestModel
                                                            : undefined
                                                    }
                                                />
                                            </FormRow>
                                        )
                                    })}
                                </ConfigForm>
                            </>
                        )}
                    </ModelConfigContainer>
                </ModelListContainer>
            </OptionsSection>

            <OptionsSection title="配置">
                <TestSection>
                    <TestHeader>
                        <TestTitle>模型测试</TestTitle>
                        <TestDescription>
                            测试所有可用模型的翻译能力
                        </TestDescription>
                    </TestHeader>
                    <ModelTestPanel
                        modelList={config.aiModelList}
                        testText="Hello, world!"
                        targetLang={config.targetLanguage}
                    />
                </TestSection>
                {currentModelSupportsThinking && (
                    <FormRow
                        label="启用思考能力"
                        description="为支持思考的模型（如 DeepSeek R1、QwQ、Thinking 系列）启用深度推理能力，可能会增加响应时间"
                    >
                        <Switch
                            checked={config.enableThinking || false}
                            onChange={checked =>
                                updateConfig({ enableThinking: checked })
                            }
                        />
                    </FormRow>
                )}
                <FormRow
                    label="每秒最大请求数"
                    description="限制AI模型的请求频率"
                >
                    <NumberInput
                        value={
                            config.maxRequestsPerSecond ||
                            DEFAULT_VALUES.maxRequestsPerSecond
                        }
                        onChange={value =>
                            updateConfig({ maxRequestsPerSecond: value })
                        }
                        placeholder={String(
                            DEFAULT_VALUES.maxRequestsPerSecond
                        )}
                        min={1}
                        max={100}
                    />
                </FormRow>
                <FormRow
                    label="每次请求最大文本长度"
                    description="单次请求的文本字符数限制"
                >
                    <NumberInput
                        value={
                            config.maxTextLengthPerRequest ||
                            DEFAULT_VALUES.maxTextLengthPerRequest
                        }
                        onChange={value =>
                            updateConfig({ maxTextLengthPerRequest: value })
                        }
                        placeholder={String(
                            DEFAULT_VALUES.maxTextLengthPerRequest
                        )}
                        min={100}
                        max={10000}
                    />
                </FormRow>
                <FormRow
                    label="AI专家角色"
                    description="选择AI翻译时的专家角色，不同角色会影响翻译风格"
                >
                    <CustomSelect
                        value={config.aiRole || AiRole.DEFAULT}
                        onChange={value =>
                            typeof value === "string" &&
                            updateConfig({ aiRole: value as AiRole })
                        }
                        options={AiRoleOptions}
                        placeholder="选择AI专家角色"
                    />
                    <RoleHelperText>
                        {
                            AiRoleSystemPrompts[
                                config.aiRole || AiRole.DEFAULT
                            ]?.split("\n")[0]
                        }
                    </RoleHelperText>
                </FormRow>
                <FormRow
                    label="启用AI智能上下文"
                    description="结合网页上下文提升翻译效果，需要配置 LLM 翻译服务商。注意：开启后会增加翻译时长"
                >
                    <Switch
                        checked={config.enableContext || false}
                        onChange={checked =>
                            updateConfig({ enableContext: checked })
                        }
                    />
                </FormRow>
            </OptionsSection>
        </>
    )
}

export default TranslateServices
