import React, { startTransition, useMemo, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import styled from "styled-components"

import { NAVIGATION_ITEMS } from "@/constants"

import "@/styles/options.scss"

import { ErrorFallback } from "@/components/ErrorFallback"

import OptionsContentHeader from "../components/OptionsContentHeader"
import OptionsSidebar from "../components/OptionsSidebar"
import { hideScrollBar } from "../styles/scroll"
import { About } from "./About"
import { Basic } from "./Basic"
import { Image } from "./Image"
import { Selection } from "./Selection"
import TranslateServices from "./TranslateServices"

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    background: var(--bg-primary);
    background-image: var(--sun-glow);
    font-family: var(--font-family);
    color: var(--text-primary);
`

const SidebarWrapper = styled.div`
    flex-shrink: 0;
`

const MainContent = styled.main`
    flex: 1;
    padding: var(--space-8) var(--space-8) var(--space-10);
    overflow-y: auto;
    background: var(--bg-primary);
    ${hideScrollBar}
`

const ContentInner = styled.div`
    max-width: 880px;
    margin: 0 auto;
`

const IndexOptions: React.FunctionComponent = () => {
    const [activeTab, setActiveTab] = useState("basic")

    const renderContent = () => {
        switch (activeTab) {
            case "basic":
                return <Basic />
            case "translation":
                return <TranslateServices />
            case "selection":
                return <Selection />
            case "image":
                return <Image />
            case "about":
                return <About />
            default:
                return <Basic />
        }
    }

    const contentInfo = useMemo(() => {
        const item = NAVIGATION_ITEMS?.map(v => ({
            ...v,
            title: v.label
        })).find(item => item.id === activeTab)
        return (
            item ?? {
                title: "基本配置",
                description: "语言和网址设置"
            }
        )
    }, [activeTab])

    return (
        <Container className="options-container">
            <SidebarWrapper>
                <OptionsSidebar
                    title="译趣喵"
                    subtitle="高级设置"
                    navigationItems={NAVIGATION_ITEMS}
                    activeTab={activeTab}
                    onTabChange={id => {
                        startTransition(() => {
                            setActiveTab(id)
                        })
                    }}
                    className="sidebar"
                />
            </SidebarWrapper>

            <MainContent className="content options-scrollbar">
                <ContentInner>
                    <OptionsContentHeader
                        title={contentInfo.title}
                        description={contentInfo.description}
                    />
                    <ErrorBoundary fallbackRender={ErrorFallback}>
                        {renderContent()}
                    </ErrorBoundary>
                </ContentInner>
            </MainContent>
        </Container>
    )
}

export default IndexOptions
