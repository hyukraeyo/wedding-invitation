"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import { ColorPickerDemo } from "../_components/ColorPickerDemo";

export default function ColorPickerPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Color Picker</h1>
                <p className={styles.textMuted}>Custom color pickers for theme customization</p>
            </header>

            <div className={styles.storySection}>
                <Story id="color" title="Color Selectors">
                    <ColorPickerDemo />
                </Story>
            </div>
        </>
    );
}
