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
    DialogFooter,
} from "@/components/ui/Dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerScrollArea,
    DrawerFooter,
} from "@/components/ui/Drawer"
import { Button } from "@/components/ui/Button";
import { cn } from '@/lib/utils';

export interface ResponsiveModalProps {
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    trigger?: React.ReactNode | undefined;
    title?: React.ReactNode | undefined;
    description?: React.ReactNode | undefined;
    children?: React.ReactNode | undefined;
    className?: string | undefined;

    // Alert/Confirm 모드 (children 없이 버튼만 표시)
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    showCancel?: boolean | undefined;
    confirmVariant?: 'default' | 'destructive' | undefined;
}

/**
 * shadcn/ui 기반의 반응형 모달 컴포넌트.
 * 데스크톱에서는 Dialog(Radix UI), 모바일에서는 Drawer(Vaul)를 사용합니다.
 * 접근성(A11y) 가이드에 따라 Title과 Description을 관리합니다.
 */
export const ResponsiveModal = ({
    open = false,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    className,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    showCancel = true,
    confirmVariant = 'default',
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const isAlertMode = !children && onConfirm;

    // Radix UI와 Vaul의 strict한 타입 처리를 위한 핸들러
    const internalOnOpenChange = (newOpen: boolean) => {
        onOpenChange?.(newOpen);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    const handleConfirm = () => {
        onConfirm?.();
    };

    const FooterButtons = ({ type }: { type: 'dialog' | 'drawer' }) => {
        if (!isAlertMode) return null;

        return (
            <div className={cn(
                "flex gap-3 mt-4",
                type === 'dialog' ? "justify-end sm:gap-2" : "flex-col pb-8"
            )}>
                {showCancel && (
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className={cn(type === 'drawer' && "w-full h-12")}
                    >
                        {cancelText}
                    </Button>
                )}
                <Button
                    variant={confirmVariant}
                    onClick={handleConfirm}
                    className={cn(type === 'drawer' && "w-full h-12")}
                >
                    {confirmText}
                </Button>
            </div>
        );
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className={cn("max-w-md max-h-[85vh] overflow-y-auto", className)}>
                    <DialogHeader>
                        {/* 접근성: 제목이 누락된 경우를 대비해 스크린 리더용 제목 처리 고려 */}
                        <DialogTitle>{title || "알림"}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    {children && <div className="py-2">{children}</div>}
                    <FooterButtons type="dialog" />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={internalOnOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title || "알림"}</DrawerTitle>
                    {description && <DrawerDescription>{description}</DrawerDescription>}
                </DrawerHeader>
                {children ? (
                    <DrawerScrollArea className={className}>
                        {children}
                    </DrawerScrollArea>
                ) : (
                    <div className="px-4">
                        <FooterButtons type="drawer" />
                    </div>
                )}
                {children && <div className="px-4"><FooterButtons type="drawer" /></div>}
            </DrawerContent>
        </Drawer>
    );
};
