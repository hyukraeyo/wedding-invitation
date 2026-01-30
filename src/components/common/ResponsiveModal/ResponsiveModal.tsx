"use client";

import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

import { BottomSheet as Drawer } from "@/components/ui/BottomSheet";
import { BottomCTA } from '@/components/ui/BottomCTA';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCanUseDom } from '@/hooks/useCanUseDom';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { ScrollArea } from '@/components/ui/ScrollArea';
import styles from './ResponsiveModal.module.scss';
import { Modal } from '@/components/ui/Modal';

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
            <>
                {trigger && React.cloneElement(trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
                    onClick: (e: React.MouseEvent) => {
                        (trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>).props.onClick?.(e);
                        internalOnOpenChange(true);
                    }
                })}
                <Modal open={open} onOpenChange={(val: boolean) => internalOnOpenChange(val)}>
                    <div
                        className={cn(styles.dialogContent, className)}
                    >
                        <div className={styles.mainSection}>
                            <div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>{title || '알림'}</h2>
                                {description && (
                                    <p style={{ fontSize: '0.875rem', color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
                                        {description}
                                    </p>
                                )}
                            </div>

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
                    </div>
                </Modal>
            </>
        );
    }

    return (
        <Drawer
            open={open}
            onClose={() => internalOnOpenChange(false)}
            header={
                <div className={styles.headerWrapper}>
                    <div className={styles.headerTitle}>{title || '알림'}</div>
                    {description && (
                        <div className={styles.headerDescription}>
                            {description}
                        </div>
                    )}
                </div>
            }
            cta={hasActions ? (
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
            ) : undefined}
        >
            {trigger ? React.cloneElement(trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
                onClick: (e: React.MouseEvent) => {
                    (trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>).props.onClick?.(e);
                    internalOnOpenChange(true);
                }
            }) : null}

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
        </Drawer>
    );
};
