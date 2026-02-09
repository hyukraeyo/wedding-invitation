'use client';

import React, { memo, useMemo, useContext, useCallback, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import styles from './Dialog.module.scss';

interface DialogContextValue {
    isBottomSheet: boolean;
    fullScreen: boolean;
}

const DialogContext = React.createContext<DialogContextValue>({ isBottomSheet: false, fullScreen: false });

interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
    Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'asChild'> {
    mobileBottomSheet?: boolean | undefined;
    fullScreen?: boolean | undefined;
    surface?: 'default' | 'muted' | undefined;
}

const hasDialogTrigger = (children: React.ReactNode): boolean => {
    return React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) return false;

        const childType = child.type as { displayName?: string; name?: string };
        const childName = childType.displayName ?? childType.name;
        if (childName === 'DialogTrigger') {
            return true;
        }

        return hasDialogTrigger((child.props as { children?: React.ReactNode }).children);
    });
};

const DialogRoot = ({
    children,
    mobileBottomSheet = false,
    fullScreen = false,
    surface = 'default',
    open,
    defaultOpen,
    onOpenChange,
    modal,
    ...contentProps
}: DialogProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isBottomSheet = !fullScreen && mobileBottomSheet && isMobile;

    const value = useMemo(() => ({ isBottomSheet, fullScreen }), [isBottomSheet, fullScreen]);
    const useComposedPattern = hasDialogTrigger(children);
    const dialogChildren = useComposedPattern ? (
        children
    ) : (
        <DialogContent surface={surface} {...contentProps}>
            {children}
        </DialogContent>
    );

    // exactOptionalPropertyTypes: true fix
    // We must not pass explicit undefined for optional props
    const rootProps = {
        ...(open !== undefined && { open }),
        ...(defaultOpen !== undefined && { defaultOpen }),
        ...(onOpenChange !== undefined && { onOpenChange }),
        ...(modal !== undefined && { modal }),
    };

    if (isBottomSheet) {
        return (
            <DialogContext.Provider value={value}>
                <BottomSheet.Root {...rootProps}>
                    {dialogChildren}
                </BottomSheet.Root>
            </DialogContext.Provider>
        );
    }

    return (
        <DialogContext.Provider value={value}>
            <DialogPrimitive.Root {...rootProps}>
                {dialogChildren}
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

const DialogPortal = memo(({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
        return (
            <BottomSheet.Portal {...props}>
                <DialogOverlay />
                {children}
            </BottomSheet.Portal>
        );
    }

    return (
        <DialogPrimitive.Portal {...props}>
            <DialogOverlay />
            {children}
        </DialogPrimitive.Portal>
    );
});
DialogPortal.displayName = 'DialogPortal';

const FOCUSABLE_SELECTOR = [
    'button:not([disabled])',
    '[href]:not([aria-disabled="true"])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ');

const DialogContent = memo(React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        surface?: 'default' | 'muted' | undefined;
    }
>(({ className, children, surface = 'default', ...props }, ref) => {
    const { isBottomSheet, fullScreen } = useContext(DialogContext);
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
        const contentElement = internalRef.current;
        if (!contentElement) return;

        const firstFocusableElement = Array.from(
            contentElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).find((element) => {
            if (element.getAttribute('aria-hidden') === 'true') return false;
            if (element.closest('[aria-hidden="true"]')) return false;
            if (element.closest('[inert]')) return false;
            return true;
        });

        if (firstFocusableElement) {
            firstFocusableElement.focus({ preventScroll: true });
            return;
        }

        if (!contentElement.hasAttribute('tabindex')) {
            contentElement.setAttribute('tabindex', '-1');
        }
        contentElement.focus({ preventScroll: true });
    }, []);
    const content = isBottomSheet ? (
        <BottomSheet.Content
            ref={setRefs as React.Ref<HTMLDivElement>}
            className={className}
            variant="floating"
            onOpenAutoFocus={handleOpenAutoFocus}
            {...props}
        >
            {children}
        </BottomSheet.Content>
    ) : (
        <DialogPrimitive.Content
            ref={setRefs}
            className={cn(
                styles.content,
                styles.dialogContent,
                fullScreen && styles.fullPageRight,
                surface === 'muted' && styles.surfaceMuted,
                className
            )}
            onOpenAutoFocus={handleOpenAutoFocus}
            {...props}
        >
            {/* Accessibility: Always provide Title and Description */}
            {!children?.toString().includes('DialogTitle') && !children?.toString().includes('DialogHeader') && (
                <VisuallyHidden>
                    <DialogPrimitive.Title>
                        {props['aria-label'] || 'Dialog'}
                    </DialogPrimitive.Title>
                </VisuallyHidden>
            )}
            <VisuallyHidden>
                <DialogPrimitive.Description>
                    {props['aria-describedby'] || 'Dialog description'}
                </DialogPrimitive.Description>
            </VisuallyHidden>
            {children}
        </DialogPrimitive.Content>
    );

    return (
        <DialogPortal>
            {content}
        </DialogPortal>
    );
}));
DialogContent.displayName = 'DialogContent';

const DialogHeader = memo(({
    className,
    title,
    children,
    visuallyHidden,
    divider = false,
    padding = 'default',
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    title?: string | undefined;
    visuallyHidden?: boolean | undefined;
    divider?: boolean | undefined;
    padding?: 'default' | 'compact' | undefined;
}) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
        const headerContent = (
            <BottomSheet.Header
                className={className}
                title={title}
                {...props}
            >
                {children}
            </BottomSheet.Header>
        );

        return visuallyHidden ? (
            <VisuallyHidden>{headerContent}</VisuallyHidden>
        ) : headerContent;
    }

    const headerContent = (
        <div
            className={cn(
                styles.header,
                divider && styles.headerWithDivider,
                padding === 'compact' && styles.headerCompact,
                className
            )}
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

    return visuallyHidden ? (
        <VisuallyHidden>{headerContent}</VisuallyHidden>
    ) : headerContent;
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
        return (
            <BottomSheet.Description
                ref={ref as React.Ref<HTMLParagraphElement>}
                className={className}
                {...props}
            />
        );
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
    align = 'left',
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    padding?: boolean | undefined;
    align?: 'left' | 'center' | 'right' | undefined;
}) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
        return <BottomSheet.Body className={className} padding={padding} {...props}>{children}</BottomSheet.Body>;
    }

    return (
        <div
            className={cn(
                styles.body,
                !padding && styles.noPadding,
                align === 'center' && styles.bodyCenter,
                align === 'right' && styles.bodyRight,
                className
            )}
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
