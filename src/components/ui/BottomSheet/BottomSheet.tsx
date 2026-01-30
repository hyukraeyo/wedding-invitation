'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { clsx } from 'clsx';
import s from './BottomSheet.module.scss';

export interface BottomSheetProps {
    open?: boolean;
    onClose?: () => void;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    header?: React.ReactNode;
    cta?: React.ReactNode;
    className?: string;
}

const BottomSheetMain = ({
    open,
    onClose,
    onOpenChange,
    children,
    header,
    cta,
    className
}: BottomSheetProps) => {
    return (
        <Drawer.Root
            open={open as any}
            onOpenChange={(val) => {
                onOpenChange?.(val);
                if (!val) onClose?.();
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay className={s.overlay} />
                <Drawer.Content className={clsx(s.content, className as any)}>
                    <div className={s.handle} />
                    {header && (
                        <div className={s.header}>
                            <Drawer.Title className={s.title}>{header}</Drawer.Title>
                        </div>
                    )}
                    {children}
                    {cta && (
                        <div className={s.footer}>
                            {cta}
                        </div>
                    )}
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

const BottomSheetBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx(s.body, className)}>
        {children}
    </div>
);

export const BottomSheet = Object.assign(BottomSheetMain, {
    Body: BottomSheetBody,
});
