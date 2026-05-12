import * as React from "react"
import styled from "styled-components"

import iconImg from "~/assets/icon.png"

const Container = styled.div`
    width: 100%;
    min-height: 100%;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    font-family: var(--font-family);
`

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-light);
    margin-bottom: var(--space-4);
`

const Logo = styled.img`
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
`

const Title = styled.h2`
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin: 0;
`

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    font-size: var(--font-size-sm);
    text-align: center;
    padding: var(--space-8) 0;
`

const IconWrapper = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--gray-100);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-3);
    color: var(--gray-400);
`

const SlidePanel: React.FunctionComponent = () => {
    return (
        <Container>
            <Header>
                <Logo src={iconImg} alt="mewCat" />
                <Title>翻译侧边栏</Title>
            </Header>
            <Content>
                <IconWrapper>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                </IconWrapper>
                <p>选择文本后点击翻译</p>
                <p>内容将显示在这里</p>
            </Content>
        </Container>
    )
}

export default SlidePanel
