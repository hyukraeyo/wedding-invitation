'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import styles from './Dialog.module.scss';

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(styles.overlay, className)}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
        (internalRef as any).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
    }, [ref]);

    const handleOpenAutoFocus = (event: Event) => {
        event.preventDefault();
        const focusableElements = internalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length) {
            (focusableElements[0] as HTMLElement).focus();
        }
    };

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={setRefs}
                className={cn(styles.content, className)}
                onOpenAutoFocus={handleOpenAutoFocus}
                {...props}
                aria-describedby={props['aria-describedby'] || undefined}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    title,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string }) => (
    <div
        className={cn(styles.header, className)}
        {...props}
    >
        {title && (
            <DialogPrimitive.Title className={styles.title}>
                {title}
            </DialogPrimitive.Title>
        )}
        {children}
    </div>
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(styles.footer, className)}
        {...props}
    />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn(styles.description, className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = ({
    className,
    padding = true,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { padding?: boolean }) => (
    <div
        className={cn(styles.body, !padding && styles.noPadding, className)}
        {...props}
    />
);
DialogBody.displayName = 'DialogBody';

const Dialog = Object.assign(DialogRoot, {
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Header: DialogHeader,
    Footer: DialogFooter,
    Title: DialogTitle,
    Description: DialogDescription,
    Body: DialogBody,
    Close: DialogClose,
});

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogBody,
};
