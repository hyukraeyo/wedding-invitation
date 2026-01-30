'use client';

import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { Button } from '../Button';
import styles from './Dialog.module.scss';

interface ConfirmDialogProps {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    title?: string | undefined;
    description?: React.ReactNode;
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    variant?: 'primary' | 'danger' | undefined;
}

export const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    variant = 'primary'
}: ConfirmDialogProps) => {
    // exactOptionalPropertyTypes: true 대응을 위해 임시로 any 캐스팅 사용
    const Root = AlertDialogPrimitive.Root as React.FC<any>;
    return (
        <Root open={open} onOpenChange={onOpenChange}>
            <AlertDialogPrimitive.Portal>
                <AlertDialogPrimitive.Overlay className={styles.overlay} />
                <AlertDialogPrimitive.Content className={styles.content}>
                    {title && (
                        <AlertDialogPrimitive.Title className={styles.title}>
                            {title}
                        </AlertDialogPrimitive.Title>
                    )}
                    {description && (
                        <AlertDialogPrimitive.Description className={styles.description}>
                            {description}
                        </AlertDialogPrimitive.Description>
                    )}
                    <div className={styles.footer}>
                        <AlertDialogPrimitive.Cancel asChild>
                            <Button
                                variant="weak"
                                onClick={onCancel}
                            >
                                {cancelText}
                            </Button>
                        </AlertDialogPrimitive.Cancel>
                        <AlertDialogPrimitive.Action asChild>
                            <Button
                                // @ts-ignore
                                color={variant === 'danger' ? 'red' : 'primary'}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </Button>
                        </AlertDialogPrimitive.Action>
                    </div>
                </AlertDialogPrimitive.Content>
            </AlertDialogPrimitive.Portal>
        </Root>
    );
};

export const AlertDialog = ConfirmDialog;
