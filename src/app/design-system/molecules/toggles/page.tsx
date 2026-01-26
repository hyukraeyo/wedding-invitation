"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function TogglesPage() {
    const [isActive, setIsActive] = useState(true);

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Toggle Buttons</h1>
                <p className={styles.textMuted}>단일 선택이나 상태 전환을 위한 칩(Chips)과 세그먼트 형태의 컨트롤입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Toggle Chips" description="TDS-style interactive chips for various sizes">
                    <div className={styles.showcaseStack}>
                        <div className={styles.rowGap2}>
                            <Toggle size="sm">Small Chip</Toggle>
                            <Toggle size="md" pressed={isActive} onPressedChange={setIsActive}>Medium Active</Toggle>
                            <Toggle size="lg">Large Chip</Toggle>
                        </div>
                    </div>
                </Story>

                <Story title="Segmented Tabs" description="Flat value selection without deep content logic">
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall} style={{ maxWidth: 320 }}>
                            <Tabs defaultValue="m">
                                <TabsList fluid>
                                    <TabsTrigger value="s">Small</TabsTrigger>
                                    <TabsTrigger value="m">Medium</TabsTrigger>
                                    <TabsTrigger value="l">Large</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </Story>

                <DocSection
                    
                    usage={`import { Toggle } from "@/components/ui/Toggle";\n\n<Toggle\n  pressed={pressed}\n  onPressedChange={setPressed}\n  size="md"\n>\n  Active\n</Toggle>`}
                    props={[
                        { name: "pressed", type: "boolean", description: "활성화 여부" },
                        { name: "onPressedChange", type: "(pressed: boolean) => void", description: "상태 변경 콜백" },
                        { name: "size", type: '"sm" | "md" | "lg" | "square"', defaultValue: '"md"', description: "토글 크기" },
                        { name: "variant", type: '"default" | "outline"', defaultValue: '"default"', description: "시각적 변형" },
                    ]}
                />
            </div>
        </>
    );
}
