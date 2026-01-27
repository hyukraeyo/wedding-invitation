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
import { useScrollFade as useScrollFadeHook } from '@/hooks/use-scroll-fade';
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
    scrollRef?: React.Ref<HTMLDivElement>;
    useScrollFade?: boolean;
    drawerVariant?: "default" | "floating";
    padding?: "none" | "default";
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
    scrollRef: externalScrollRef,
    useScrollFade = false,
    drawerVariant = "default",
    padding = "default",
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Desktop Scroll Fade State
    const { setViewportRef, showTopFade, showBottomFade } = useScrollFadeHook<HTMLDivElement>({
        enabled: useScrollFade && isDesktop
    });

    const setMergedRef = React.useCallback((node: HTMLDivElement | null) => {
        setViewportRef(node);
        if (!externalScrollRef) return;

        if (typeof externalScrollRef === 'function') {
            externalScrollRef(node);
        } else {
            // eslint-disable-next-line react-hooks/immutability
            (externalScrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [externalScrollRef, setViewportRef]);

    const handleInternalScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
    }, [onScroll]);

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

    const hasActions = !!onConfirm || !!onCancel || !!footer;

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
                <DialogContent
                    className={cn(styles.dialog, className)}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className={styles.mainSection}>
                        <DialogHeader>
                            <DialogTitle>{title || '알림'}</DialogTitle>
                            {description && (
                                <DialogDescription>
                                    {description}
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        <div
                            className={cn(styles.contentWrapper, useScrollFade && styles.scrollFadeContainer)}
                            data-top-fade={useScrollFade && showTopFade}
                            data-bottom-fade={useScrollFade && showBottomFade}
                        >
                            <div
                                className={cn(
                                    styles.content,
                                    padding === "none" && styles.noPadding,
                                    contentClassName
                                )}
                                onScroll={handleInternalScroll}
                                ref={setMergedRef}
                            >
                                {children}
                            </div>
                        </div>

                        {hasActions && (
                            <div className={styles.footer}>
                                {footer || (
                                    <>
                                        {showCancel && (
                                            <Button
                                                variant="ghost"
                                                onClick={handleCancel}
                                                className={cn(styles.cancelButton, styles.dialogButtonHeight)}
                                            >
                                                {cancelText}
                                            </Button>
                                        )}
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
                        )}
                    </div>

                    {outerFooter && (
                        <div className={styles.outerFooter}>
                            {outerFooter}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer
            open={open}
            onOpenChange={internalOnOpenChange}
            shouldScaleBackground={false}
        >
            {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
            <DrawerContent className={styles.drawerContent} variant={drawerVariant}>
                <div className={styles.drawerLayout}>
                    <div className={styles.mainSection}>
                        <DrawerHeader>
                            <DrawerTitle>
                                {title || '알림'}
                            </DrawerTitle>
                        </DrawerHeader>

                        {description && (
                            <div className={styles.descriptionSpacing}>
                                <DrawerDescription>
                                    {description}
                                </DrawerDescription>
                            </div>
                        )}

                        {!description && (
                            <VisuallyHidden>
                                <DrawerDescription>
                                    {title ? `${title} 모달입니다.` : '모달 콘텐츠 영역입니다.'}
                                </DrawerDescription>
                            </VisuallyHidden>
                        )}

                        {children && (
                            <DrawerScrollArea
                                className={cn(
                                    padding !== "none" && styles.defaultDrawerPadding,
                                    contentClassName
                                )}
                                useScrollFade={useScrollFade}
                                onScroll={onScroll}
                                ref={externalScrollRef}
                                padding={padding}
                            >
                                {children}
                            </DrawerScrollArea>
                        )}
                    </div>

                    {hasActions && (
                        <div className={styles.footer}>
                            {footer || (
                                <>
                                    {showCancel && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleCancel}
                                            className={cn(styles.cancelButton, styles.drawerButtonHeight)}
                                        >
                                            {cancelText}
                                        </Button>
                                    )}
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
                    )}

                    {outerFooter && (
                        <div className={cn(styles.outerFooter, styles.outerFooterMobile)}>
                            {outerFooter}
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
