"use client";

import React, { useCallback } from "react";
import styles from "../../../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function ToastDemo() {
    const showToast = useCallback((variant: "success" | "error" | "info") => {
        if (variant === "success") toast.success("Saved successfully.");
        if (variant === "error") toast.error("Something went wrong. Please try again.");
        if (variant === "info") toast.info("Heads up! New updates available.");
    }, []);

    return (
        <div className={styles.buttonRow}>
            <Button onClick={() => showToast("success")} className={styles.buttonSuccess}>Test Success</Button>
            <Button onClick={() => showToast("error")} variant="destructive">Test Error</Button>
            <Button onClick={() => showToast("info")} variant="secondary">Test Info</Button>
        </div>
    );
}
