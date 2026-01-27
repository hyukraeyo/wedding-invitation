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
    const [isNoPaddingOpen, setIsNoPaddingOpen] = useState(false);

    return (
        <>
            <div className={styles.showcaseRow}>
                <Button onClick={() => setIsRespModalOpen(true)} variant="solid">
                    Open Responsive Modal
                </Button>
                <Button onClick={() => setIsNoPaddingOpen(true)} variant="outline">
                    No Padding Modal
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

                <ResponsiveModal
                    open={isNoPaddingOpen}
                    onOpenChange={setIsNoPaddingOpen}
                    title="No Padding Example"
                    description="Useful for full-width items like lists or buttons inside."
                    padding="none"
                    onConfirm={() => setIsNoPaddingOpen(false)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <button
                                key={i}
                                style={{
                                    padding: '16px 20px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #eee',
                                    background: i % 2 === 0 ? '#fafafa' : 'white',
                                    width: '100%'
                                }}
                                onClick={() => setIsNoPaddingOpen(false)}
                            >
                                Option {i} (Full Width Button)
                            </button>
                        ))}
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
