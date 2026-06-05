/**
 * 图片翻译缓存管理器
 *
 * 功能：
 * 1. 基于图片内容哈希 + 语言对的缓存
 * 2. 防抖机制，避免重复请求
 * 3. 自动清理过期和最旧的缓存
 * 4. 存储空间管理
 */

// --- Types ---

interface CacheEntry {
    translatedImageUrl: string
    timestamp: number
    size: number // 用于存储管理
}

interface CacheMetadata {
    totalSize: number
    entries: Record<string, { timestamp: number; size: number }>
}

// --- Constants ---

const CACHE_PREFIX = "img_cache_"
const CACHE_METADATA_KEY = "img_cache_metadata"
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 1 天
const MAX_STORAGE_USAGE_RATIO = 0.8 // 80% 存储空间上限
const STORAGE_QUOTA_BYTES = 10 * 1024 * 1024 // chrome.storage.local 默认约 10MB

// --- In-Memory Debounce Map ---

const pendingRequests = new Map<string, Promise<string>>()

// --- Helper Functions ---

/**
 * 计算 Blob 的 SHA-256 哈希
 */
async function computeBlobHash(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

/**
 * 生成缓存键
 */
function getCacheKey(
    imageHash: string,
    sourceLang: string,
    targetLang: string
): string {
    return `${CACHE_PREFIX}${imageHash}_${sourceLang}_${targetLang}`
}

/**
 * 获取缓存元数据
 */
async function getCacheMetadata(): Promise<CacheMetadata> {
    const result = await chrome.storage.local.get(CACHE_METADATA_KEY)
    return (
        result[CACHE_METADATA_KEY] || {
            totalSize: 0,
            entries: {}
        }
    )
}

/**
 * 更新缓存元数据
 */
async function updateCacheMetadata(metadata: CacheMetadata): Promise<void> {
    await chrome.storage.local.set({ [CACHE_METADATA_KEY]: metadata })
}

/**
 * 检查并清理过期缓存
 */
async function cleanExpiredCache(): Promise<void> {
    const metadata = await getCacheMetadata()
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [key, entry] of Object.entries(metadata.entries)) {
        if (now - entry.timestamp > CACHE_DURATION_MS) {
            expiredKeys.push(key)
        }
    }

    if (expiredKeys.length === 0) {
        return
    }

    console.log(`[PictureCache] 清理 ${expiredKeys.length} 个过期缓存`)

    // 删除过期的缓存条目
    await chrome.storage.local.remove(expiredKeys)

    // 更新元数据
    let freedSize = 0
    for (const key of expiredKeys) {
        freedSize += metadata.entries[key]?.size || 0
        delete metadata.entries[key]
    }
    metadata.totalSize -= freedSize

    await updateCacheMetadata(metadata)
}

/**
 * 清理最旧的缓存，直到存储空间低于阈值
 */
async function cleanOldestCache(): Promise<void> {
    const metadata = await getCacheMetadata()
    const threshold = STORAGE_QUOTA_BYTES * MAX_STORAGE_USAGE_RATIO

    if (metadata.totalSize <= threshold) {
        return
    }

    // 按时间戳排序，最旧的在前
    const sortedEntries = Object.entries(metadata.entries).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp
    )

    const keysToRemove: string[] = []
    let freedSize = 0

    for (const [key, entry] of sortedEntries) {
        if (metadata.totalSize - freedSize <= threshold) {
            break
        }
        keysToRemove.push(key)
        freedSize += entry.size
    }

    if (keysToRemove.length === 0) {
        return
    }

    console.log(
        `[PictureCache] 清理 ${keysToRemove.length} 个最旧缓存，释放 ${(freedSize / 1024).toFixed(2)} KB`
    )

    // 删除缓存条目
    await chrome.storage.local.remove(keysToRemove)

    // 更新元数据
    for (const key of keysToRemove) {
        delete metadata.entries[key]
    }
    metadata.totalSize -= freedSize

    await updateCacheMetadata(metadata)
}

// --- Public API ---

/**
 * 从缓存获取翻译结果
 */
