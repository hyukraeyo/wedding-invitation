"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"
import styles from "./Drawer.module.scss"

const Drawer = ({
    shouldScaleBackground = true,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
    <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        {...props}
    />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn(styles.overlay, className)}
        {...props}
    />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * 🍌 DrawerContent 컴포넌트
 * - aria-hidden 충돌 방지: Drawer가 열릴 때 포커스를 내부로 자동 이동
 * - onOpenAutoFocus를 기본 처리하여 트리거 버튼에 포커스가 남아 있는 것을 방지
 * - 사용처에서 onOpenAutoFocus를 직접 지정하면 해당 핸들러가 우선 적용됨
 */
const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
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

        // 기본 동작: 포커스를 Drawer 내부로 이동하여 aria-hidden 충돌 방지
        event.preventDefault();

        // 내부에서 포커스 가능한 첫 번째 요소를 찾아 포커스
        const focusableElements = contentRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements && focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
        } else {
            // 포커스 가능한 요소가 없으면 콘텐츠 자체에 포커스
            contentRef.current?.focus();
        }
    }, [onOpenAutoFocus]);

    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                ref={combinedRef}
                tabIndex={-1}
                className={cn(styles.content, className)}
                onOpenAutoFocus={handleOpenAutoFocus}
                {...props}
            >
                <div className={styles.handle} />
                {children}
            </DrawerPrimitive.Content>
        </DrawerPortal>
    )
})
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(styles.header, className)}
        {...props}
    />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(styles.footer, className)}
        {...props}
    />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
    />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
        ref={ref}
        className={cn(styles.description, className)}
        {...props}
    />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

const DrawerScrollArea = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(styles.scrollArea, className)}
        {...props}
    >
        {children}
    </div>
))
DrawerScrollArea.displayName = "DrawerScrollArea"

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
    DrawerScrollArea,
}
