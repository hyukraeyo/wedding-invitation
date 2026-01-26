"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

export default function TogglesPage() {
    const { values, setValue, getPropItems } = usePropControls({
        pressed: {
            type: 'boolean',
            defaultValue: true,
            description: "활성화 여부",
            componentType: 'boolean'
        },
        size: {
            type: 'segmented',
            defaultValue: 'md',
            options: ['sm', 'md', 'lg', 'square'],
            description: "토글 크기",
            componentType: '"sm" | "md" | "lg" | "square"'
        },
        onPressedChange: {
            description: "상태 변경 콜백",
            componentType: '(pressed: boolean) => void'
        }
    });

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
                            <Toggle
                                size={values.size as "sm" | "md" | "lg" | "square"}
                                pressed={values.pressed as boolean}
                                onPressedChange={(pressed) => setValue('pressed', pressed)}
                            >
                                Medium Active
                            </Toggle>
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
                    usage={`import { Toggle } from "@/components/ui/Toggle";\n\n<Toggle\n  pressed={pressed}\n  onPressedChange={setPressed}\n  size="${values.size}"\n>\n  Active\n</Toggle>`}
                    props={getPropItems()}
                />
            </div>
        </>
    );
}
