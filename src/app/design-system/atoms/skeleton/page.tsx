"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Skeleton } from "@/components/ui/Skeleton";
import DesignSystemPage from "../../DesignSystemPage";
import { usePropControls } from "../../hooks/usePropControls";

export default function SkeletonPage() {
    const { values, getPropItems } = usePropControls({
        width: {
            type: 'text',
            defaultValue: "100%",
            description: "스켈레톤의 너비 (px, % 등)",
            componentType: 'string | number'
        },
        height: {
            type: 'text',
            defaultValue: "20px",
            description: "스켈레톤의 높이 (px, % 등)",
            componentType: 'string | number'
        },
        className: {
            type: 'text',
            defaultValue: "",
            description: "추가적인 CSS 클래스 (SCSS Module 클래스 권장)",
            componentType: 'string'
        }
    });

    return (
        <DesignSystemPage
            title="Skeleton / Loader"
            description="콘텐츠 로딩 중에 사용자에게 구조를 힌트로 제공해 불안을 줄이는 컴포넌트입니다."
            playground={{
                title: "Interactive Playground",
                description: "사용자 정의 크기와 스타일을 실시간으로 확인해 보세요.",
                content: (
                    <Skeleton
                        className={String(values.className)}
                        style={{
                            width: values.width as string,
                            height: values.height as string
                        }}
                    />
                ),
                usage: `import { Skeleton } from "@/components/ui/Skeleton";\n\n<Skeleton \n  style={{ width: '${values.width}', height: '${values.height}' }}\n  className="${values.className}" \n/>`,
                props: getPropItems()
            }}
            combinations={{
                title: "Usage Examples",
                description: "다양한 컴포넌트와 조합하여 로딩 상태를 구현할 수 있습니다.",
                content: (
                    <div className={styles.verticalStackMedium}>
                        {/* Basic Geometry */}
                        <div className={styles.verticalStackSmall}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Basic Geometry</h4>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Standardized primitives for text lines, avatars, and containers</p>
                            <div className={styles.showcaseGrid}>
                                <div className={styles.skeletonItem}>
                                    <Skeleton className={styles.skeletonTextLong} />
                                    <span className={styles.labelXs}>Text Line (Long)</span>
                                </div>
                                <div className={styles.skeletonItem}>
                                    <Skeleton className={styles.skeletonAvatar} />
                                    <span className={styles.labelXs}>Avatar Circle</span>
                                </div>
                                <div className={styles.skeletonItem}>
                                    <Skeleton className={styles.skeletonButton} style={{ width: 100 }} />
                                    <span className={styles.labelXs}>Action Button</span>
                                </div>
                            </div>
                        </div>

                        {/* Composite Patterns */}
                        <div className={styles.verticalStackSmall} style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Composite Patterns</h4>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Loading states for complex business entities</p>
                            <div className={styles.gridTwoCols}>
                                {/* User Card */}
                                <div className={styles.verticalStackSmall}>
                                    <span className={styles.labelMuted}>Profile Card Pattern</span>
                                    <div className={styles.canvas} style={{ padding: 24, gap: 16 }}>
                                        <div className={styles.skeletonUserRow}>
                                            <Skeleton className={styles.skeletonAvatar} />
                                            <div className={styles.verticalStackExtraSmall}>
                                                <Skeleton className={styles.skeletonTextLong} style={{ width: 120 }} />
                                                <Skeleton className={styles.skeletonTextShort} style={{ width: 80 }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* List Pattern */}
                                <div className={styles.verticalStackSmall}>
                                    <span className={styles.labelMuted}>Item List Pattern</span>
                                    <div className={styles.canvas} style={{ padding: 24, gap: 12 }}>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={styles.skeletonUserRow} style={{ justifyContent: 'space-between' }}>
                                                <div className={styles.rowGap2}>
                                                    <Skeleton style={{ width: 32, height: 32, borderRadius: 6 }} />
                                                    <Skeleton style={{ width: 100, height: 12 }} />
                                                </div>
                                                <Skeleton style={{ width: 40, height: 20, borderRadius: 10 }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Surface Loading */}
                        <div className={styles.verticalStackSmall} style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Full Surface Loading</h4>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Standard placeholder for main dashboard or editor panels</p>
                            <div className={styles.skeletonStack}>
                                <Skeleton className={styles.skeletonCard} />
                                <div className={styles.skeletonButtonRow}>
                                    <Skeleton className={styles.skeletonButton} />
                                    <Skeleton className={styles.skeletonButton} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
