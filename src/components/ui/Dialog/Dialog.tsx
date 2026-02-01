'use client';

import React, { memo, useMemo, useContext, useCallback, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BottomSheet } from '@/components/ui/BottomSheet';
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
                <BottomSheet.Root {...props}>
                    {children}
                </BottomSheet.Root>
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
    if (isBottomSheet) return <BottomSheet.Trigger {...props} />;
    return <DialogPrimitive.Trigger {...props} />;
});
DialogTrigger.displayName = 'DialogTrigger';

const DialogPortal = memo((props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <BottomSheet.Portal {...props} />;
    return <DialogPrimitive.Portal {...props} />;
});
DialogPortal.displayName = 'DialogPortal';

const DialogClose = memo((props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <BottomSheet.Close {...props} />;
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
            <BottomSheet.Overlay
                ref={ref as React.Ref<HTMLDivElement>}
                className={className}
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
            <BottomSheet.Content
                ref={setRefs as React.Ref<HTMLDivElement>}
                className={className}
                variant="floating"
                onOpenAutoFocus={handleOpenAutoFocus}
                {...props}
            >
                {children}
            </BottomSheet.Content>
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

    if (isBottomSheet) {
        return (
            <BottomSheet.Header
                className={className}
                title={title}
                {...props}
            >
                {!title && children}
            </BottomSheet.Header>
        );
    }

    return (
        <div
            className={cn(styles.header, className)}
            {...props}
        >
            {title ? (
                <DialogPrimitive.Title className={styles.title}>
                    {title}
                </DialogPrimitive.Title>
            ) : null}
            {children}
        </div>
    );
});
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = memo(({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
        return <BottomSheet.Footer className={className} {...props} />;
    }

    return (
        <div
            className={cn(styles.footer, className)}
            {...props}
        />
    );
});
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = memo(React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <BottomSheet.Title ref={ref as React.Ref<HTMLHeadingElement>} className={className} {...props} />;
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
    if (isBottomSheet) {
        // BottomSheet는 Description을 자동으로 처리하므로 null 반환
        return null;
    }
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
    children,
    padding = true,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { padding?: boolean }) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
        return <BottomSheet.Body className={className} {...props}>{children}</BottomSheet.Body>;
    }

    return (
        <div
            className={cn(styles.body, !padding && styles.noPadding, className)}
            {...props}
        >
            {children}
        </div>
    );
});
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
