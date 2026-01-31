'use client';

import React, { memo, useMemo, useContext, useCallback, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Drawer } from 'vaul';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import styles from './Dialog.module.scss';

interface DialogContextValue {
    isBottomSheet: boolean;
}

const DialogContext = React.createContext<DialogContextValue>({ isBottomSheet: false });

interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
    mobileBottomSheet?: boolean;
}

const DialogRoot = ({
    children,
    mobileBottomSheet = false,
    ...props
}: DialogProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isBottomSheet = mobileBottomSheet && isMobile;

    const value = useMemo(() => ({ isBottomSheet }), [isBottomSheet]);

    if (isBottomSheet) {
        return (
            <DialogContext.Provider value={value}>
                <Drawer.Root {...props}>
                    {children}
                </Drawer.Root>
            </DialogContext.Provider>
        );
    }

    return (
        <DialogContext.Provider value={value}>
            <DialogPrimitive.Root {...props}>
                {children}
            </DialogPrimitive.Root>
        </DialogContext.Provider>
    );
};

const DialogTrigger = memo((props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <Drawer.Trigger {...props} />;
    return <DialogPrimitive.Trigger {...props} />;
});
DialogTrigger.displayName = 'DialogTrigger';

const DialogPortal = memo((props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <Drawer.Portal {...props} />;
    return <DialogPrimitive.Portal {...props} />;
});
DialogPortal.displayName = 'DialogPortal';

const DialogClose = memo((props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <Drawer.Close {...props} />;
    return <DialogPrimitive.Close {...props} />;
});
DialogClose.displayName = 'DialogClose';

const DialogOverlay = memo(React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
        return (
            <Drawer.Overlay
                ref={ref as React.Ref<HTMLDivElement>}
                className={cn(styles.overlay, className)}
                {...props}
            />
        );
    }

    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(styles.overlay, className)}
            {...props}
        />
    );
}));
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = memo(React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);
    const internalRef = useRef<HTMLDivElement>(null);

    const setRefs = useCallback((node: HTMLDivElement | null) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [ref]);

    const handleOpenAutoFocus = useCallback((event: Event) => {
        event.preventDefault();
        const focusableElements = internalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length) {
            (focusableElements[0] as HTMLElement).focus();
        }
    }, []);

    if (isBottomSheet) {
        return (
            <Drawer.Content
                ref={setRefs as React.Ref<HTMLDivElement>}
                className={cn(styles.bottomSheetContent, className)}
                onOpenAutoFocus={handleOpenAutoFocus}
                {...props}
            >
                <div className={styles.handle} />
                <Drawer.Description className="sr-only">
                    {props['aria-describedby'] || 'Dialog description'}
                </Drawer.Description>
                {children}
            </Drawer.Content>
        );
    }

    return (
        <DialogPrimitive.Content
            ref={setRefs}
            className={cn(styles.content, styles.dialogContent, className)}
            onOpenAutoFocus={handleOpenAutoFocus}
            {...props}
            aria-describedby={props['aria-describedby'] || undefined}
        >
            <DialogPrimitive.Description className="sr-only">
                {props['aria-describedby'] || 'Dialog description'}
            </DialogPrimitive.Description>
            {children}
        </DialogPrimitive.Content>
    );
}));
DialogContent.displayName = 'DialogContent';

const DialogHeader = memo(({
    className,
    title,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string }) => {
    const { isBottomSheet } = useContext(DialogContext);

    return (
        <div
            className={cn(styles.header, isBottomSheet && styles.bottomSheetHeader, className)}
            {...props}
        >
            {title && (
                isBottomSheet ? (
                    <Drawer.Title className={styles.title}>{title}</Drawer.Title>
                ) : (
                    <DialogPrimitive.Title className={styles.title}>
                        {title}
                    </DialogPrimitive.Title>
                )
            )}
            {children}
        </div>
    );
});
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = memo(({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(styles.footer, className)}
        {...props}
    />
));
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = memo(React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <Drawer.Title ref={ref as React.Ref<HTMLHeadingElement>} className={cn(styles.title, className)} {...props} />;
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn(styles.title, className)}
            {...props}
        />
    );
}));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = memo(React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <Drawer.Description ref={ref as React.Ref<HTMLParagraphElement>} className={cn(styles.description, className)} {...props} />;
    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn(styles.description, className)}
            {...props}
        />
    );
}));
DialogDescription.displayName = 'DialogDescription';

const DialogBody = memo(({
    className,
    padding = true,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { padding?: boolean }) => (
    <div
        className={cn(styles.body, !padding && styles.noPadding, className)}
        {...props}
    />
));
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
