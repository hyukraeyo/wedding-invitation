"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";

const colorGroups = [
    {
        title: "Brand Colors",
        colors: [
            { name: "Primary", value: "#FBC02D", desc: "Main Action / Highlight" },
            { name: "Primary Dark", value: "#F9A825", desc: "Darker variant for active/hover" },
            { name: "Ivory", value: "#FFFBEA", desc: "Secondary warmth background" },
        ]
    },
    {
        title: "Semantic States",
        colors: [
            { name: "Success", value: "#22C55E", desc: "Confirmation / Positive" },
            { name: "Warning", value: "#F59E0B", desc: "Attention required" },
            { name: "Error", value: "#EF4444", desc: "Destructive / Alert" },
            { name: "Info", value: "#3B82F6", desc: "General information" },
        ]
    },
    {
        title: "Zinc Neutrals (Scales)",
        colors: [
            { name: "Zinc 50", value: "#FAFAFA", desc: "App background" },
            { name: "Zinc 200", value: "#E4E4E7", desc: "Standard borders" },
            { name: "Zinc 400", value: "#A1A1AA", desc: "Muted text / Placeholder" },
            { name: "Zinc 600", value: "#52525B", desc: "Body text secondary" },
            { name: "Zinc 900", value: "#18181B", desc: "Headings / High contrast" },
        ]
    }
];

export default function ColorsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Colors</h1>
                <p>바나나웨딩의 컬러 팔레트입니다. 프라이머리 옐로우를 중심으로 일관된 색상 시스템을 제공합니다.</p>
            </header>

            <div className={styles.storySection}>
                {colorGroups.map((group) => (
                    <Story key={group.title} title={group.title} description={`Standardized color definitions for the ${group.title.toLowerCase()} scale.`}>
                        <div className={styles.colorGrid}>
                            {group.colors.map((color) => (
                                <div key={color.name} className={styles.colorCard}>
                                    <div
                                        className={styles.colorCardPreview}
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <div className={styles.colorCardInfo}>
                                        <span className={styles.name}>{color.name}</span>
                                        <span className={styles.value}>{color.value}</span>
                                        <p className={styles.desc}>{color.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Story>
                ))}

                <Story title="Sass Implementation" description="How to reference tokens in your style files">
                    <div className={styles.codePanel}>
                        <pre className={styles.monoText}>
                            {`@use "@/styles/variables" as v;

.myComponent {
  background-color: v.$color-primary;
  color: v.$zinc-900;
  border: 1px solid v.$zinc-200;
}`}
                        </pre>
                    </div>
                </Story>
            </div>
        </>
    );
}
