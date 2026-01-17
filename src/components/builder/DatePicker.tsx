'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar'; // 폴더 구조로 통일
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
} from '@/components/ui/Drawer';
import styles from './DatePicker.module.scss';

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
                <PopoverContent className={styles.popoverContent} align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        onSelect={handleSelect as any}
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
                <DrawerContent>
                    <DrawerHeader className={styles.drawerHeader}>
                        <DrawerTitle className={styles.drawerTitle}>
                            날짜를 선택하세요
                        </DrawerTitle>
                        <DrawerDescription className={styles.srOnly}>
                            날짜 선택
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerScrollArea className={styles.calendarWrapper}>
                        <Calendar
                            mode="single"
                            selected={dateValue}
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            onSelect={handleSelect as any}
                            className={styles.calendar || ""}
                        />
                    </DrawerScrollArea>
                </DrawerContent>
            </Drawer>
        </>
    );
}
