"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import Story from "../../../Story";
import { DatePickerDemo } from "../_components/DatePickerDemo";

export default function DatePickerPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Date & Time</h1>
                <p className={styles.textMuted}>Calendar, date, and time inputs</p>
            </header>

            <div className={styles.storySection}>
                <Story id="date" title="Calendar & Date Picker">
                    <DatePickerDemo />
                </Story>
            </div>
        </>
    );
}
