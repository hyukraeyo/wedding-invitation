"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { focusFirstFocusable } from "@/lib/a11y"
import styles from "./Dialog.module.scss"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(styles.overlay, className)}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * 🍌 DialogContent 컴포넌트
 * - aria-hidden 충돌 방지: Dialog가 열릴 때 포커스를 내부로 자동 이동
 * - onOpenAutoFocus를 기본 처리하여 트리거 버튼에 포커스가 남아 있는 것을 방지
 * - 사용처에서 onOpenAutoFocus를 직접 지정하면 해당 핸들러가 우선 적용됨
 */
const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, onOpenAutoFocus, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null);

    // 외부에서 전달된 ref와 내부 ref를 병합
    const combinedRef = React.useCallback((node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    }, [ref]);

    const handleOpenAutoFocus = React.useCallback((event: Event) => {
        // 사용자가 직접 onOpenAutoFocus를 전달한 경우 해당 핸들러 실행
        if (onOpenAutoFocus) {
            onOpenAutoFocus(event);
            return;
        }

        // 기본 동작: 포커스를 Dialog 내부로 이동하여 aria-hidden 충돌 방지
        event.preventDefault();
        focusFirstFocusable(event.currentTarget as HTMLElement);
    }, [onOpenAutoFocus]);

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={combinedRef}
                tabIndex={-1}
                className={cn(styles.content, className)}
                aria-describedby={undefined}
                onOpenAutoFocus={handleOpenAutoFocus}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.header, className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.footer, className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn(styles.description, className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
