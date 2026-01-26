"use client";

import React from "react";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

const radiusTokens = [
    { label: "radius-sm", value: "8px", usage: "Inputs, Small buttons" },
    { label: "radius-md", value: "16px", usage: "Cards, Buttons, Lists" },
    { label: "radius-lg", value: "16px", usage: "Modals, Popovers" },
    { label: "radius-xl", value: "20px", usage: "Feature containers" },
    { label: "radius-2xl", value: "24px", usage: "Hero sections, Main wrappers" },
    { label: "radius-full", value: "9999px", usage: "Avatars, Pill badges" },
];

export default function RadiusPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Border Radius</h1>
                <p>모서리 반경 토큰입니다. 바나나웨딩의 부드럽고 친근한 인상을 위해 일관된 값을 사용합니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Corner Radii" description="Geometric constants for softening component corners">
                    <div className={styles.radiusGrid}>
                        {radiusTokens.map((token) => (
                            <div key={token.label} className={styles.radiusDemo}>
                                <div
                                    className={styles.radiusBox}
                                    style={{
                                        borderRadius: token.value === "9999px" ? "100px" : token.value,
                                        width: 100,
                                        height: 60,
                                        backgroundColor: 'white',
                                        border: '2px solid #FBC02D',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        color: '#F9A825'
                                    }}
                                >
                                    {token.value}
                                </div>
                                <div className={styles.radiusInfo} style={{ marginTop: 12 }}>
                                    <span className={styles.textBoldSmall} style={{ display: 'block' }}>{token.label}</span>
                                    <span className={styles.textSmall} style={{ color: '#71717a' }}>{token.usage}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Story>

                <Story title="Design Philosophy" description="Why we use these specific values">
                    <div className={styles.verticalStackSmall}>
                        <div className={styles.codePanel}>
                            <p className={styles.textSmall}>
                                <strong>Consistency First:</strong> We avoid ad-hoc radius values. Using <code>v.$radius-md</code> for common elements ensures the entire app feels cohesive.
                            </p>
                            <p className={styles.textSmall} style={{ marginTop: 12 }}>
                                <strong>Softness:</strong> The minimum radius starts at 8px to maintain a friendly, mobile-first aesthetic. Square edges are strictly avoided.
                            </p>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
