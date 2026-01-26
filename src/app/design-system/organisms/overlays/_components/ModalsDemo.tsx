"use client";

import React, { useState } from "react";
import styles from "../../../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { InfoMessage } from "@/components/ui/InfoMessage";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/AlertDialog";

export function ModalsDemo() {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);

    return (
        <>
            <div className={styles.showcaseRow}>
                <Button onClick={() => setIsRespModalOpen(true)} variant="solid">
                    Open Responsive Modal
                </Button>
                <ResponsiveModal
                    open={isRespModalOpen}
                    onOpenChange={setIsRespModalOpen}
                    title="System Preference"
                    description="This component automatically adjusts its layout based on the viewport width."
                    onConfirm={() => setIsRespModalOpen(false)}
                    confirmText="Understood"
                    showCancel={true}
                    cancelText="Close"
                >
                    <div className={styles.verticalStackSmall}>
                        <InfoMessage>
                            Banana Wedding standard overlay pattern for critical configuration.
                        </InfoMessage>
                        <div className={styles.placeholderArea} style={{ height: 120 }}>
                            <p className={styles.textSmall}>Main Content Area</p>
                        </div>
                    </div>
                </ResponsiveModal>
            </div>

            <div className={styles.showcaseRow} style={{ marginTop: 24 }}>
                <h3>Confirmation Dialog</h3>
                <div className={styles.showcaseRow}>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Entire Data</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </>
    );
}
