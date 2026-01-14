"use client";

import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/Dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
} from "@/components/ui/Drawer"
import { cn } from '@/lib/utils';

interface ResponsiveModalProps {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    trigger?: React.ReactNode | undefined;
    title?: React.ReactNode | undefined;
    description?: React.ReactNode | undefined;
    children: React.ReactNode;
    className?: string | undefined; // Content class name
}

export const ResponsiveModal = ({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    className
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open as boolean} onOpenChange={onOpenChange as (open: boolean) => void}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className={cn("max-w-md max-h-[85vh] overflow-y-auto", className)}>
                    {(title || description) && (
                        <DialogHeader>
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && <DialogDescription>{description}</DialogDescription>}
                        </DialogHeader>
                    )}
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open as boolean} onOpenChange={onOpenChange as (open: boolean) => void}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                {(title || description) && (
                    <DrawerHeader className="text-left">
                        {title && <DrawerTitle>{title}</DrawerTitle>}
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                )}
                <DrawerScrollArea className={cn("px-4 pb-8", className)}>
                    {children}
                </DrawerScrollArea>
            </DrawerContent>
        </Drawer>
    );
};
