'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SelectSingleEventHandler } from 'react-day-picker';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export function DatePicker({ value, onChange, className, placeholder = "날짜 선택", disabled }: DatePickerProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const isMobile = !isDesktop;
    const [isOpen, setIsOpen] = useState(false);

    // Parse string date (YYYY-MM-DD) to Date object
    const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

    const handleSelect: SelectSingleEventHandler = (date) => {
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };



    const TriggerButtonContent = (
        <button
            type="button"
            className={cn(styles.triggerButton, className)}
            onClick={() => !disabled && setIsOpen(true)}
            disabled={disabled}
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
                        defaultMonth={dateValue || new Date()} // undefined 방지
                        onSelect={handleSelect}
                    />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <>
            {TriggerButtonContent}
            <ResponsiveModal
                open={isOpen}
                onOpenChange={setIsOpen}
                title="날짜를 선택하세요"
                className={styles.calendarWrapper}
                contentClassName={styles.modalContentNoPadding}
                useScrollFade={true}
            >
                <Calendar
                    mode="single"
                    selected={dateValue}
                    defaultMonth={dateValue || new Date()}
                    onSelect={handleSelect}
                    className={styles.calendar || ""}
                />
            </ResponsiveModal>
        </>
    );
}
