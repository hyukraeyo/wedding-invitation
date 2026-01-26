"use client";

import React from "react";
import styles from "./DesignSystem.module.scss";
import Story from "./Story";
import DocSection, { PropItem } from "./DocSection";

interface DesignSystemPageProps {
    title: string;
    description: string;
    playground: {
        content: React.ReactNode;
        usage: string;
        props: PropItem[];
        canvasStyle?: React.CSSProperties;
        title?: string;
        description?: string;
    };
    combinations?: {
        title?: string;
        description?: string;
        content: React.ReactNode;
        canvasStyle?: React.CSSProperties;
    };
}

export default function DesignSystemPage({
    title,
    description,
    playground,
    combinations
}: DesignSystemPageProps) {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>{title}</h1>
                <p className={styles.textMuted}>{description}</p>
            </header>

            <div className={styles.storySection}>
                <Story
                    id="playground"
                    title={playground.title || "미리보기"}
                    description={playground.description || "컴포넌트의 다양한 속성을 실시간으로 테스트해보세요."}
                >
                    <div
                        className={styles.canvas}
                        role="region"
                        aria-label={`${title} Preview Canvas`}
                        style={playground.canvasStyle || { alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
                    >
                        {playground.content}
                    </div>
                </Story>

                <DocSection
                    usage={playground.usage}
                    props={playground.props}
                />

                {combinations && (
                    <Story
                        id="combinations"
                        title={combinations.title || "조합 예시"}
                        description={combinations.description || ""}
                    >
                        <div
                            className={styles.canvas}
                            style={combinations.canvasStyle || { display: 'flex', flexDirection: 'column', gap: '32px', padding: '40px' }}
                        >
                            {combinations.content}
                        </div>
                    </Story>
                )}
            </div>
        </>
    );
}
