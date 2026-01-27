"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import DocSection from "../../../DocSection";
import { ModalsDemo } from "../_components/ModalsDemo";
import { usePropControls } from "../../../hooks/usePropControls";

export default function ModalsPage() {
    const { getPropItems } = usePropControls({
        open: {
            description: "모달 열림 상태",
            componentType: 'boolean'
        },
        onOpenChange: {
            description: "열림 상태 변경 콜백",
            componentType: '(open: boolean) => void'
        },
        title: {
            description: "모달 상단 타이틀",
            componentType: 'ReactNode'
        },
        description: {
            description: "타이틀 하단 설명",
            componentType: 'ReactNode'
        },
        confirmText: {
            description: "확인 버튼 텍스트",
            componentType: 'string',
            defaultValue: "확인"
        },
        cancelText: {
            description: "취소 버튼 텍스트",
            componentType: 'string',
            defaultValue: "취소"
        },
        onConfirm: {
            description: "확인 버튼 클릭 콜백",
            componentType: '() => void'
        },
        onCancel: {
            description: "취소 버튼 클릭 콜백",
            componentType: '() => void'
        },
        showCancel: {
            description: "취소 버튼 노출 여부",
            componentType: 'boolean',
            defaultValue: "true"
        },
        padding: {
            description: "콘텐츠 영역 패딩 설정 ('none'은 0px)",
            componentType: "'none' | 'default'",
            defaultValue: "default"
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Modals & Dialogs</h1>
                <p className={styles.textMuted}>Adaptive dialog that switches between Modal (Desktop) and Drawer (Mobile)</p>
            </header>

            <div className={styles.storySection}>
                <Story id="modals" title="Responsive Modal & Confirmation">
                    <ModalsDemo />
                </Story>

                <DocSection
                    usage={`import { ResponsiveModal } from "@/components/common/ResponsiveModal";\n\n<ResponsiveModal\n  open={open}\n  onOpenChange={setOpen}\n  \n  onConfirm={handleConfirm}\n>\n  Content\n</ResponsiveModal>`}
                    props={getPropItems()}
                />
            </div>
        </>
    );
}
