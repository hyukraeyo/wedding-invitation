"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Skeleton } from "@/components/ui/Skeleton";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

export default function SkeletonPage() {
    const { values, getPropItems } = usePropControls({
        className: {
            type: 'text',
            defaultValue: "w-[100px] h-[20px] rounded-full",
            description: "크기, 형태, 애니메이션 등을 지정할 클래스",
            componentType: 'string'
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Skeleton</h1>
                <p>콘텐츠 로딩 중에 사용자에게 구조를 힌트로 제공해 불안을 줄이는 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Basic Geometry" description="Standardized primitives for text lines, avatars, and containers">
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
                </Story>

                <Story title="Composite Patterns" description="Loading states for complex business entities">
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
                </Story>

                <DocSection
                    usage={`import { Skeleton } from "@/components/ui/Skeleton";\n\n<Skeleton className="${values.className}" />`}
                    props={getPropItems()}
                />

                <Story title="Full Surface Loading" description="Standard placeholder for main dashboard or editor panels">
                    <div className={styles.skeletonStack}>
                        <Skeleton className={styles.skeletonCard} />
                        <div className={styles.skeletonButtonRow}>
                            <Skeleton className={styles.skeletonButton} />
                            <Skeleton className={styles.skeletonButton} />
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
