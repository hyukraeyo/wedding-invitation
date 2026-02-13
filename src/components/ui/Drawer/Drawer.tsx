'use client';

import * as React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { clsx } from 'clsx';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import s from './Drawer.module.scss';

export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerRootProps {
  open?: boolean | undefined;
  onClose?: (() => void) | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  direction?: DrawerDirection | undefined;
  children: React.ReactNode;
}

export interface DrawerContentProps {
  className?: string | undefined;
  variant?: 'default' | 'floating';
  children: React.ReactNode;
}

export interface DrawerProps extends DrawerRootProps {
  header?: React.ReactNode | undefined;
  cta?: React.ReactNode | undefined;
  className?: string | undefined;
  variant?: 'default' | 'floating';
}

const DrawerRoot = ({ open, onClose, onOpenChange, direction = 'bottom', children }: DrawerRootProps) => {
  const handleOpenChange = (val: boolean) => {
    onOpenChange?.(val);
    if (!val) onClose?.();
  };

  return (
    <VaulDrawer.Root
      {...(open !== undefined ? { open } : {})}
      onOpenChange={handleOpenChange}
      direction={direction}
    >
      {children}
    </VaulDrawer.Root>
  );
};

const DrawerPortal = VaulDrawer.Portal;

const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Overlay>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay ref={ref} className={clsx(s.overlay, className)} {...props} />
));
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps & React.ComponentPropsWithoutRef<typeof VaulDrawer.Content>
>(({ className, variant = 'floating', children, ...props }, ref) => {
  const internalRef = React.useRef<HTMLDivElement>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref]
  );

  React.useEffect(() => {
    const preventDragOnSwiper = () => {
      const element = internalRef.current;
      if (!element) return;

      const swipers = element.querySelectorAll('.swiper, .swiper-container');
      swipers.forEach((swiper) => {
        if (!swiper.hasAttribute('data-vaul-no-drag')) {
          swiper.setAttribute('data-vaul-no-drag', 'true');
        }
      });
    };

    preventDragOnSwiper();

    const observer = new MutationObserver(() => preventDragOnSwiper());

    if (internalRef.current) {
      observer.observe(internalRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <VaulDrawer.Content
      ref={setRefs}
      className={clsx(s.content, variant === 'floating' && s.floating, className)}
      {...props}
    >
      <div className={s.wrapper}>
        <div className={s.handle} />
        <VisuallyHidden>
          <VaulDrawer.Title>{props['aria-label'] || 'Drawer'}</VaulDrawer.Title>
          <VaulDrawer.Description>
            {props['aria-describedby'] || 'Drawer description'}
          </VaulDrawer.Description>
        </VisuallyHidden>
        {children}
      </div>
    </VaulDrawer.Content>
  );
});
DrawerContent.displayName = 'DrawerContent';

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string | undefined;
  children?: React.ReactNode;
}

const DrawerHeader = ({ children, className, title, ...props }: DrawerHeaderProps) => (
  <div className={clsx(s.header, className)} {...props}>
    {title && <DrawerTitle>{title}</DrawerTitle>}
    {children}
  </div>
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Title>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Title ref={ref} className={clsx(s.title, className)} {...props} />
));
DrawerTitle.displayName = 'DrawerTitle';

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Description>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Description ref={ref} className={clsx(s.description, className)} {...props} />
));
DrawerDescription.displayName = 'DrawerDescription';

const DrawerBody = ({
  children,
  className,
  padding = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { padding?: boolean }) => (
  <div className={clsx(s.body, !padding && s.noPadding, className)} {...props}>
    {children}
  </div>
);
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(s.footer, className)} {...props}>
    {children}
  </div>
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerClose = VaulDrawer.Close;
const DrawerTrigger = VaulDrawer.Trigger;

const DrawerLegacy = ({
  open,
  onClose,
  onOpenChange,
  children,
  header,
  cta,
  className,
  variant = 'floating',
  direction = 'bottom',
}: DrawerProps) => {
  return (
    <DrawerRoot open={open} onClose={onClose} onOpenChange={onOpenChange} direction={direction}>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent className={className} variant={variant}>
          {header &&
            (typeof header === 'string' ? (
              <DrawerHeader title={header} />
            ) : (
              <DrawerHeader>{header}</DrawerHeader>
            ))}
          {children}
          {cta && <DrawerFooter>{cta}</DrawerFooter>}
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

export const Drawer = Object.assign(DrawerLegacy, {
  Root: DrawerRoot,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
});
