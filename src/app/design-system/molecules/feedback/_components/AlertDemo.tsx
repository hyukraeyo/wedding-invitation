"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { CheckCircle2, TriangleAlert } from "lucide-react";

export function AlertDemo() {
    return (
        <div className={styles.showcaseStack}>
            <Alert variant="default">
                <CheckCircle2 className={styles.iconSuccessSmall} />
                <AlertTitle>Cloud Sync Active</AlertTitle>
                <AlertDescription>Your changes are safely backed up to the Banana server.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <TriangleAlert className={styles.iconSmall} />
                <AlertTitle>Billing Required</AlertTitle>
                <AlertDescription>Please upgrade to keep your premium features.</AlertDescription>
            </Alert>
        </div>
    );
}
