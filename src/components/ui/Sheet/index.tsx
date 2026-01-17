"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./styles.module.scss"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        className={cn(styles.overlay, className)}
        {...props}
        ref={ref}
    />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
    side?: "top" | "bottom" | "left" | "right"
}

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(({ side = "right", className, children, onOpenAutoFocus, ...props }, ref) => {
    const contentRef = React.useRef<React.ElementRef<typeof SheetPrimitive.Content>>(null)

    React.useImperativeHandle(ref, () => contentRef.current as React.ElementRef<typeof SheetPrimitive.Content>)

    const handleOpenAutoFocus: React.ComponentPropsWithoutRef<
        typeof SheetPrimitive.Content
    >["onOpenAutoFocus"] = (event) => {
        onOpenAutoFocus?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        contentRef.current?.focus()
    }

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={contentRef}
                tabIndex={-1}
                onOpenAutoFocus={handleOpenAutoFocus}
                data-side={side}
                className={cn(
                    styles.content,
                    styles[`content--side-${side}`],
                    className
                )}
                {...props}
            >
                {children}
                <SheetPrimitive.Close className={styles.close}>
                    <X size={18} />
                    <span className={styles.srOnly}>Close</span>
                </SheetPrimitive.Close>
            </SheetPrimitive.Content>
        </SheetPortal>
    )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(styles.header, className)}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(styles.footer, className)}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
    />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn(styles.description, className)}
        {...props}
    />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
