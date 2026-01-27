"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./Menu.module.scss"

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MenuBase = React.forwardRef<HTMLDivElement, MenuProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn(styles.menu, className)} {...props}>
                {children}
            </div>
        )
    }
)
MenuBase.displayName = "Menu"

/**
 * 🍌 Menu 컴포넌트 (TDS 스타일 준수)
 * 합성 컴포넌트 패턴을 사용하여 유연하게 메뉴와 리스트를 구성할 수 있습니다.
 */
const Menu = MenuBase as typeof MenuBase & {
    Header: typeof MenuHeader;
    Item: typeof MenuItem;
    CheckItem: typeof MenuCheckItem;
    Separator: typeof MenuSeparator;
};

// --- MenuHeader ---
interface MenuHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MenuHeader = ({ children, className, ...props }: MenuHeaderProps) => (
    <div className={cn(styles.header, className)} {...props}>
        {children}
    </div>
)

// --- MenuItem ---
interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    description?: string;
    selected?: boolean;
}

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
    ({ children, left, right, description, selected, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                    styles.item,
                    selected && styles.selected,
                    className
                )}
                {...props}
            >
                {left && <div className={styles.left}>{left}</div>}
                <div className={styles.content}>
                    <span className={styles.label}>{children}</span>
                    {description && <span className={styles.description}>{description}</span>}
                </div>
                {right && <div className={styles.right}>{right}</div>}
            </button>
        )
    }
)
MenuItem.displayName = "Menu.Item"

// --- MenuCheckItem ---
interface MenuCheckItemProps extends MenuItemProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const MenuCheckItem = React.forwardRef<HTMLButtonElement, MenuCheckItemProps>(
    ({ children, checked, onCheckedChange, ...props }, ref) => {
        return (
            <MenuItem
                ref={ref}
                selected={checked ?? false}
                right={
                    <Check
                        className={cn(
                            styles.checkIcon,
                            checked && styles.active
                        )}
                    />
                }
                onClick={(e) => {
                    onCheckedChange?.(!checked);
                    props.onClick?.(e);
                }}
                {...props}
            >
                {children}
            </MenuItem>
        )
    }
)
MenuCheckItem.displayName = "Menu.CheckItem"

// --- MenuSeparator ---
const MenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.separator, className)} {...props} />
)

// Attach compound components
Menu.Header = MenuHeader;
Menu.Item = MenuItem;
Menu.CheckItem = MenuCheckItem;
Menu.Separator = MenuSeparator;

// Named Exports
export {
    Menu,
    MenuHeader,
    MenuItem,
    MenuCheckItem,
    MenuSeparator
}

export default Menu;
