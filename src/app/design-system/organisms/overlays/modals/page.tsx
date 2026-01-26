"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import DocSection from "../../../DocSection";
import { ModalsDemo } from "../_components/ModalsDemo";

export default function ModalsPage() {
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
                    props={[
                        { name: "open", type: "boolean", description: "모달 열림 상태" },
                        { name: "onOpenChange", type: "(open: boolean) => void", description: "열림 상태 변경 콜백" },
                        { name: "title", type: "ReactNode", description: "모달 상단 타이틀" },
                        { name: "description", type: "ReactNode", description: "타이틀 하단 설명" },
                        { name: "confirmText", type: "string", defaultValue: '"확인"', description: "확인 버튼 텍스트" },
                        { name: "cancelText", type: "string", defaultValue: '"취소"', description: "취소 버튼 텍스트" },
                        { name: "onConfirm", type: "() => void", description: "확인 버튼 클릭 콜백" },
                        { name: "onCancel", type: "() => void", description: "취소 버튼 클릭 콜백" },
                        { name: "showCancel", type: "boolean", defaultValue: "true", description: "취소 버튼 노출 여부" },
                    ]}
                />
            </div>
        </>
    );
}
