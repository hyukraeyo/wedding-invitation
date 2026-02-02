'use client';

import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { Button } from '../Button';
import styles from './AlertDialog.module.scss';

const AlertDialogRoot = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay ref={ref} className={cn(styles.overlay, className)} {...props} />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    onPointerDownOutside?: (event: CustomEvent<{ originalEvent: PointerEvent }>) => void;
  }
>(({ className, children, onPointerDownOutside, ...props }, ref) => {
  const [isShaking, setIsShaking] = React.useState(false);
  const [isStabilized, setIsStabilized] = React.useState(false);
  const shakeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleInvalidInteraction = (event: Event | React.SyntheticEvent) => {
    event.preventDefault();

    // 애니메이션 재실행을 위한 로직
    setIsShaking(false);
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }

    // 다음 프레임에 애니메이션 실행
    requestAnimationFrame(() => {
      setIsShaking(true);
      setIsStabilized(true); // 흔들림이 시작되면 안정화 모드 진입 (이후 등장 애니메이션 차단)
      shakeTimeoutRef.current = setTimeout(() => {
        setIsShaking(false);
      }, 400);
    });
  };

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay onClick={(e) => handleInvalidInteraction(e)} />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          styles.content,
          isShaking && styles.shake,
          isStabilized && styles.stabilized,
          className
        )}
        // @ts-expect-error - Radix UI 타입 정의와 실제 사용 간의 불일치
        onPointerDownOutside={(e) => {
          handleInvalidInteraction(e);
          onPointerDownOutside?.(e);
        }}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.header, className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.footer, className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn(styles.description, className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} className={cn(className)} {...props} />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// Legacy ConfirmDialog support
interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'primary' | 'danger';
}

const ConfirmDialog = ({
  open = false,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'primary',
}: ConfirmDialogProps) => {
  return (
    <AlertDialogRoot open={open} {...(onOpenChange ? { onOpenChange } : {})}>
      <AlertDialogContent>
        {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
        {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="weak" onClick={onCancel}>
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button color={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Overlay: AlertDialogOverlay,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
});

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  ConfirmDialog,
};
