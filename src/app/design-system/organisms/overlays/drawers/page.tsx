"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import { DrawersDemo } from "../_components/DrawersDemo";

export default function DrawersPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Bottom Sheets (Drawer)</h1>
                <p className={styles.textMuted}>iOS-style slide-up panels with multiple surface variants</p>
            </header>

            <div className={styles.storySection}>
                <Story id="drawers" title="Drawer Usage">
                    <DrawersDemo />
                </Story>
            </div>
        </>
    );
}
