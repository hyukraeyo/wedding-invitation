"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import DocSection from "../../../DocSection";
import { AlertDemo } from "../_components/AlertDemo";

export default function AlertsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Alert Banners</h1>
                <p className={styles.textMuted}>Inline status messaging for critical or helpful info</p>
            </header>

            <div className={styles.storySection}>
                <Story id="alerts" title="Alert Usage">
                    <AlertDemo />
                </Story>

                <DocSection
                    title="Alert Documentation"
                    usage={`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";\n\n<Alert variant="default">\n  <AlertTitle>Title</AlertTitle>\n  <AlertDescription>Description</AlertDescription>\n</Alert>`}
                    props={[
                        { name: "variant", type: '"default" | "destructive"', defaultValue: '"default"', description: "알림의 시각적 스타일 변형" },
                    ]}
                />
            </div>
        </>
    );
}
