"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { ToastDemo } from "./_components/ToastDemo";
import { AlertDemo } from "./_components/AlertDemo";
import { LoadingDemo } from "./_components/LoadingDemo";
import { SkeletonDemo } from "./_components/SkeletonDemo";
import { usePropControls } from "../../hooks/usePropControls";

export default function FeedbackPage() {
    const { values, getPropItems } = usePropControls({
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ['default', 'destructive'],
            description: "알림의 시각적 스타일 변형",
            componentType: '"default" | "destructive"'
        }
    });

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Feedback</h1>
                <p className={styles.textMuted}>사용자에게 상태와 정보를 전달하는 알림 및 로딩 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="toasts" title="Toasts (Sonner)" description="Transient feedback messages">
                    <ToastDemo />
                </Story>

                <Story id="alerts" title="Alert Banners" description="Inline status messaging for critical or helpful info">
                    <AlertDemo />
                </Story>

                <DocSection
                    usage={`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";\n\n<Alert variant="${values.variant}">\n  <AlertTitle>Title</AlertTitle>\n  <AlertDescription>Description</AlertDescription>\n</Alert>`}
                    props={getPropItems()}
                />

                <Story id="loaders" title="Loading States" description="Spinners, progress, and activity indicators">
                    <LoadingDemo />
                </Story>

                <Story title="Skeleton Previews" description="Placeholder layouts while loading dynamic content">
                    <SkeletonDemo />
                </Story>
            </div>
        </>
    );
}
