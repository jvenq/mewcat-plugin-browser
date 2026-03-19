// 创建右键菜单项
chrome.runtime.onInstalled.addListener(() => {
    // 创建沉浸式翻译菜单项
    chrome.contextMenus.create({
        id: "immersive-translate",
        title: "开始翻译",
        contexts: ["page"]
    })
})

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) {return}

    try {
        await handleToggleImmersiveTranslate(tab.id)
    } catch (error) {
        console.error("右键菜单处理失败:", error)
    }
})

function safeSendMessage(tabId: number, payload: unknown) {
    chrome.tabs.sendMessage(tabId, payload, () => {
        if (chrome.runtime.lastError) {
            // Ignore tabs without our content script (chrome:// pages, unloaded frames, etc.).
            return
        }
    })
}

// 处理开启/关闭沉浸式翻译
async function handleToggleImmersiveTranslate(tabId: number) {
    try {
        // 向content script发送切换沉浸式翻译的消息，并等待状态返回
        chrome.tabs.sendMessage(
            tabId,
            {
                type: "TOGGLE_IMMERSIVE_TRANSLATE"
            },
            response => {
                if (chrome.runtime.lastError) {
                    return
                }
                // 根据返回的状态更新菜单文本
                if (response && typeof response.isTranslate === "boolean") {
                    chrome.contextMenus.update("immersive-translate", {
                        title: response.isTranslate ? "开启翻译" : "关闭翻译"
                    })
                }
            }
        )
    } catch (error) {
        console.error("切换沉浸式翻译失败:", error)
    }
}

//切换页面时更新配置识别网页的语言
chrome.tabs.onActivated.addListener(tabInfo => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currentTab = tabs[0]
        if (currentTab) {
            const url = currentTab.url // 通过 tabId 获取标签页详细信息（如 URL、标题等）
            safeSendMessage(tabInfo.tabId, {
                type: "TOGGLE_ACTIVATED",
                tabId: tabInfo.tabId,
                url
            })
        }

        chrome.tabs.sendMessage(
            tabInfo.tabId,
            {
                type: "GET_TRANSLATE_STATE"
            },
            response => {
                if (chrome.runtime.lastError) {
                    return
                }
                if (response && typeof response.isTranslate === "boolean") {
                    chrome.contextMenus.update("immersive-translate", {
                        title: response.isTranslate ? "关闭翻译" : "开启翻译"
                    })
                }
            }
        )
    })
})

chrome.runtime.onMessage.addListener(
    (message: { type: string; isTranslate: boolean }) => {
        if (message.type === "TRANSLATE_END") {
            chrome.contextMenus.update("immersive-translate", {
                title: message.isTranslate ? "关闭翻译" : "开启翻译"
            })
        }
    }
)

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    safeSendMessage(tabId, {
        type: "TAB_UPDATED",
        tabId: tabId,
        url: changeInfo.url
    })
})
