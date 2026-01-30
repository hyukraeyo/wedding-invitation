"use client"

import React, { useState } from 'react';
import { Menu } from '../Menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './MenuSelect.module.scss';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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

    // ... (existing code) ...

    const trigger = (
        <Button
            id={id}
            type="button"
            disabled={disabled || false}
            className={cn(styles.trigger, sizeClass, triggerClassName)}
            onClick={() => !disabled && setIsOpen(prev => !prev)}
        >
            <span className={cn(!selectedOption && styles.placeholder)}>
                {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={cn(styles.icon, isOpen && styles.open)} />
        </Button>
    );

    if (showDrawer) {
        return (
            <div className={cn(className)}>
                {trigger}
                <Modal open={isOpen} onOpenChange={setIsOpen}>
                    <Modal.Overlay />
                    <Modal.Content>
                        {(modalTitle || placeholder) && (
                            <Modal.Header title={modalTitle || placeholder} />
                        )}
                        <Modal.Body className={styles.bodyPadding}>
                            <Menu.Dropdown className={styles.dropdown}>
                                {options.map((option) => (
                                    <Menu.DropdownCheckItem
                                        key={String(option.value)}
                                        checked={option.value === currentValue}
                                        onCheckedChange={(checked: boolean) => {
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
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
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
                                onCheckedChange={(checked: boolean) => {
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
