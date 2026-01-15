"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"
import { MOTION_CLASSES } from "@/constants/motion"


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
        className={cn(`fixed inset-0 z-50 bg-black/80 ${MOTION_CLASSES.overlay}`, className)}

        {...props}
    />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, onOpenAutoFocus, ...props }, ref) => {
    const contentRef = React.useRef<React.ElementRef<typeof DrawerPrimitive.Content>>(null)

    React.useImperativeHandle(ref, () => contentRef.current as React.ElementRef<typeof DrawerPrimitive.Content>)

    const handleOpenAutoFocus: React.ComponentPropsWithoutRef<
        typeof DrawerPrimitive.Content
    >["onOpenAutoFocus"] = (event) => {
        onOpenAutoFocus?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        contentRef.current?.focus()
    }

    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                ref={contentRef}
                tabIndex={-1}
                onOpenAutoFocus={handleOpenAutoFocus}
                data-side="bottom"
                className={cn(
                    `fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[85vh] flex-col rounded-t-[32px] border bg-background ${MOTION_CLASSES.sheet}`,
                    className
                )}
                {...props}
            >
                {/* Hidden Description for Accessibility */}
                <DrawerPrimitive.Description className="sr-only">
                    Drawer content
                </DrawerPrimitive.Description>
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
        className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
        {...props}
    />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
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
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
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
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

// Custom helper for scrollable content area
const DrawerScrollArea = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2",
            className
        )}
        {...props}
    >
        {children}
    </div>
))
DrawerScrollArea.displayName = "DrawerScrollArea"

const DrawerHandle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Handle>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Handle>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Handle
        ref={ref}
        className={cn("mx-auto mt-4 mb-2 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300", className)}
        {...props}
    />
))
DrawerHandle.displayName = "DrawerHandle"

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
    DrawerHandle,
}

