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
    DrawerClose,
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

    // 공통 버튼 렌더러
    const renderButtons = (mode: 'dialog' | 'drawer') => {
        if (!isAlertMode) return null;

        return (
            <>
                <Button
                    variant={confirmVariant}
                    onClick={handleConfirm}
                    className={cn(mode === 'drawer' && "w-full h-12")}
                >
                    {confirmText}
                </Button>
                {showCancel && (
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className={cn(mode === 'drawer' && "w-full h-12")}
                    >
                        {cancelText}
                    </Button>
                )}
            </>
        );
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={internalOnOpenChange}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className={cn("max-w-md max-h-[85vh] overflow-y-auto", className)}>
                    <DialogHeader>
                        <DialogTitle>{title || "알림"}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    {children && <div className="py-2">{children}</div>}
                    {isAlertMode && (
                        <DialogFooter className="gap-2">
                            {renderButtons('dialog')}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={internalOnOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                {/* shadcn 공식 예제 구조: 중앙 정렬 컨테이너 */}
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{title || "알림"}</DrawerTitle>
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>

                    {children ? (
                        <>
                            <DrawerScrollArea className={className}>
                                {children}
                            </DrawerScrollArea>
                            {/* children이 있을 때 footer는 선택적일 수 있지만, AlertMode가 아닐 때도 있을 수 있음 */}
                        </>
                    ) : (
                        <div className="p-4">
                            {/* AlertMode일 때만 버튼 표시 */}
                        </div>
                    )}

                    {isAlertMode && (
                        <DrawerFooter className="flex-col gap-3 pt-2 pb-8">
                            {renderButtons('drawer')}
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
