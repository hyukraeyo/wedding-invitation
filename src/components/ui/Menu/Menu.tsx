'use client';

import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
} from '../DropdownMenu';
import { clsx } from 'clsx';

export interface MenuTriggerProps {
    children: React.ReactNode;
    open?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    placement?: any;
    dropdown?: React.ReactNode;
}

const MenuTrigger = ({ children, open, onOpen, onClose, dropdown }: MenuTriggerProps) => {
    return (
        <DropdownMenu open={open as any} onOpenChange={(val) => val ? onOpen?.() : onClose?.()}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            {dropdown}
        </DropdownMenu>
    );
};

export const MenuDropdown = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <DropdownMenuContent align="end" sideOffset={8} className={className}>
            {children}
        </DropdownMenuContent>
    );
};

export interface MenuDropdownItemProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    left?: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export const MenuDropdownItem = ({ children, onClick, left, disabled, style }: MenuDropdownItemProps) => {
    return (
        <DropdownMenuItem
            onClick={onClick as any}
            disabled={disabled as any}
            style={{
                height: '44px', // mobile friendly
                padding: '0 16px',
                ...style
            }}
        >
            {left && <span style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>{left}</span>}
            <span style={{ flex: 1 }}>{children}</span>
        </DropdownMenuItem>
    );
};

export const MenuDropdownCheckItem = ({ children, checked, onCheckedChange }: any) => {
    return (
        <DropdownMenuCheckboxItem checked={checked} onCheckedChange={onCheckedChange}>
            {children}
        </DropdownMenuCheckboxItem>
    );
};

export const Menu = {
    Trigger: MenuTrigger,
    Dropdown: MenuDropdown,
    DropdownItem: MenuDropdownItem,
    DropdownCheckItem: MenuDropdownCheckItem,
};
