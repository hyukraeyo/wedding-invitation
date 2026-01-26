"use client";

import React, { useCallback } from "react";
import styles from "../DesignSystem.module.scss";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import Story from "../Story";

export default function FeedbackPage() {
    const showToast = useCallback((variant: "success" | "error" | "info") => {
        if (variant === "success") toast.success("Saved successfully.");
        if (variant === "error") toast.error("Something went wrong. Please try again.");
        if (variant === "info") toast.info("Heads up! New updates available.");
    }, []);

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Feedback</h1>
                <p className={styles.textMuted}>사용자에게 상태나 정보를 전달하는 알림 및 로딩 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Toasts (Sonner)" description="Transient feedback messages">
                    <div className={styles.buttonRow}>
                        <Button onClick={() => showToast("success")} className={styles.buttonSuccess}>Test Success</Button>
                        <Button onClick={() => showToast("error")} variant="destructive">Test Error</Button>
                        <Button onClick={() => showToast("info")} variant="secondary">Test Info</Button>
                    </div>
                </Story>

                <Story title="Alert Banners" description="Inline status messaging for critical or helpful info">
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
                </Story>

                <Story title="Loading States" description="Spinners, progress, and activity indicators">
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
                </Story>

                <Story title="Skeleton Previews" description="Placeholder layouts while loading dynamic content">
                    <div className={styles.skeletonStack}>
                        <div className={styles.skeletonUserRow}>
                            <Skeleton className={styles.skeletonAvatar} />
                            <div className={styles.verticalStackSmall}>
                                <Skeleton className={styles.skeletonTextLong} />
                                <Skeleton className={styles.skeletonTextShort} />
                            </div>
                        </div>
                        <div className={styles.showcaseStack}>
                            <Skeleton className={styles.skeletonCard} />
                            <div className={styles.skeletonButtonRow}>
                                <Skeleton className={styles.skeletonButton} />
                                <Skeleton className={styles.skeletonButton} />
                            </div>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
