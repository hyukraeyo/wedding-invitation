"use client";

import React, { useState } from "react";
import styles from "../../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import { Calendar } from "@/components/ui/Calendar";
import { DatePicker } from "@/components/common/DatePicker";

export function DatePickerDemo() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [dateString, setDateString] = useState("2026-05-24");

    return (
        <div className={styles.gridTwoColsLarge}>
            <div className={styles.verticalStackSmall}>
                <Label className={styles.labelUppercase}>Calendar Component</Label>
                <div className={styles.calendarWrapper}>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className={styles.paddingZero ?? ""}
                    />
                </div>
            </div>

            <div className={styles.showcaseStack}>
                <div className={styles.verticalStackSmall} style={{ maxWidth: 300 }}>
                    <Label className={styles.labelUppercase}>Date Picker</Label>
                    <DatePicker value={dateString} onChange={setDateString} />
                </div>
            </div>
        </div>
    );
}
