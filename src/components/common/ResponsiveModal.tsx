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
    DrawerHandle,
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
    // Alert 모드 props
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    showCancel = true,
    confirmVariant = 'default',
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Alert 모드: children이 없고 onConfirm이 있으면 버튼만 표시
    const isAlertMode = !children && onConfirm;

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange?.(newOpen);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    const handleConfirm = () => {
        onConfirm?.();
    };

    // Footer 버튼 렌더링 (Alert 모드일 때만)
    const renderFooter = () => {
        if (!isAlertMode) return null;

        if (isDesktop) {
            return (
                <DialogFooter className="gap-2 sm:gap-0">
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
            <Dialog open={open} onOpenChange={handleOpenChange}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className={cn("max-w-md max-h-[85vh] overflow-y-auto", className)}>
                    {(title || description) && (
                        <DialogHeader>
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && (
                                <DialogDescription asChild>
                                    <div>{description}</div>
                                </DialogDescription>
                            )}
                        </DialogHeader>
                    )}
                    {children}
                    {renderFooter()}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                <DrawerHandle />
                {(title || description) && (
                    <DrawerHeader className="text-left">
                        {title && <DrawerTitle>{title}</DrawerTitle>}
                        {description && (
                            <DrawerDescription asChild>
                                <div>{description}</div>
                            </DrawerDescription>
                        )}
                    </DrawerHeader>
                )}
                {children && (
                    <DrawerScrollArea className={cn("px-4 pb-8", className)}>
                        {children}
                    </DrawerScrollArea>
                )}
                {renderFooter()}
            </DrawerContent>
        </Drawer>
    );
};
