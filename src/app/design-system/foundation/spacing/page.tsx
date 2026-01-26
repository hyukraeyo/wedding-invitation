"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";

const spacingTokens = [
    { label: "0.25rem", value: "4px", width: 16 },
    { label: "0.5rem", value: "8px", width: 32 },
    { label: "0.75rem", value: "12px", width: 48 },
    { label: "1rem", value: "16px", width: 64 },
    { label: "1.5rem", value: "24px", width: 96 },
    { label: "2rem", value: "32px", width: 128 },
    { label: "2.5rem", value: "40px", width: 160 },
    { label: "3rem", value: "48px", width: 192 },
    { label: "4rem", value: "64px", width: 256 },
];

export default function SpacingPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Spacing</h1>
                <p>일관된 간격 시스템으로 레이아웃의 조화를 유지합니다. 4px 그리드 기반의 디자인 시스템입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Tokens" description="Base spacing units for defining margins and paddings">
                    <div className={styles.verticalStack}>
                        {spacingTokens.map((token) => (
                            <div key={token.value} className={styles.spacingRow}>
                                <div className={styles.typographyMeta} style={{ width: 120 }}>
                                    <span className={styles.label}>{token.value}</span>
                                    <p className={styles.textSmall} style={{ color: '#a1a1aa' }}>{token.label}</p>
                                </div>
                                <div
                                    className={styles.spacingDemo}
                                    style={{
                                        width: `${token.width}px`,
                                        height: 24,
                                        backgroundColor: '#FBC02D',
                                        borderRadius: 4,
                                        opacity: 0.8
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Story>

                <Story title="Usage Strategy" description="Guidelines for applying spacing tokens based on architectural needs">
                    <div className={styles.gridTwoCols}>
                        <div className={styles.codePanel}>
                            <h4 className={styles.textBoldSmall}>Micro (4px - 8px)</h4>
                            <p className={styles.textSmall} style={{ marginTop: 8 }}>Used for icon-text gaps, inline elements, and tightly bound components like input fields.</p>
                        </div>
                        <div className={styles.codePanel}>
                            <h4 className={styles.textBoldSmall}>Standard (12px - 24px)</h4>
                            <p className={styles.textSmall} style={{ marginTop: 8 }}>The most common gaps for card padding, item lists, and section-internal grouping.</p>
                        </div>
                        <div className={styles.codePanel}>
                            <h4 className={styles.textBoldSmall}>Macro (32px - 64px)</h4>
                            <p className={styles.textSmall} style={{ marginTop: 8 }}>Separation between major logical sections of a page and page-level container margins.</p>
                        </div>
                        <div className={styles.codePanel} style={{ borderStyle: 'dashed' }}>
                            <h4 className={styles.textBoldSmall}>Special (80px+)</h4>
                            <p className={styles.textSmall} style={{ marginTop: 8 }}>Used for landing page hero sections and wide visual breathing rooms.</p>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
