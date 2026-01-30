'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import styles from './Modal.module.scss';

interface ModalProps extends Omit<DialogPrimitive.DialogProps, 'open' | 'onOpenChange'> {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
}

const Root = DialogPrimitive.Root;

const ModalMain = ({ children, open, onOpenChange, ...props }: ModalProps) => {
    return (
        <Root open={!!open} {...(onOpenChange && { onOpenChange })} {...props}>
            {children}
        </Root>
    );
};

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(styles.overlay, className)}
            {...props}
        />
    </DialogPrimitive.Portal>
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Content
            ref={ref}
            className={cn(styles.content, className)}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({ title, children, className }: { title?: string | undefined; children?: React.ReactNode; className?: string | undefined }) => (
    <div className={cn(styles.header, className)}>
        {title && <DialogPrimitive.Title className={styles.title}>{title}</DialogPrimitive.Title>}
        {children}
    </div>
);

const ModalBody = ({ children, className }: { children: React.ReactNode; className?: string | undefined }) => (
    <div className={cn(styles.body, className)}>
        {children}
    </div>
);

const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string | undefined }) => (
    <div className={cn(styles.footer, className)}>
        {children}
    </div>
);

export const Modal = Object.assign(
    ModalMain,
    {
        Overlay: ModalOverlay,
        Content: ModalContent,
        Header: ModalHeader,
        Body: ModalBody,
        Footer: ModalFooter,
        Close: DialogPrimitive.Close,
        Trigger: DialogPrimitive.Trigger,
    }
);

ModalMain.displayName = 'Modal';
ModalHeader.displayName = 'Modal.Header';
ModalBody.displayName = 'Modal.Body';
ModalFooter.displayName = 'Modal.Footer';
