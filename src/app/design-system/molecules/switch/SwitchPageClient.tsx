"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { SwitchField } from "@/components/common/SwitchField";

export default function SwitchPageClient() {
    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);

    // Exposure Controls
    const [showLabel, setShowLabel] = useState(true);
    const [showDescription, setShowDescription] = useState(true);

    const [labelText, setLabelText] = useState("알림 설정");
    const [descriptionText, setDescriptionText] = useState("새로운 소식이 있을 때 푸시 알림을 받습니다.");

    const switchUsage = `import { SwitchField } from "@/components/common/SwitchField";

<SwitchField
  ${showLabel ? `label="${labelText}"` : ""}
  ${showDescription ? `description="${descriptionText}"` : ""}
  checked={checked}
  onChange={setChecked}
  ${disabled ? "disabled" : ""}
/>`;

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Switch (스위치)</h1>
                <p className={styles.textMuted}>두 가지 상태(On/Off) 중 하나를 선택할 때 사용하는 스위치 컴포넌트입니다. 키보드 내비게이션 및 스크린 리더 접근성을 지원합니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="playground" title="미리보기" description="스위치의 다양한 속성을 실시간으로 테스트해보세요.">
                    <div
                        className={styles.canvas}
                        role="region"
                        aria-label="Switch Preview Canvas"
                        style={{ alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
                    >
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <SwitchField
                                label={labelText}
                                description={descriptionText}
                                hideLabel={!showLabel}
                                hideDescription={!showDescription}
                                checked={checked}
                                onChange={setChecked}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={switchUsage}
                    props={[
                        {
                            name: "checked",
                            type: "boolean",
                            description: "현재 활성화 여부",
                            control: { type: 'boolean', value: checked, onChange: (val) => setChecked(val as boolean) }
                        },
                        {
                            name: "showLabel",
                            type: "boolean",
                            description: "레이블 노출 여부",
                            control: { type: 'boolean', value: showLabel, onChange: (val) => setShowLabel(val as boolean) }
                        },
                        {
                            name: "label",
                            type: "string",
                            description: "스위치 레이블",
                            control: { type: 'text', value: labelText, onChange: (val) => setLabelText(val as string) }
                        },
                        {
                            name: "showDescription",
                            type: "boolean",
                            description: "설명 노출 여부",
                            control: { type: 'boolean', value: showDescription, onChange: (val) => setShowDescription(val as boolean) }
                        },
                        {
                            name: "description",
                            type: "string",
                            description: "하단 상세 설명",
                            control: { type: 'text', value: descriptionText, onChange: (val) => setDescriptionText(val as string) }
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            description: "비활성화 상태",
                            control: { type: 'boolean', value: disabled, onChange: (val) => setDisabled(val as boolean) }
                        },
                    ]}
                />
            </div>
        </>
    );
}
