"use client";

import React, { useState } from "react";
import styles from "../../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { LayoutGrid, List, Layers } from "lucide-react";

export function SegmentedControlDemo() {
    const [viewMode, setViewMode] = useState<string>("swiper");

    const viewOptions = [
        { value: "swiper", label: "Swiper", icon: <Layers size={14} /> },
        { value: "grid", label: "Grid", icon: <LayoutGrid size={14} /> },
        { value: "list", label: "List", icon: <List size={14} /> },
    ];

    return (
        <div className={styles.verticalStackSmall}>
            <Label className={styles.labelUppercaseBlack}>View Mode</Label>
            <RadioGroup
                variant="segmented"
                value={viewMode}
                onValueChange={setViewMode}
                fullWidth
                options={viewOptions}
            />
        </div>
    );
}
