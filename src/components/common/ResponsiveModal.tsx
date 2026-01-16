"use client";

import React from 'react';
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

        return (
            <>
                {showCancel ? (
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className={cn(mode === 'drawer' && "w-full h-12")}
                    >
                        {cancelText}
                    </Button>
                ) : null}
                <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                    disabled={confirmDisabled || confirmLoading}
                    className={cn(mode === 'drawer' && "w-full h-12")}
                    autoFocus
                >
                    {confirmLoading ? "처리 중..." : confirmText}
                </Button>
            </>
        );
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
                <DialogContent
                    className={cn("max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden", className)}
                    onInteractOutside={(e) => !dismissible && e.preventDefault()}
                    onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
                >
                    <div className="p-6 pb-0">
                        <DialogHeader>
                            <DialogTitle>{title || "알림"}</DialogTitle>
                            {description ? <DialogDescription>{description}</DialogDescription> : null}
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 py-2">
                        {children}
                    </div>

                    {hasActions ? (
                        <DialogFooter className="p-6 pt-2 gap-2 flex-row justify-end">
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
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm flex flex-col max-h-[90vh]">
                    <DrawerHeader className="text-left shrink-0">
                        <DrawerTitle>{title || "알림"}</DrawerTitle>
                        {description ? <DrawerDescription>{description}</DrawerDescription> : null}
                    </DrawerHeader>

                    <div className="flex-1 overflow-hidden min-h-0">
                        {children ? (
                            <DrawerScrollArea className={className}>
                                {children}
                            </DrawerScrollArea>
                        ) : null}
                    </div>

                    {hasActions ? (
                        <DrawerFooter className="flex-col gap-3 pt-2 pb-8 shrink-0">
                            {renderButtons('drawer')}
                        </DrawerFooter>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
