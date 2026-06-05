import type { StorageAreaName } from "@plasmohq/storage"

import { storage } from "./constants"

// Chrome Storage 适配器 for Jotai
export const chromeStorageAdapter = {
    async getItem<T>(key: string, initialValue: T): Promise<T> {
        const value = await storage.get(key)
        if (value === undefined) {
            return initialValue
        }
        if (typeof value === "object" && Object.keys(value).length === 0) {
            return initialValue
        }
        if (value === "") {
            return initialValue
        }
        return value as T
    },
    async setItem<T>(key: string, value: T): Promise<void> {
        await storage.set(key, value)
    },
    removeItem: async (key: string): Promise<void> => {
        await storage.remove(key)
    },
    subscribe<T>(key: string, callback: (value: T) => void, initialValue: T) {
        // 创建一个监听特定 key 变化的 handler
        // 回调签名：(change: chrome.storage.StorageChange, area: StorageAreaName) => void
        const storageMap = {
            [key]: (
                change: chrome.storage.StorageChange,
                area: StorageAreaName
            ) => {
                // 只监听 local storage 的变化
                if (area === "local") {
                    const { newValue = initialValue } = change
                    callback(newValue as T)
                }
            }
        }

        // 监听 storage 变化
        storage.watch(storageMap)

        // 返回一个取消订阅的函数
        return () => {
            storage.unwatch(storageMap)
        }
    }
}
