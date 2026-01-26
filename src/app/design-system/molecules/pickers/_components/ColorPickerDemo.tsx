"use client";

import React, { useState } from "react";
import styles from "../../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import { ColorPicker } from "@/components/ui/ColorPicker";

export function ColorPickerDemo() {
    const [color, setColor] = useState("#FBC02D");

    return (
        <div className={styles.showcaseStack}>
            <div className={styles.paddingTopSmall}>
                <Label className={styles.labelMuted} style={{ color: 'inherit', fontSize: 'inherit', marginBottom: 8 }}>Brand Colors</Label>
                <ColorPicker
                    value={color}
                    onChange={setColor}
                    colors={["#FBC02D", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5"]}
                />
            </div>
        </div>
    );
}
