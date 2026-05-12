import type {
    FreeRemainingQuota,
    SubscriptionRemainingQuota,
    User
} from "@/types"

import type { Response } from "./request"
import { mewCatRequest } from "./request"
import type { AiModuleRequest, AiModuleResponse } from "./types"

export async function getUserInfo() {
    const res = await mewCatRequest.get<unknown, Response<User>>("/user/profile")
    return res.data
}

export async function getSubscriptionRemainingQuota() {
    const res = await mewCatRequest.get<
        unknown,
        Response<SubscriptionRemainingQuota>
    >("/user/subscription")
    return res.data
}

export async function getFreeQuota(): Promise<FreeRemainingQuota> {
    const res = await mewCatRequest.get<
        unknown,
        Response<{
            free_parse_pages: string
            image_quota: string
            available_pages: string
        }>
    >("/user/quota")

    return {
        parse_pages: res?.data?.free_parse_pages || "0",
        image_quota: res?.data?.image_quota || "0",
        available_pages: res?.data?.available_pages || "0"
    }
}

/**
 * 获取模型选项
 * @returns 模型选项列表
 */
export async function getCompletionModelOptions() {
    const res = await mewCatRequest.get<
        AiModuleRequest,
        Response<AiModuleResponse[]>
    >("/user/completion/model")
    return res.data
}
