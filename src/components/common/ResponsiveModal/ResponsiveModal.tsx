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
import { Button } from '@/components/ui/Button';
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
    outerFooter?: React.ReactNode | undefined; // 추가: 카드 외부 푸터 (로그아웃 버튼 등)
    className?: string | undefined;
    contentClassName?: string | undefined;

    // Action Buttons
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    showCancel?: boolean | undefined;
    confirmVariant?: 'default' | 'destructive' | 'solid' | undefined;
    confirmDisabled?: boolean | undefined;
    confirmLoading?: boolean | undefined;
    dismissible?: boolean;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    scrollRef?: React.Ref<HTMLDivElement>;
}

export const ResponsiveModal = ({
    open = false,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    footer,
    outerFooter,
    className,
    contentClassName,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    showCancel = true,
    confirmVariant = 'default',
    confirmDisabled = false,
    confirmLoading = false,
    dismissible = true,
    onScroll,
    scrollRef,
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

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

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
                    <div className={styles.card}>
                        <DialogHeader className={styles.header}>
                            <DialogTitle className={styles.title}>
                                {title || "알림"}
                            </DialogTitle>
                            {description ? (
                                <DialogDescription className={styles.description}>
                                    {description}
                                </DialogDescription>
                            ) : null}
                        </DialogHeader>

                        <div
                            ref={scrollRef}
                            className={cn(styles.content, contentClassName)}
                            onScroll={onScroll}
                        >
                            {children}
                        </div>

                        {hasActions ? (
                            <div className={styles.footer}>
                                {footer || (
                                    <>
                                        {showCancel ? (
                                            <Button
                                                variant="ghost"
                                                onClick={handleCancel}
                                                className={cn(styles.cancelButton, styles.dialogButtonHeight)}
                                            >
                                                {cancelText}
                                            </Button>
                                        ) : null}
                                        <Button
                                            onClick={onConfirm}
                                            disabled={confirmDisabled || confirmLoading}
                                            loading={confirmLoading}
                                            variant={confirmVariant === 'destructive' ? 'destructive' : 'solid'}
                                            className={cn(
                                                styles.confirmButton,
                                                styles.dialogButtonHeight
                                            )}
                                        >
                                            {confirmText}
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Outer content below the card */}
                    {outerFooter ? (
                        <div className={styles.outerFooter}>
                            {outerFooter}
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog >
        );
    }

    return (
        <Drawer
            open={open}
            onOpenChange={internalOnOpenChange}
            dismissible={dismissible}
        >
            {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
            <DrawerContent
                className={styles.drawerContent}
                onOpenAutoFocus={(e) => e.preventDefault()}
                aria-describedby={description ? undefined : undefined}
            >
                <div className={styles.drawerLayout}>
                    <DrawerHeader className={cn(styles.header, styles.drawerHeader)}>
                        <DrawerTitle className={styles.title}>
                            {title || "알림"}
                        </DrawerTitle>
                        {description ? (
                            <DrawerDescription className={styles.description}>
                                {description}
                            </DrawerDescription>
                        ) : null}
                    </DrawerHeader>

                    <div className={cn(styles.content, styles.drawerScrollArea, contentClassName)}>
                        {children ? (
                            <DrawerScrollArea
                                ref={scrollRef}
                                className={className}
                                onScroll={onScroll}
                            >
                                {children}
                            </DrawerScrollArea>
                        ) : null}
                    </div>

                    {hasActions ? (
                        <div className={styles.footer}>
                            {footer || (
                                <>
                                    {showCancel ? (
                                        <Button
                                            variant="ghost"
                                            onClick={handleCancel}
                                            className={cn(styles.cancelButton, styles.drawerButtonHeight)}
                                        >
                                            {cancelText}
                                        </Button>
                                    ) : null}
                                    <Button
                                        onClick={onConfirm}
                                        disabled={confirmDisabled || confirmLoading}
                                        loading={confirmLoading}
                                        variant={confirmVariant === 'destructive' ? 'destructive' : 'solid'}
                                        className={cn(
                                            styles.confirmButton,
                                            styles.drawerButtonHeight
                                        )}
                                    >
                                        {confirmText}
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : null}

                    {/* On Desktop it's outside, on Mobile (Drawer) we put it below the main footer but inside content since it's a sheet */}
                    {outerFooter ? (
                        <div className={cn(styles.outerFooter, 'pb-8 bg-white')}>
                            {outerFooter}
                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
