"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/Drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { InfoMessage } from "@/components/ui/InfoMessage";
import { ResponsiveModal } from "@/components/common/ResponsiveModal/ResponsiveModal";
import { Edit2, Info, MoreVertical, Share2, Trash2 } from "lucide-react";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

export default function OverlaysTab() {
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);

    return (
        <div className={styles.storySection}>
            <Story title="Global Modals" description="Dialogs, drawers, and alert patterns">
                <div className="flex flex-wrap gap-4 items-center">
                    <Dialog>
                        <DialogTrigger asChild><Button variant="outline">Modal Interface</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Quick Profile</DialogTitle>
                                <DialogDescription>Update your wedding details below.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <Input placeholder="Registry ID" />
                                <div className="h-24 bg-zinc-50 rounded-xl border border-dashed flex items-center justify-center text-zinc-400">Content Area</div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button onClick={() => setIsRespModalOpen(true)} variant="solid">Responsive Modal</Button>
                    <ResponsiveModal
                        open={isRespModalOpen}
                        onOpenChange={setIsRespModalOpen}
                        title="Responsive Modal Wrapper"
                        description="This component renders as a Dialog on Desktop and a Drawer on Mobile."
                        onConfirm={() => setIsRespModalOpen(false)}
                        showCancel
                    >
                        <div className="py-6 space-y-4">
                            <InfoMessage>This is the standard modal for the project.</InfoMessage>
                            <div className="h-[200px] bg-zinc-50 rounded-2xl border border-dashed flex items-center justify-center text-zinc-300">
                                Adaptive Content Area
                            </div>
                        </div>
                    </ResponsiveModal>

                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive">Critical Action</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action will permanently delete your wedding data.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Keep it</AlertDialogCancel>
                                <AlertDialogAction>Delete all</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </Story>

            <Story title="Side Surfaces" description="Drawers and sheets for secondary flows">
                <div className="flex gap-4">
                    <Drawer>
                        <DrawerTrigger asChild><Button variant="secondary">Bottom Drawer</Button></DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Quick Navigation</DrawerTitle>
                                <DrawerDescription>Access settings and links.</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-6 h-60 bg-zinc-50 rounded-t-3xl border-t border-dashed">
                                Swipeable sheet content...
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <Sheet>
                        <SheetTrigger asChild><Button variant="outline">Right Panel</Button></SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Admin Studio</SheetTitle>
                                <SheetDescription>Advanced system tools.</SheetDescription>
                            </SheetHeader>
                            <div className="mt-10 space-y-6">
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </Story>

            <Story title="Menu & Floating" description="Dropdowns and popovers">
                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">Manage <MoreVertical size={16} className="ml-1" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Invitation Tools</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Edit2 size={14} className="mr-2" /> Quick Edit</DropdownMenuItem>
                            <DropdownMenuItem><Share2 size={14} className="mr-2" /> Share Link</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"><Trash2 size={14} className="mr-2" /> Remove Permanent</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover>
                        <PopoverTrigger asChild><Button variant="ghost" size="sm">Hover Tip</Button></PopoverTrigger>
                        <PopoverContent className="w-80 p-5 shadow-2xl">
                            <div className="flex gap-4">
                                <div className="p-2 bg-yellow-100 rounded-full h-fit"><Info size={20} className="text-yellow-700" /></div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Did you know?</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        The design system adapts in real-time to your sidebar adjustments!
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </Story>
        </div>
    );
}