export async function getCachedTranslation(
    imageBlob: Blob,
    sourceLang: string,
    targetLang: string
): Promise<string | null> {
    try {
        const imageHash = await computeBlobHash(imageBlob)
        const cacheKey = getCacheKey(imageHash, sourceLang, targetLang)

        const result = await chrome.storage.local.get(cacheKey)
        const entry: CacheEntry | undefined = result[cacheKey]

        if (!entry) {
            return null
        }

        // 检查是否过期
        const now = Date.now()
        if (now - entry.timestamp > CACHE_DURATION_MS) {
            console.log("[PictureCache] 缓存已过期，删除")
            await chrome.storage.local.remove(cacheKey)

            // 更新元数据
            const metadata = await getCacheMetadata()
            if (metadata.entries[cacheKey]) {
                metadata.totalSize -= metadata.entries[cacheKey].size
                delete metadata.entries[cacheKey]
                await updateCacheMetadata(metadata)
            }

            return null
        }

        console.log("[PictureCache] 缓存命中", {
            cacheKey: cacheKey.slice(0, 50),
            age: Math.round((now - entry.timestamp) / 1000 / 60) + " 分钟"
        })

        return entry.translatedImageUrl
    } catch (error) {
        console.error("[PictureCache] 获取缓存失败:", error)
        return null
    }
}

/**
 * 保存翻译结果到缓存
 */
export async function setCachedTranslation(
    imageBlob: Blob,
    sourceLang: string,
    targetLang: string,
    translatedImageUrl: string
): Promise<void> {
    try {
        const imageHash = await computeBlobHash(imageBlob)
        const cacheKey = getCacheKey(imageHash, sourceLang, targetLang)

        // 估算缓存条目大小（URL + 元数据）
        const entrySize = new Blob([translatedImageUrl]).size + 100

        const entry: CacheEntry = {
            translatedImageUrl,
            timestamp: Date.now(),
            size: entrySize
        }

        // 先清理过期缓存
        await cleanExpiredCache()

        // 检查存储空间，必要时清理最旧的缓存
        await cleanOldestCache()

        // 保存缓存
        await chrome.storage.local.set({ [cacheKey]: entry })

        // 更新元数据
        const metadata = await getCacheMetadata()
        if (metadata.entries[cacheKey]) {
            // 更新已有条目
            metadata.totalSize -= metadata.entries[cacheKey].size
        }
        metadata.entries[cacheKey] = {
            timestamp: entry.timestamp,
            size: entry.size
        }
        metadata.totalSize += entry.size

        await updateCacheMetadata(metadata)

        console.log("[PictureCache] 缓存已保存", {
            cacheKey: cacheKey.slice(0, 50),
            size: (entrySize / 1024).toFixed(2) + " KB",
            totalSize: (metadata.totalSize / 1024).toFixed(2) + " KB"
        })
    } catch (error) {
        console.error("[PictureCache] 保存缓存失败:", error)
    }
}

/**
 * 防抖包装器：确保相同的请求只执行一次
 */
export async function withDebounce<T>(
    key: string,
    fn: () => Promise<T>
): Promise<T> {
    // 检查是否有正在进行的请求
    const pending = pendingRequests.get(key)
    if (pending) {
        console.log("[PictureCache] 防抖：复用正在进行的请求", {
            key: key.slice(0, 50)
        })
        return pending as Promise<T>
    }

    // 创建新请求
    const promise = fn().finally(() => {
        // 请求完成后，从 Map 中移除
        pendingRequests.delete(key)
    })

    pendingRequests.set(key, promise as Promise<string>)
    return promise
}

/**
 * 生成防抖键
 */
export async function getDebounceKey(
    imageBlob: Blob,
    sourceLang: string,
    targetLang: string
): Promise<string> {
    const imageHash = await computeBlobHash(imageBlob)
    return getCacheKey(imageHash, sourceLang, targetLang)
}

/**
 * 清理所有缓存（用于测试或重置）
 */
export async function clearAllCache(): Promise<void> {
    const metadata = await getCacheMetadata()
    const allKeys = Object.keys(metadata.entries)

    if (allKeys.length > 0) {
        await chrome.storage.local.remove(allKeys)
    }

    await chrome.storage.local.remove(CACHE_METADATA_KEY)
    console.log(`[PictureCache] 已清理所有缓存 (${allKeys.length} 个条目)`)
}
