'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { clsx } from 'clsx';
import s from './BottomSheet.module.scss';

export interface BottomSheetProps {
    open?: boolean | undefined;
    onClose?: (() => void) | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    children: React.ReactNode;
    header?: React.ReactNode | undefined;
    cta?: React.ReactNode | undefined;
    className?: string | undefined;
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
            open={!!open}
            onOpenChange={(val) => {
                onOpenChange?.(val);
                if (!val) onClose?.();
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay className={s.overlay} />
                <Drawer.Content className={clsx(s.content, className)}>
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
