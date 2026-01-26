"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { SegmentedControlDemo } from "./_components/SegmentedControlDemo";
import { RadioGroupDemo } from "./_components/RadioGroupDemo";
import { SwitchDemo } from "./_components/SwitchDemo";

export default function ChoicesPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Radio & Choices</h1>
                <p className={styles.textMuted}>단일 선택을 위한 필드와 현대적인 Segmented Control, 그리고 On/Off 스위치 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="segmented" title="Segmented Control" description="Modern alternative to radio buttons for view toggles or mode selection">
                    <SegmentedControlDemo />
                </Story>

                <Story id="radio" title="Radio Group" description="Standard selection pattern for mutually exclusive options">
                    <RadioGroupDemo />
                </Story>

                <Story id="switch" title="Switch (Toggle)" description="Binary state control with label and description">
                    <SwitchDemo />
                </Story>

                <DocSection
                    title="SwitchField Documentation"
                    usage={`import { SwitchField } from "@/components/common/SwitchField";\n\n<SwitchField\n  label="Enable Feature"\n  checked={checked}\n  onChange={setChecked}\n/>`}
                    props={[
                        { name: "label", type: "string", description: "필드 레이블" },
                        { name: "description", type: "string", description: "상세 설명" },
                        { name: "checked", type: "boolean", description: "활성화 여부" },
                        { name: "onChange", type: "(checked: boolean) => void", description: "상태 변경 콜백" },
                    ]}
                />
            </div>
        </>
    );
}
