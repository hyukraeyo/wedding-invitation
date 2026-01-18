"use client";

import React from 'react';
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerScrollArea,
    DrawerTrigger,
} from '@/components/ui/Drawer';
import { ChevronDown, Check } from 'lucide-react';
import styles from './styles.module.scss';

interface Option<T> {
    label: string;
    value: T;
}

interface ResponsiveSelectProps<T> {
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string | undefined;
    className?: string | undefined;
    labelClassName?: string | undefined;
    label?: string | undefined;
    modalTitle?: string;
}

export const ResponsiveSelect = <T extends string | number>({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    labelClassName = "",
    label,
    modalTitle
}: ResponsiveSelectProps<T>) => {
    const windowWidth = useWindowSize();
    const isMobile = windowWidth < 768;
    const [isOpen, setIsOpen] = React.useState(false);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const selectedItemRef = React.useRef<HTMLButtonElement>(null);
    const firstItemRef = React.useRef<HTMLButtonElement>(null);

    const stringValue = String(value);
    const [optimisticValue, setOptimisticValue] = React.useState(stringValue);

    React.useEffect(() => {
        setOptimisticValue(stringValue);
    }, [stringValue]);

    const selectedOption = options.find(o => String(o.value) === optimisticValue);

    const handleValueChange = (val: string) => {
        const opt = options.find(o => String(o.value) === val);
        if (opt) {
            setOptimisticValue(String(opt.value));
            onChange(opt.value);
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        if (!isOpen || !isMobile) {
            return;
        }

        const timer = setTimeout(() => {
            if (selectedItemRef.current && scrollAreaRef.current) {
                const container = scrollAreaRef.current;
                const item = selectedItemRef.current;
                const containerHeight = container.clientHeight;
                const itemOffsetTop = item.offsetTop;
                const itemHeight = item.clientHeight;
                const scrollPosition = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);

                container.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'instant'
                });
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [isOpen, isMobile]);

    if (!isMobile) {
        return (
            <div className={cn(styles.container, className)}>
                {label ? <Label className={labelClassName}>{label}</Label> : null}
                <ShadcnSelect value={stringValue} onValueChange={handleValueChange}>
                    <SelectTrigger className={styles.desktopTrigger}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option, idx) => (
                            <SelectItem key={`${String(option.value)}-${idx}`} value={String(option.value)}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </ShadcnSelect>
            </div>
        );
    }

    return (
        <div className={cn(styles.container, className)}>
            {label ? <Label className={labelClassName}>{label}</Label> : null}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    <button
                        type="button"
                        className={styles.triggerButton}
                    >
                        <span className={cn(!selectedOption && styles.placeholder)}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown />
                    </button>
                </DrawerTrigger>
                <DrawerContent
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        (selectedItemRef.current ?? firstItemRef.current)?.focus();
                    }}
                >
                    <DrawerHeader className={styles.drawerHeader}>
                        <DrawerTitle className={styles.drawerTitle}>
                            {modalTitle || label || placeholder || "항목 선택"}
                        </DrawerTitle>
                        <DrawerDescription className={styles.srOnly}>
                            항목 목록
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerScrollArea ref={scrollAreaRef} className="px-0">
                        {options.map((option, idx) => {
                            const isSelected = stringValue === String(option.value);
                            return (
                                <button
                                    key={`${String(option.value)}-${idx}`}
                                    ref={isSelected ? selectedItemRef : idx === 0 ? firstItemRef : null}
                                    type="button"
                                    onClick={() => handleValueChange(String(option.value))}
                                    className={cn(
                                        styles.optionItem,
                                        isSelected && styles.selected
                                    )}
                                >
                                    <span className={cn(
                                        styles.optionText,
                                        isSelected && styles.selected
                                    )}>
                                        {option.label}
                                    </span>
                                    {isSelected ? (
                                        <Check className={styles.checkIcon} strokeWidth={3} />
                                    ) : null}
                                </button>
                            );
                        })}
                    </DrawerScrollArea>
                </DrawerContent>
            </Drawer>
        </div >
    );
};
