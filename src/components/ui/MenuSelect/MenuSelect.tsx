"use client"

import React, { useState } from 'react';
import { Menu } from '../Menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './MenuSelect.module.scss';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

interface MenuSelectOption<T> {
    label: string;
    value: T;
    disabled?: boolean;
}

interface MenuSelectProps<T> {
    value?: T | undefined;
    defaultValue?: T | undefined;
    onValueChange?: ((value: T) => void) | undefined;
    options: readonly MenuSelectOption<T>[];
    placeholder?: string | undefined;
    className?: string | undefined;
    triggerClassName?: string | undefined;
    modalTitle?: string | undefined;
    disabled?: boolean | undefined;
    size?: 'sm' | 'md' | 'lg' | undefined;
    id?: string | undefined;
    /** Force mobile drawer view */
    mobileOnly?: boolean | undefined;
}

export const MenuSelect = <T extends string | number>({
    value,
    defaultValue,
    onValueChange,
    options,
    placeholder = "선택해주세요",
    className,
    triggerClassName,
    modalTitle,
    disabled,
    size = 'md',
    id,
    mobileOnly = false,
}: MenuSelectProps<T>) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const showDrawer = mobileOnly || !isDesktop;
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

    const currentValue = value !== undefined ? value : internalValue;
    const selectedOption = options.find(opt => opt.value === currentValue);

    const handleValueChange = (val: T) => {
        setInternalValue(val);
        onValueChange?.(val);
        setIsOpen(false);
    };

    const sizeClass = styles[size];

    const trigger = (
        <button
            id={id}
            type="button"
            disabled={disabled}
            className={cn(styles.trigger, sizeClass, triggerClassName)}
            onClick={() => !disabled && setIsOpen(prev => !prev)}
        >
            <span className={cn(!selectedOption && styles.placeholder)}>
                {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={cn(styles.icon, isOpen && styles.open)} />
        </button>
    );

    if (showDrawer) {
        return (
            <div className={cn(className)}>
                <ResponsiveModal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={modalTitle || placeholder}
                    useScrollFade={true}
                    padding="none"
                    trigger={trigger}
                >
                    <Menu.Dropdown className={styles.dropdown}>
                        {modalTitle || placeholder ? <Menu.Header>{modalTitle || placeholder}</Menu.Header> : null}
                        {options.map((option) => (
                            <Menu.DropdownCheckItem
                                key={String(option.value)}
                                checked={option.value === currentValue}
                                onCheckedChange={(checked) => {
                                    if (option.disabled) return;
                                    if (checked) {
                                        handleValueChange(option.value);
                                    }
                                }}
                            >
                                {option.label}
                            </Menu.DropdownCheckItem>
                        ))}
                    </Menu.Dropdown>
                </ResponsiveModal>
            </div>
        );
    }

    return (
        <div className={cn(className)}>
            <Menu.Trigger
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                placement="bottom-start"
                dropdown={
                    <Menu.Dropdown className={styles.dropdown}>
                        {options.map((option) => (
                            <Menu.DropdownCheckItem
                                key={String(option.value)}
                                checked={option.value === currentValue}
                                onCheckedChange={(checked) => {
                                    if (option.disabled) return;
                                    if (checked) {
                                        handleValueChange(option.value);
                                    }
                                }}
                            >
                                {option.label}
                            </Menu.DropdownCheckItem>
                        ))}
                    </Menu.Dropdown>
                }
            >
                {trigger}
            </Menu.Trigger>
        </div>
    );
};

MenuSelect.displayName = "MenuSelect";
