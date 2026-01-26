"use client";

import React, { useState } from "react";
import styles from "../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
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
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/Drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Edit2, MoreVertical, Share2, Trash2 } from "lucide-react";
import Story from "../Story";

export default function OverlaysPage() {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Modals & Overlays</h1>
                <p className={styles.textMuted}>사용자 인터렉션 위에 레이어로 표시되는 프리미엄 레이아웃 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Responsive Modal" description="Adaptive dialog that switches between Modal (Desktop) and Drawer (Mobile)">
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
                </Story>

                <Story title="Confirmation Dialog" description="Alert dialog for destructive or critical actions">
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
                </Story>

                <Story title="Bottom Sheets (Drawer)" description="iOS-style slide-up panels with multiple surface variants">
                    <div className={styles.showcaseStack}>
                        <div className={styles.showcaseRow}>
                            <div className={styles.verticalStackExtraSmall}>
                                <Label className={styles.labelMuted}>Standard Surface</Label>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="secondary">Open Sheet</Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>Standard Drawer</DrawerTitle>
                                            <DrawerDescription>Full-width mobile sheet for standard selection.</DrawerDescription>
                                        </DrawerHeader>
                                        <div className={styles.verticalStackSmall} style={{ padding: '0 16px 24px' }}>
                                            <div className={styles.codePanel}>List Item 1</div>
                                            <div className={styles.codePanel}>List Item 2</div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>

                            <div className={styles.verticalStackExtraSmall}>
                                <Label className={styles.labelMuted}>Island (Floating)</Label>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline">Open Island</Button>
                                    </DrawerTrigger>
                                    <DrawerContent variant="floating">
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>Floating Island</DrawerTitle>
                                            <DrawerDescription>Premium floating sheet for highlighted content.</DrawerDescription>
                                        </DrawerHeader>
                                        <div className={styles.verticalStackSmall} style={{ padding: '0 16px 24px' }}>
                                            <div className={styles.codePanel} style={{ backgroundColor: 'white' }}>Quick Suggestion 1</div>
                                            <div className={styles.codePanel} style={{ backgroundColor: 'white' }}>Quick Suggestion 2</div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>
                    </div>
                </Story>

                <Story title="Contextual Menus" description="Dropdown menus for space-saving action lists">
                    <div className={styles.showcaseRow}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className={styles.widthFull} style={{ minWidth: 200 }}>
                                <DropdownMenuLabel>Invitation Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Edit2 size={14} style={{ marginRight: 8 }} /> Edit Details</DropdownMenuItem>
                                <DropdownMenuItem><Share2 size={14} style={{ marginRight: 8 }} /> Copy Link</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600"><Trash2 size={14} style={{ marginRight: 8 }} /> Delete Forever</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Story>
            </div>
        </>
    );
}
