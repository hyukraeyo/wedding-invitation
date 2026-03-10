'use client';

import React, { memo, useMemo, useContext, useCallback, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Drawer } from '@/components/ui/Drawer';
import type { DrawerDirection } from '@/components/ui/Drawer';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { handleOpenAutoFocusFallback } from './focusManagement';
import styles from './Dialog.module.scss';

interface DialogContextValue {
  isBottomSheet: boolean;
  fullScreen: boolean;
  bottomSheetDirection: DrawerDirection;
  container: HTMLElement | null;
  type?: 'default' | 'fullScreen';
}

const DialogContext = React.createContext<DialogContextValue>({
  isBottomSheet: false,
  fullScreen: false,
  bottomSheetDirection: 'bottom',
  container: null,
  type: 'default',
});

interface DialogProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
    Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'asChild'> {
  mobileBottomSheet?: boolean | undefined;
  mobileBottomSheetDirection?: DrawerDirection | undefined;
  fullScreen?: boolean | undefined;
  type?: 'default' | 'fullScreen' | undefined;
  surface?: 'default' | 'muted' | undefined;
  container?: HTMLElement | null | undefined;
}

const hasDialogComposedPattern = (children: React.ReactNode): boolean => {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;

    const childType = child.type as { displayName?: string; name?: string };
    const childName = childType.displayName ?? childType.name;
    if (
      childName === 'DialogTrigger' ||
      childName === 'DialogContent' ||
      childName === 'DialogPortal'
    ) {
      return true;
    }

    return hasDialogComposedPattern((child.props as { children?: React.ReactNode }).children);
  });
};

const DialogRoot = ({
  children,
  mobileBottomSheet = false,
  mobileBottomSheetDirection = 'bottom',
  fullScreen = false,
  type = 'default',
  surface = 'default',
  container,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  ...contentProps
}: DialogProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isBottomSheet = !fullScreen && mobileBottomSheet && isMobile;

  const value = useMemo(
    () => ({
      isBottomSheet,
      fullScreen,
      bottomSheetDirection: mobileBottomSheetDirection,
      container: container ?? null,
      type,
    }),
    [isBottomSheet, fullScreen, mobileBottomSheetDirection, container, type]
  );
  const useComposedPattern = hasDialogComposedPattern(children);
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
        <Drawer.Root {...rootProps} direction={mobileBottomSheetDirection}>
          {dialogChildren}
        </Drawer.Root>
      </DialogContext.Provider>
    );
  }

  return (
    <DialogContext.Provider value={value}>
      <DialogPrimitive.Root {...rootProps}>{dialogChildren}</DialogPrimitive.Root>
    </DialogContext.Provider>
  );
};

const DialogTrigger = memo(
  (props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) return <Drawer.Trigger {...props} />;
    return <DialogPrimitive.Trigger {...props} />;
  }
);
DialogTrigger.displayName = 'DialogTrigger';

const DialogClose = memo((props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) => {
  const { isBottomSheet } = useContext(DialogContext);
  if (isBottomSheet) return <Drawer.Close {...props} />;
  return <DialogPrimitive.Close {...props} />;
});
DialogClose.displayName = 'DialogClose';

