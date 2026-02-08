'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '../DropdownMenu';

export interface MenuTriggerProps {
  children: React.ReactNode;
  open?: boolean | undefined;
  onOpen?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
  placement?: string | undefined;
  dropdown?: React.ReactNode | undefined;
}

const MenuTrigger = ({ children, open, onOpen, onClose, dropdown }: MenuTriggerProps) => {
  return (
    <DropdownMenu open={!!open} onOpenChange={(val) => (val ? onOpen?.() : onClose?.())}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      {dropdown}
    </DropdownMenu>
  );
};

export const MenuDropdown = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => {
  return (
    <DropdownMenuContent align="end" sideOffset={8} className={className}>
      {children}
    </DropdownMenuContent>
  );
};

export interface MenuDropdownItemProps {
  children: React.ReactNode;
  onClick?: ((e: React.MouseEvent) => void) | undefined;
  left?: React.ReactNode | undefined;
  disabled?: boolean | undefined;
  style?: React.CSSProperties | undefined;
  variant?: 'default' | 'danger' | undefined;
}

export const MenuDropdownItem = ({
  children,
  onClick,
  left,
  disabled,
  style,
  variant = 'default',
}: MenuDropdownItemProps) => {
  const variantStyle = variant === 'danger' ? { color: 'var(--color-error, #f04452)' } : {};
  return (
    <DropdownMenuItem
      onClick={onClick}
      disabled={!!disabled}
      style={{
        height: '44px', // mobile friendly
        padding: '0 16px',
        ...variantStyle,
        ...style,
      }}
    >
      {left && (
        <span style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>{left}</span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
    </DropdownMenuItem>
  );
};

interface MenuDropdownCheckItemProps {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const MenuDropdownCheckItem = ({
  children,
  checked,
  onCheckedChange,
}: MenuDropdownCheckItemProps) => {
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
