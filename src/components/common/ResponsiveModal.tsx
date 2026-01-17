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
} from "@/components/ui/Dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
} from "@/components/ui/Drawer"
import { cn } from '@/lib/utils';
import styles from './ResponsiveModal.module.scss';

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
                    className={cn(styles.dialogContent, className)}
                    onInteractOutside={(e) => !dismissible && e.preventDefault()}
                    onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
                    aria-describedby={description ? undefined : undefined}
                >
                    <div className={styles.header}>
                        <DialogHeader className="text-center sm:text-center"> {/* Shadcn Override */}
                            <DialogTitle className={styles.title}>
                                {title || "알림"}
                            </DialogTitle>
                            {description ? (
                                <DialogDescription className={styles.description}>
                                    {description}
                                </DialogDescription>
                            ) : <DialogDescription className="sr-only" />}
                        </DialogHeader>
                    </div>

                    <div className={styles.content}>
                        {children}
                    </div>

                    {hasActions ? (
                        <div className={styles.footer}>
                            {showCancel ? (
                                <button
                                    onClick={handleCancel}
                                    className={cn(styles.cancelButton, styles.dialogButtonHeight)}
                                >
                                    {cancelText}
                                </button>
                            ) : null}
                            <button
                                onClick={onConfirm}
                                disabled={confirmDisabled || confirmLoading}
                                className={cn(
                                    styles.confirmButton,
                                    styles.dialogButtonHeight,
                                    confirmVariant === 'destructive' ? styles.destructive : styles.primary
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
            <DrawerContent className={styles.drawerContent}>
                <div className={styles.drawerLayout}>
                    <DrawerHeader className={cn(styles.header, styles.drawerHeader)}>
                        <DrawerTitle className={styles.title}>
                            {title || "알림"}
                        </DrawerTitle>
                        {description ? (
                            <DrawerDescription className={styles.description}>
                                {description}
                            </DrawerDescription>
                        ) : <DrawerDescription className="sr-only" />}
                    </DrawerHeader>

                    <div className={cn(styles.content, styles.drawerScrollArea)}>
                        {children ? (
                            <DrawerScrollArea className={className}>
                                {children}
                            </DrawerScrollArea>
                        ) : null}
                    </div>

                    {hasActions ? (
                        <div className={styles.footer}>
                            {showCancel ? (
                                <button
                                    onClick={handleCancel}
                                    className={cn(styles.cancelButton, styles.drawerButtonHeight)}
                                >
                                    {cancelText}
                                </button>
                            ) : null}
                            <button
                                onClick={onConfirm}
                                disabled={confirmDisabled || confirmLoading}
                                className={cn(
                                    styles.confirmButton,
                                    styles.drawerButtonHeight,
                                    confirmVariant === 'destructive' ? styles.destructive : styles.primary
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
