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
} from "@/components/ui/Dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
} from "@/components/ui/Drawer";
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCanUseDom } from '@/hooks/useCanUseDom';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import styles from './ResponsiveModal.module.scss';

export interface ResponsiveModalProps {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    trigger?: React.ReactNode | undefined;
    title?: React.ReactNode | undefined;
    description?: React.ReactNode | undefined;
    children?: React.ReactNode | undefined;
    footer?: React.ReactNode | undefined;
    outerFooter?: React.ReactNode | undefined;
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
    scrollRef?: (node: HTMLDivElement | null) => void;
    useScrollFade?: boolean;
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
    const hasActions = !!onConfirm || !!footer;

    const internalOnOpenChange = (newOpen: boolean) => {
        if (!dismissible && !newOpen) return;
        onOpenChange?.(newOpen);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    const canUseDOM = useCanUseDom();
    if (!canUseDOM) return null;

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
                <DialogContent
                    className={cn(styles.dialogContent, className)}
                    onInteractOutside={(e) => !dismissible && e.preventDefault()}
                    onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
                >
                    <div className={styles.card}>
                        <div className={styles.mainSection}>
                            <DialogHeader className={styles.header}>
                                <DialogTitle className={styles.title}>
                                    {title || '알림'}
                                </DialogTitle>
                            </DialogHeader>

                            <div
                                className={cn(styles.content, contentClassName)}
                                onScroll={onScroll}
                                ref={scrollRef}
                            >
                                {description ? (
                                    <DialogDescription className={styles.description}>
                                        {description}
                                    </DialogDescription>
                                ) : (
                                    <VisuallyHidden>
                                        <DialogDescription>
                                            {title ? `${title} 모달입니다.` : '모달 콘텐츠 영역입니다.'}
                                        </DialogDescription>
                                    </VisuallyHidden>
                                )}
                                {children}
                            </div>
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
                                            className={cn(styles.confirmButton, styles.dialogButtonHeight)}
                                        >
                                            {confirmText}
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {outerFooter ? (
                        <div className={styles.outerFooter}>
                            {outerFooter}
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
                    <div className={styles.mainSection}>
                        <DrawerHeader className={cn(styles.header, styles.drawerHeader)}>
                            <DrawerTitle className={styles.title}>
                                {title || '알림'}
                            </DrawerTitle>
                        </DrawerHeader>

                        <div
                            className={cn(styles.content, styles.drawerScrollArea, contentClassName)}
                            onScroll={onScroll}
                            ref={scrollRef}
                        >
                            {description ? (
                                <DrawerDescription className={cn(styles.description, styles.descriptionSpacing)}>
                                    {description}
                                </DrawerDescription>
                            ) : (
                                <VisuallyHidden>
                                    <DrawerDescription>
                                        {title ? `${title} 모달입니다.` : '모달 콘텐츠 영역입니다.'}
                                    </DrawerDescription>
                                </VisuallyHidden>
                            )}
                            {children ? (
                                <DrawerScrollArea
                                    className={cn(styles.defaultDrawerPadding, className)}
                                    style={{ overflowY: 'visible' }}
                                >
                                    {children}
                                </DrawerScrollArea>
                            ) : null}
                        </div>
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
                                        className={cn(styles.confirmButton, styles.drawerButtonHeight)}
                                    >
                                        {confirmText}
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : null}

                    {outerFooter ? (
                        <div className={cn(styles.outerFooter, styles.outerFooterMobile)}>
                            {outerFooter}
                        </div>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
