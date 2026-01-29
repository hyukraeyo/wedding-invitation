"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"
import { focusFirstFocusable } from "@/lib/a11y"
import styles from "./Drawer.module.scss"

const Drawer = ({
    shouldScaleBackground = false,
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
 * - variant: 'island' (기본값, 아일랜드 스타일) | 'full' (하단 밀착 스타일)
 * - aria-hidden 충돌 방지: Drawer가 열릴 때 포커스를 내부로 자동 이동
 */
interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
    variant?: "island" | "full";
}

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    DrawerContentProps
>(({ className, children, variant = "island", onOpenAutoFocus, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    // 외부에서 전달된 ref와 내부 ref를 병합
    const combinedRef = React.useCallback((node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [ref]);

    const handleOpenAutoFocus = React.useCallback((event: Event) => {
        if (onOpenAutoFocus) {
            onOpenAutoFocus(event);
            return;
        }
        event.preventDefault();
        focusFirstFocusable(event.currentTarget as HTMLElement);
    }, [onOpenAutoFocus]);

    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                ref={combinedRef}
                tabIndex={-1}
                className={cn(
                    styles.content,
                    variant === "island" ? styles.island : styles.full,
                    className
                )}
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

import { ScrollArea } from "@/components/ui/ScrollArea"

const DrawerScrollArea = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof ScrollArea> & { padding?: "none" | "default" }
>(({ className, children, padding = "default", ...props }, ref) => {
    return (
        <ScrollArea
            ref={ref}
            className={cn(styles.scrollAreaWrapper, className)}
            {...props}
        >
            <div className={cn(styles.scrollAreaInner, padding === "none" && styles.noPadding)}>
                {children}
            </div>
        </ScrollArea>
    )
})
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
