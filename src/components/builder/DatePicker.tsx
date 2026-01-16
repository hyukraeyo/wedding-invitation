'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerScrollArea,
    DrawerTrigger,
} from '@/components/ui/drawer';
import styles from './Select.module.scss';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function DatePicker({ value, onChange, className, placeholder = "날짜 선택" }: DatePickerProps) {
    const windowWidth = useWindowSize();
    const isMobile = windowWidth < 768;
    const [isOpen, setIsOpen] = useState(false);
    const calendarWrapperRef = React.useRef<HTMLDivElement>(null);

    // Parse string date (YYYY-MM-DD) to Date object
    const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };

    const TriggerButtonContent = (
        <button
            type="button"
            className={cn(styles.triggerButton, className)}
        >
            <span className={cn(!value && styles.placeholder, value && styles.value)}>
                {dateValue ? format(dateValue, 'PPP', { locale: ko }) : placeholder}
            </span>
            <CalendarIcon />
        </button>
    );

    if (!isMobile) {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    {TriggerButtonContent}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={handleSelect}
                        initialFocus
                        locale={ko}
                    />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    {TriggerButtonContent}
                </DrawerTrigger>
                <DrawerContent
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        calendarWrapperRef.current?.focus();
                    }}
                >
                    <DrawerHeader className="w-full px-6 pb-2 border-b">
                        <DrawerTitle className="text-left text-base font-bold text-foreground/90">
                            날짜를 선택하세요
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            날짜 선택
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerScrollArea className="flex flex-col items-center justify-center p-4">
                        <div ref={calendarWrapperRef} tabIndex={-1}>
                            <Calendar
                                mode="single"
                                selected={dateValue}
                                onSelect={handleSelect}
                                initialFocus
                                locale={ko}
                                className="p-0 border-0 scale-110 md:scale-100"
                            />
                        </div>
                    </DrawerScrollArea>
                </DrawerContent>
            </Drawer>
        </>
    );
}
