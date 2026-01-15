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
} from "@/components/ui/Dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
    DrawerFooter,
} from "@/components/ui/Drawer"
import { Button } from "@/components/ui/Button";
import { cn } from '@/lib/utils';

export interface ResponsiveModalProps {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    trigger?: React.ReactNode | undefined;
    title?: React.ReactNode | undefined;
    description?: React.ReactNode | undefined;
    children?: React.ReactNode | undefined;
    className?: string | undefined;

    // Alert/Confirm 모드 (children 없이 버튼만 표시)
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    showCancel?: boolean | undefined;
    confirmVariant?: 'default' | 'destructive' | undefined;
}

export const ResponsiveModal = ({
    open = false,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    className,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    showCancel = true,
    confirmVariant = 'default',
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const isAlertMode = !children && onConfirm;

    // undefined 방지용 핸들러
    const internalOnOpenChange = (newOpen: boolean) => {
        onOpenChange?.(newOpen);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    const handleConfirm = () => {
        onConfirm?.();
    };

    const renderFooter = (type: 'dialog' | 'drawer') => {
        if (!isAlertMode) return null;

        if (type === 'dialog') {
            return (
                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    {showCancel && (
                        <Button variant="outline" onClick={handleCancel}>
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        variant={confirmVariant}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            );
        }

        return (
            <DrawerFooter className="flex-col gap-3 pt-2 pb-8">
                <Button
                    onClick={handleConfirm}
                    variant={confirmVariant}
                    className="w-full h-12"
                >
                    {confirmText}
                </Button>
                {showCancel && (
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full h-12"
                    >
                        {cancelText}
                    </Button>
                )}
            </DrawerFooter>
        );
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className={cn("max-w-md max-h-[85vh] overflow-y-auto", className)}>
                    {(title || description) && (
                        <DialogHeader>
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && <DialogDescription>{description}</DialogDescription>}
                        </DialogHeader>
                    )}
                    <div className="py-2">
                        {children}
                    </div>
                    {renderFooter('dialog')}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={internalOnOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                {(title || description) && (
                    <DrawerHeader className="text-left">
                        {title && <DrawerTitle>{title}</DrawerTitle>}
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                )}
                {children ? (
                    <DrawerScrollArea className={className}>
                        {children}
                    </DrawerScrollArea>
                ) : null}
                {renderFooter('drawer')}
            </DrawerContent>
        </Drawer>
    );
};
