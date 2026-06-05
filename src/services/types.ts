import type { CommonMessage, ModelOption } from "@/types"

export interface AiModuleRequest {
    /**
     * @generated from field: repeated schema.CommonMessage messages = 1;
     */
    messages: CommonMessage[]

    /**
     * @generated from field: chat.v1.CompletionRequest.ModelOption model_option = 2;
     */
    modelOption?: ModelOption

    /**
     * @generated from field: float temperature = 3;
     */
    temperature: number
}

export interface AiModuleResponse {
    /**
     * @generated from field: repeated schema.CommonMessage messages = 1;
     */
    messages: CommonMessage[]
}

export interface RequestModelParams {
    model: string | number
    modelName: string
    apiKey: string
    endpoint: string
    baseUrl: string
    temperature?: number
    httpType: "rpc" | "http"
    contents?: { role: string; parts: { text: string }[] }[]
}
