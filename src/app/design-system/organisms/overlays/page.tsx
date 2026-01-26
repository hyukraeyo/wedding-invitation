"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { ModalsDemo } from "./_components/ModalsDemo";
import { DrawersDemo } from "./_components/DrawersDemo";
import { ContextMenusDemo } from "./_components/ContextMenusDemo";
import { usePropControls } from "../../hooks/usePropControls";

export default function OverlaysPage() {
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
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Modals & Overlays</h1>
                <p className={styles.textMuted}>사용자 인터랙션 전에 레이어로 표시되는 오버레이 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="modals" title="Responsive Modal" description="Adaptive dialog that switches between Modal (Desktop) and Drawer (Mobile)">
                    <ModalsDemo />
                </Story>

                <DocSection
                    usage={`import { ResponsiveModal } from "@/components/common/ResponsiveModal";\n\n<ResponsiveModal\n  open={open}\n  onOpenChange={setOpen}\n  \n  onConfirm={handleConfirm}\n>\n  Content\n</ResponsiveModal>`}
                    props={getPropItems()}
                />

                <Story id="drawers" title="Bottom Sheets (Drawer)" description="iOS-style slide-up panels with multiple surface variants">
                    <DrawersDemo />
                </Story>

                <Story id="context" title="Contextual Menus" description="Dropdown menus for space-saving action lists">
                    <ContextMenusDemo />
                </Story>
            </div>
        </>
    );
}
