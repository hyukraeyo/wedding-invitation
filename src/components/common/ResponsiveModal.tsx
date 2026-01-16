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
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
    DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
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

    const renderButtons = (mode: 'dialog' | 'drawer') => {
        if (footer) return footer;
        if (!onConfirm) return null;

        const baseButtonClass = "h-12 rounded-xl text-[16px] font-bold shadow-sm transition-all active:scale-[0.96]";
        const mobileButtonClass = "h-14 rounded-2xl text-[17px]"; // Taller & more rounded on mobile

        return (
            <>
                {showCancel ? (
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className={cn(
                            baseButtonClass,
                            "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                            mode === 'drawer' && [mobileButtonClass, "flex-1"]
                        )}
                    >
                        {cancelText}
                    </Button>
                ) : null}
                <Button
                    variant={confirmVariant === 'destructive' ? 'destructive' : 'default'}
                    onClick={onConfirm}
                    disabled={confirmDisabled || confirmLoading}
                    className={cn(
                        baseButtonClass,
                        confirmVariant !== 'destructive' && "bg-[#FBC02D] hover:bg-[#F9A825] text-gray-900 border-0", // Banana Brand Color
                        mode === 'drawer' && [mobileButtonClass, "flex-1"]
                    )}
                    autoFocus
                >
                    {confirmLoading ? "처리 중..." : confirmText}
                </Button>
            </>
        );
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
                        <DialogFooter className="p-8 pt-6 gap-3 flex-col sm:flex-row sm:justify-center">
                            {renderButtons('dialog')}
                        </DialogFooter>
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
            <DrawerContent className="rounded-t-[2rem]"> {/* Rounded top for drawer */}
                <div className="mx-auto w-full max-w-sm flex flex-col max-h-[90vh]">
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
                        <DrawerFooter className="flex-row gap-3 pt-2 pb-8 px-5 shrink-0">
                            {renderButtons('drawer')}
                        </DrawerFooter>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
