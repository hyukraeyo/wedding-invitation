"use client";

import React, { useSyncExternalStore } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
} from "@/components/ui/drawer"
import { cn } from '@/lib/utils';

export interface ResponsiveModalProps {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    trigger?: React.ReactNode | undefined;
    title?: React.ReactNode | undefined;
    description?: React.ReactNode | undefined;
    children?: React.ReactNode | undefined;
    footer?: React.ReactNode | undefined; // 추가: 커스텀 푸터
    className?: string | undefined;

    // Action Buttons
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    showCancel?: boolean | undefined;
    confirmVariant?: 'default' | 'destructive' | undefined;
    confirmDisabled?: boolean | undefined;
    confirmLoading?: boolean | undefined;
    dismissible?: boolean;
}

export const ResponsiveModal = ({
    open = false,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    footer,
    className,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    showCancel = true,
    confirmVariant = 'default',
    confirmDisabled = false,
    confirmLoading = false,
    dismissible = true,
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const hasActions = onConfirm || footer;

    const internalOnOpenChange = (newOpen: boolean) => {
        if (!dismissible && !newOpen) return;
        onOpenChange?.(newOpen);
    };

    const handleCancel = () => {
        onCancel?.();
        // Force close even if not dismissible when clicking cancel explicitly
        onOpenChange?.(false);
    };

    const isMounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    if (!isMounted) {
        return null;
    }

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
                <DialogContent
                    className={cn(
                        "max-w-[28rem] max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl", // Super rounded corners
                        className
                    )}
                    onInteractOutside={(e) => !dismissible && e.preventDefault()}
                    onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
                    aria-describedby={description ? undefined : undefined}
                >
                    <div className="px-8 pt-10 pb-2 text-center flex flex-col items-center">
                        <DialogHeader className="text-center sm:text-center">
                            <DialogTitle className="text-2xl font-bold tracking-tight text-[#191F28] mb-3">
                                {title || "알림"}
                            </DialogTitle>
                            {description ? (
                                <DialogDescription className="text-[17px] text-[#4E5968] leading-relaxed break-keep">
                                    {description}
                                </DialogDescription>
                            ) : <DialogDescription className="sr-only" />}
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-2">
                        {children}
                    </div>

                    {hasActions ? (
                        <div className="flex w-full mt-auto border-t border-gray-100">
                            {showCancel ? (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 h-14 text-[16px] font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
                                >
                                    {cancelText}
                                </button>
                            ) : null}
                            <button
                                onClick={onConfirm}
                                disabled={confirmDisabled || confirmLoading}
                                className={cn(
                                    "flex-1 h-14 text-[16px] font-bold transition-colors active:bg-opacity-90",
                                    confirmVariant === 'destructive'
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-[#191F28] hover:bg-[#FFF9C4]", // Default Text Color
                                    // If it's the primary confirm button, we might want a background color interaction or just text? 
                                    // The user asked for "buttons at the bottom taking 50%". Usually this implies a split button bar style.
                                    // Let's use the yellow brand color for the confirm side background to make it stand out?
                                    // OR just simple split buttons like iOS alerts? 
                                    // Looking at the screenshot provided previously (rounded modal), the buttons were floating. 
                                    // But NOW the request refers to "attached to bottom 50% each". 
                                    // Let's make the Confirm button have the Banana Yellow background for clear distinction if desired, 
                                    // OR keep it white with colored text. 
                                    // Let's try: Cancel (White/Gray) | Confirm (Yellow Background) for maximum clarity and "app-like" feel.
                                    confirmVariant !== 'destructive' && "bg-[#FBC02D] hover:bg-[#F9A825]"
                                )}
                            >
                                {confirmLoading ? "처리 중..." : confirmText}
                            </button>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer
            open={open}
            onOpenChange={internalOnOpenChange}
            dismissible={dismissible}
        >
            {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
            <DrawerContent className="rounded-t-[2rem] p-0 border-0"> {/* Rounded top for drawer, no padding */}
                <div className="flex flex-col max-h-[90vh] w-full">
                    <DrawerHeader className="text-center pt-8 pb-4 shrink-0">
                        <DrawerTitle className="text-2xl font-bold tracking-tight text-[#191F28] mb-3">
                            {title || "알림"}
                        </DrawerTitle>
                        {description ? (
                            <DrawerDescription className="text-[17px] text-[#4E5968] leading-relaxed break-keep">
                                {description}
                            </DrawerDescription>
                        ) : <DrawerDescription className="sr-only" />}
                    </DrawerHeader>

                    <div className="flex-1 overflow-hidden min-h-0">
                        {children ? (
                            <DrawerScrollArea className={className}>
                                {children}
                            </DrawerScrollArea>
                        ) : null}
                    </div>

                    {hasActions ? (
                        <div className="flex w-full mt-auto border-t border-gray-100 overflow-hidden shrink-0">
                            {showCancel ? (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 h-16 text-[17px] font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
                                >
                                    {cancelText}
                                </button>
                            ) : null}
                            <button
                                onClick={onConfirm}
                                disabled={confirmDisabled || confirmLoading}
                                className={cn(
                                    "flex-1 h-16 text-[17px] font-bold transition-colors active:bg-opacity-90",
                                    confirmVariant === 'destructive'
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-[#191F28] hover:bg-[#FFF9C4]",
                                    confirmVariant !== 'destructive' && "bg-[#FBC02D] hover:bg-[#F9A825]"
                                )}
                            >
                                {confirmLoading ? "처리 중..." : confirmText}
                            </button>
                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
