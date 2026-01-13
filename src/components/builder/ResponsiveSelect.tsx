'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/Sheet';
import { useWindowSize } from '@/hooks/useWindowSize';

export interface SelectOption {
    label: string;
    value: string;
}

interface ResponsiveSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    triggerClassName?: string;
    title?: string;
    description?: string;
}

export function ResponsiveSelect({
    value,
    onValueChange,
    options,
    placeholder,
    className,
    triggerClassName,
    title,
    description,
}: ResponsiveSelectProps) {
    const windowWidth = useWindowSize();
    const isMobile = windowWidth < 768;
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    if (!isMobile) {
        return (
            <div className={cn("w-full", className)}>
                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger className={cn("w-full", triggerClassName)}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    // Mobile implementation using Bottom Sheet
    return (
        <div className={cn("w-full", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground transition-colors",
                    triggerClassName
                )}
                style={{
                    fontSize: 'var(--builder-font-size)',
                    fontFamily: 'var(--builder-font-family)',
                    lineHeight: 'var(--builder-line-height)',
                }}
            >
                <span className={cn(!selectedOption && "text-muted-foreground")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="bottom" className="px-0 pb-10 rounded-t-[20px] max-h-[80vh] overflow-y-auto">
                    <SheetHeader className="px-6 pb-4 border-b">
                        <SheetTitle className="text-left text-base font-semibold">
                            {title || placeholder || "항목 선택"}
                        </SheetTitle>
                        {description && (
                            <SheetDescription className="text-left text-xs">
                                {description}
                            </SheetDescription>
                        )}
                    </SheetHeader>
                    <div className="flex flex-col py-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onValueChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between px-6 py-4 text-left hover:bg-accent transition-colors active:bg-accent/50",
                                    value === option.value && "text-primary font-medium bg-primary/5"
                                )}
                            >
                                <span style={{ fontSize: '16px' }}>{option.label}</span>
                                {value === option.value && (
                                    <Check className="h-5 w-5 text-primary" strokeWidth={3} />
                                )}
                            </button>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
