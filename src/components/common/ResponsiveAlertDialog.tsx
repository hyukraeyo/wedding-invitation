"use client";

import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerHandle,
} from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

interface ResponsiveAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    confirmVariant?: 'default' | 'destructive';
}

export const ResponsiveAlertDialog = ({
    open,
    onOpenChange,
    title,
    description,
    cancelText = '취소',
    confirmText = '확인',
    onConfirm,
    onCancel,
    showCancel = true,
    confirmVariant = 'default',
}: ResponsiveAlertDialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const handleConfirm = () => {
        onConfirm();
    };

    if (isDesktop) {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div>{description}</div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {showCancel && (
                            <AlertDialogCancel onClick={handleCancel}>
                                {cancelText}
                            </AlertDialogCancel>
                        )}
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={confirmVariant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
                        >
                            {confirmText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHandle />
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription asChild>
                        <div>{description}</div>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex-col gap-3 pt-2 pb-8">
                    <Button
                        onClick={handleConfirm}
                        variant={confirmVariant}
                        className="w-full h-12"
                    >
                        {confirmText}
                    </Button>
                    {showCancel && (
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="w-full h-12"
                        >
                            {cancelText}
                        </Button>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
