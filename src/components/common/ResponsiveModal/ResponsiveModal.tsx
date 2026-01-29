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
import { BottomCTA } from '@/components/ui/BottomCTA';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCanUseDom } from '@/hooks/useCanUseDom';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { ScrollArea } from '@/components/ui/ScrollArea';
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
    confirmVariant?: 'primary' | 'danger' | 'light' | 'dark' | undefined;
    confirmDisabled?: boolean | undefined;
    confirmLoading?: boolean | undefined;
    dismissible?: boolean;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    scrollRef?: React.Ref<HTMLDivElement>;
    useScrollFade?: boolean;
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
    confirmVariant = 'primary',
    confirmDisabled = false,
    confirmLoading = false,
    dismissible = true,
    onScroll,
    scrollRef: externalScrollRef,
    useScrollFade = false,
    padding = "default",
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

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
                    className={cn(styles.dialogContent, className)}
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

                        <ScrollArea
                            className={cn(styles.contentWrapper, contentClassName)}
                            useScrollFade={useScrollFade}
                            onScroll={handleInternalScroll}
                            viewportRef={externalScrollRef ?? null}
                        >
                            <div className={cn(styles.content, padding === "none" && styles.noPadding)}>
                                {children}
                            </div>
                        </ScrollArea>

                        {hasActions && (
                            <div className={styles.footer}>
                                {footer || (
                                    showCancel ? (
                                        <BottomCTA.Double
                                            fixed={false}
                                            rightButton={
                                                <Button
                                                    onClick={onConfirm}
                                                    disabled={confirmDisabled || confirmLoading}
                                                    loading={confirmLoading}
                                                    color={confirmVariant === 'danger' ? 'danger' : 'primary'}
                                                    variant="fill"
                                                    size="large"
                                                    style={{ width: '100%' }}
                                                >
                                                    {confirmText}
                                                </Button>
                                            }
                                            leftButton={
                                                <Button
                                                    onClick={handleCancel}
                                                    variant="weak"
                                                    color="primary"
                                                    size="large"
                                                    style={{ width: '100%' }}
                                                >
                                                    {cancelText}
                                                </Button>
                                            }
                                        />
                                    ) : (
                                        <BottomCTA.Single
                                            fixed={false}
                                            // @ts-expect-error - TDS BottomCTA might have slightly different prop names in type definition
                                            onClick={onConfirm}
                                            disabled={confirmDisabled || confirmLoading}
                                            loading={confirmLoading}
                                            color={confirmVariant === 'danger' ? 'danger' : 'primary'}
                                            variant="fill"
                                            size="large"
                                        >
                                            {confirmText}
                                        </BottomCTA.Single>
                                    )
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
            <DrawerContent className={className}>
                <DrawerHeader>
                    <DrawerTitle>
                        {title || '알림'}
                    </DrawerTitle>
                    {description && (
                        <DrawerDescription>
                            {description}
                        </DrawerDescription>
                    )}
                </DrawerHeader>

                {!description && (
                    <VisuallyHidden>
                        <DrawerDescription>
                            {title ? `${title} 모달입니다.` : '모달 콘텐츠 영역입니다.'}
                        </DrawerDescription>
                    </VisuallyHidden>
                )}

                {children && (
                    <DrawerScrollArea
                        className={contentClassName}
                        useScrollFade={useScrollFade}
                        onScroll={handleInternalScroll}
                        ref={externalScrollRef}
                        padding={padding}
                    >
                        {children}
                    </DrawerScrollArea>
                )}

                {hasActions && (
                    <div className={styles.footer}>
                        {footer || (
                            showCancel ? (
                                <BottomCTA.Double
                                    fixed={false}
                                    rightButton={
                                        <Button
                                            onClick={onConfirm}
                                            disabled={confirmDisabled || confirmLoading}
                                            loading={confirmLoading}
                                            color={confirmVariant === 'danger' ? 'danger' : 'primary'}
                                            variant="fill"
                                            size="large"
                                            style={{ width: '100%' }}
                                        >
                                            {confirmText}
                                        </Button>
                                    }
                                    leftButton={
                                        <Button
                                            onClick={handleCancel}
                                            variant="weak"
                                            color="primary"
                                            size="large"
                                            style={{ width: '100%' }}
                                        >
                                            {cancelText}
                                        </Button>
                                    }
                                />
                            ) : (
                                <BottomCTA.Single
                                    fixed={false}
                                    // @ts-expect-error - TDS BottomCTA might have slightly different prop names in type definition
                                    onClick={onConfirm}
                                    disabled={confirmDisabled || confirmLoading}
                                    loading={confirmLoading}
                                    color={confirmVariant === 'danger' ? 'danger' : 'primary'}
                                    variant="fill"
                                    size="large"
                                >
                                    {confirmText}
                                </BottomCTA.Single>
                            )
                        )}
                    </div>
                )}

                {outerFooter && (
                    <div className={cn(styles.outerFooter, styles.outerFooterMobile)}>
                        {outerFooter}
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
};
