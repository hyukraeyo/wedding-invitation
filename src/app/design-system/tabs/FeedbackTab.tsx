"use client";

import React, { useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

export default function FeedbackTab() {
    const showToast = useCallback((variant: "success" | "error" | "info") => {
        if (variant === "success") toast.success("Saved successfully.");
        if (variant === "error") toast.error("Something went wrong. Please try again.");
        if (variant === "info") toast.info("Heads up! New updates available.");
    }, []);

    return (
        <div className={styles.storySection}>
            <Story title="Toasts (Sonner)" description="Transient feedback messages">
                <div className="flex gap-3">
                    <Button onClick={() => showToast("success")} className="bg-green-600 hover:bg-green-700">Test Success</Button>
                    <Button onClick={() => showToast("error")} variant="destructive">Test Error</Button>
                    <Button onClick={() => showToast("info")} variant="secondary">Test Info</Button>
                </div>
            </Story>

            <Story title="Alert Banners" description="Inline status messaging">
                <div className="flex flex-col gap-4 w-full">
                    <Alert variant="default">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>Cloud Sync Active</AlertTitle>
                        <AlertDescription>Your changes are safely backed up to the Banana server.</AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Billing Required</AlertTitle>
                        <AlertDescription>Please upgrade to keep your premium features.</AlertDescription>
                    </Alert>
                </div>
            </Story>

            <Story title="Loading States" description="Spinners, progress, and activity">
                <div className="flex flex-wrap gap-12 w-full">
                    <div className="flex flex-col gap-2 items-center">
                        <Label className="text-xs">Standard Spinner</Label>
                        <LoadingSpinner variant="full" className="static h-16 w-16" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <Label className="text-xs">Linear Glow</Label>
                        <div className="w-60">
                            <ProgressBar />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <Label className="text-xs">Lucide Motion</Label>
                        <Loader2 className="animate-spin text-zinc-300" size={32} />
                    </div>
                </div>
            </Story>

            <Story title="Skeleton Previews" description="Placeholder layouts while loading">
                <div className="flex flex-col gap-8 w-full max-sm:max-w-xs">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-[220px]" />
                            <Skeleton className="h-4 w-[140px]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-[180px] w-full rounded-2xl" />
                        <div className="flex gap-3">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                        </div>
                    </div>
                </div>
            </Story>
        </div>
    );
}
