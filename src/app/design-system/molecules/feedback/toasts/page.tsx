"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import { ToastDemo } from "../_components/ToastDemo";

export default function ToastsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Toasts (Sonner)</h1>
                <p className={styles.textMuted}>Transient feedback messages</p>
            </header>

            <div className={styles.storySection}>
                <Story id="toasts" title="Toast Usage">
                    <ToastDemo />
                </Story>
            </div>
        </>
    );
}
