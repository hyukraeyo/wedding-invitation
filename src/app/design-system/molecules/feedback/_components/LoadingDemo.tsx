"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { Label } from "@/components/ui/Label";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { Loader2 } from "lucide-react";

export function LoadingDemo() {
    return (
        <div className={styles.loadersRow}>
            <div className={styles.loaderItem}>
                <Label className={styles.labelXs}>Standard Spinner</Label>
                <LoadingSpinner variant="full" className={styles.spinnerBox ?? ""} />
            </div>
            <div className={styles.loaderItem}>
                <Label className={styles.labelXs}>Linear Glow</Label>
                <div className={styles.progressWidth}>
                    <ProgressBar />
                </div>
            </div>
            <div className={styles.loaderItem}>
                <Label className={styles.labelXs}>Lucide Motion</Label>
                <Loader2 className={styles.spinnerLucide} size={32} />
            </div>
        </div>
    );
}
