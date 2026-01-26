"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import DocSection from "../../../DocSection";
import { SwitchDemo } from "../_components/SwitchDemo";

export default function SwitchPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Switch (Toggle)</h1>
                <p className={styles.textMuted}>Binary state control with label and description</p>
            </header>

            <div className={styles.storySection}>
                <Story id="switch" title="Switch Usage">
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
