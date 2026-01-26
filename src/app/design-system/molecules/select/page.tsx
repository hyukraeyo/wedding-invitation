"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

export default function SelectPage() {
    const { values, setValue, getPropItems } = usePropControls({
        value: {
            type: 'segmented',
            defaultValue: 'guest',
            options: ['guest', 'family', 'staff'],
            description: "현재 선택된 값",
            componentType: 'string'
        },
        size: {
            type: 'segmented',
            defaultValue: 'md',
            options: ['sm', 'md', 'lg'],
            description: "셀렉트 트리거 크기",
            componentType: '"sm" | "md" | "lg"'
        },
        placeholder: {
            type: 'text',
            defaultValue: "Select role",
            description: "값 미선택 시 노출될 텍스트",
            componentType: 'string'
        },
        modalTitle: {
            type: 'text',
            defaultValue: "",
            description: "모바일 드로어 사용 시 상단 타이틀",
            componentType: 'string'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 여부",
            componentType: 'boolean'
        },
        mobileOnly: {
            type: 'boolean',
            defaultValue: false,
            description: "데스크톱에서도 항상 모바일 드로어로 표시",
            componentType: 'boolean'
        },
        desktopOnly: {
            type: 'boolean',
            defaultValue: false,
            description: "모바일에서도 항상 팝오버로 표시",
            componentType: 'boolean'
        },
        options: {
            description: "선택 항목 배열 ({ label, value, disabled })",
            componentType: 'SelectOption[]'
        },
        onValueChange: {
            description: "값 변경 시 콜백 함수",
            componentType: '(value: T) => void'
        }
    });

    const roleOptions = [
        { label: "Guest (하객)", value: "guest" },
        { label: "Family (혼주)", value: "family" },
        { label: "Staff (스태프)", value: "staff" },
    ];

    const modalTitle = values.modalTitle ? String(values.modalTitle).trim() : "";
    const modalTitleProps = modalTitle ? { modalTitle } : {};
    const usageLines = [
        `import { Select } from "@/components/ui/Select";`,
        ``,
        `<Select`,
        `  value="${values.value}"`,
        `  onValueChange={setValue}`,
        `  options={[`,
        `    { label: "Option 1", value: "1" },`,
        `    { label: "Option 2", value: "2" }`,
        `  ]}`,
        `  placeholder="${values.placeholder}"`,
        `  size="${values.size}"`,
        values.disabled ? `  disabled` : null,
        values.mobileOnly ? `  mobileOnly` : null,
        values.desktopOnly ? `  desktopOnly` : null,
        modalTitle ? `  modalTitle="${modalTitle}"` : null,
        `/>`
    ].filter(Boolean).join("\n");

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Select</h1>
                <p className={styles.textMuted}>데스크톱과 모바일 환경을 모두 고려한 반응형 셀렉트 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="fields" title="Basic Select" description="Standard dropdown selection component">
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall} style={{ maxWidth: 400 }}>
                            <Label className={styles.labelMuted}>Preview</Label>
                            <Select
                                value={values.value as string}
                                onValueChange={(value) => setValue('value', value)}
                                options={roleOptions}
                                placeholder={String(values.placeholder)}
                                size={values.size as "sm" | "md" | "lg"}
                                disabled={values.disabled as boolean}
                                mobileOnly={values.mobileOnly as boolean}
                                desktopOnly={values.desktopOnly as boolean}
                                {...modalTitleProps}
                            />
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={usageLines}
                    props={getPropItems()}
                />
            </div>
        </>
    );
}