const DialogOverlay = memo(
  React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
  >(({ className, ...props }, ref) => {
    const { isBottomSheet, type } = useContext(DialogContext);

    if (isBottomSheet) {
      return (
        <Drawer.Overlay ref={ref as React.Ref<HTMLDivElement>} className={className} {...props} />
      );
    }

    return (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(styles.overlay, type === 'fullScreen' && styles.overlayFullScreen, className)}
        {...props}
      />
    );
  })
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogPortal = memo(
  ({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => {
    const { isBottomSheet, container } = useContext(DialogContext);
    const portalContainer = props.container ?? container ?? undefined;

    if (isBottomSheet) {
      return (
        <Drawer.Portal {...props} container={portalContainer}>
          <DialogOverlay />
          {children}
        </Drawer.Portal>
      );
    }

    return (
      <DialogPrimitive.Portal {...props} container={portalContainer}>
        <DialogOverlay />
        {children}
      </DialogPrimitive.Portal>
    );
  }
);
DialogPortal.displayName = 'DialogPortal';

const DialogContent = memo(
  React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
      surface?: 'default' | 'muted' | undefined;
    }
  >(({ className, children, surface = 'default', onOpenAutoFocus, ...props }, ref) => {
    const { isBottomSheet, fullScreen, bottomSheetDirection, type } = useContext(DialogContext);
    const internalRef = useRef<HTMLDivElement>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleOpenAutoFocus = useCallback(
      (event: Event) => {
        handleOpenAutoFocusFallback(event, internalRef.current, {
          onOpenAutoFocus,
        });
      },
      [onOpenAutoFocus]
    );

    const content = isBottomSheet ? (
      <Drawer.Content
        ref={setRefs as React.Ref<HTMLDivElement>}
        variant={bottomSheetDirection === 'bottom' ? 'floating' : 'default'}
        {...props}
        className={className}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        {children}
      </Drawer.Content>
    ) : (
      <DialogPrimitive.Content
        ref={setRefs}
        {...props}
        className={cn(
          styles.content,
          styles.dialogContent,
          fullScreen && styles.fullPageRight,
          type === 'fullScreen' && styles.fullScreenType,
          surface === 'muted' && styles.surfaceMuted,
          className
        )}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        {/* Accessibility: Always provide Title and Description */}
        {!children?.toString().includes('DialogTitle') &&
          !children?.toString().includes('DialogHeader') && (
            <VisuallyHidden>
              <DialogPrimitive.Title>{props['aria-label'] || 'Dialog'}</DialogPrimitive.Title>
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

    return <DialogPortal>{content}</DialogPortal>;
  })
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = memo(
  ({
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
        <Drawer.Header className={className} title={title} {...props}>
          {children}
        </Drawer.Header>
      );

      return visuallyHidden ? <VisuallyHidden>{headerContent}</VisuallyHidden> : headerContent;
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
          <DialogPrimitive.Title className={styles.title}>{title}</DialogPrimitive.Title>
        ) : null}
        {children}
      </div>
    );

    return visuallyHidden ? <VisuallyHidden>{headerContent}</VisuallyHidden> : headerContent;
  }
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isBottomSheet } = useContext(DialogContext);

  if (isBottomSheet) {
    return <Drawer.Footer className={className} {...props} />;
  }

  return <div className={cn(styles.footer, className)} {...props} />;
});
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = memo(
  React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
  >(({ className, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet)
      return (
        <Drawer.Title ref={ref as React.Ref<HTMLHeadingElement>} className={className} {...props} />
      );
    return <DialogPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />;
  })
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = memo(
  React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
  >(({ className, ...props }, ref) => {
    const { isBottomSheet } = useContext(DialogContext);
    if (isBottomSheet) {
      return (
        <Drawer.Description
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
  })
);
DialogDescription.displayName = 'DialogDescription';

const DialogBody = memo(
  ({
    className,
    children,
    padding = true,
    scrollable = true,
    align = 'left',
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    padding?: boolean | undefined;
    scrollable?: boolean | undefined;
    align?: 'left' | 'center' | 'right' | undefined;
  }) => {
    const { isBottomSheet } = useContext(DialogContext);

    if (isBottomSheet) {
      return (
        <Drawer.Body
          className={cn(!scrollable && styles.bodyStatic, className)}
          padding={padding}
          {...props}
        >
          {children}
        </Drawer.Body>
      );
    }

    return (
      <div
        className={cn(
          styles.body,
          !padding && styles.noPadding,
          !scrollable && styles.bodyStatic,
          align === 'center' && styles.bodyCenter,
          align === 'right' && styles.bodyRight,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
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
