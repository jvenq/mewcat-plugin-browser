import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { mewCatRequest } from "@/services/request"
import {
    getFreeQuota,
    getSubscriptionRemainingQuota,
    getUserInfo
} from "@/services/user"

import type { User } from "../types"
import { chromeStorageAdapter } from "./util"

// 默认用户数据
const defaultUser: User = {
    username: "",
    avatar: "",
    wechat_bound: "",
    register_time: "",
    phone: "",
    invite_code: ""
}

// 用户原子
export const userAtom = atom<User>(defaultUser)

export const accessTokenAtom = atomWithStorage<string>(
    "accessToken",
    null,
    chromeStorageAdapter,
    {
        getOnInit: true
    }
)

export const refreshTokenAtom = atomWithStorage<string>(
    "refreshToken",
    null,
    chromeStorageAdapter,
    {
        getOnInit: true
    }
)

// 设置用户数据的写入原子
export const setUserAtom = atom(null, (get, set, userData: Partial<User>) => {
    const currentUser = get(userAtom)
    set(userAtom, { ...currentUser, ...userData })
})

// 重置用户数据的写入原子
export const resetUserAtom = atom(null, (_get, set) => {
    set(userAtom, defaultUser)
})

export const fetchUserAtom = atom(null, async (get, set) => {
    const [user, subscriptionRemainingQuota, freeRemainQuota] =
        await Promise.allSettled([
            getUserInfo(),
            getSubscriptionRemainingQuota(),
            getFreeQuota()
        ])
    if (user.status === "fulfilled") {
        const newUser = user.value
        if (subscriptionRemainingQuota.status === "fulfilled") {
            newUser.subscriptRemainQuota = subscriptionRemainingQuota.value
        }
        if (freeRemainQuota.status === "fulfilled") {
            newUser.freeRemainQuota = freeRemainQuota.value
        }
        set(userAtom, newUser)
    }
    return user
})

export const setAccessTokenAtom = atom(
    null,
    (get, set, accessToken: string) => {
        mewCatRequest.defaults.headers.Authorization = `Bearer ${accessToken}`
        set(accessTokenAtom, accessToken)
    }
)
