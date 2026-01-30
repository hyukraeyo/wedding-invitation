'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    ({ value, onChange, onComplete, className, placeholder = "날짜 선택", disabled, id }, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        // Parse string date (YYYY-MM-DD) to Date object
        const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

        const handleSelect: SelectSingleEventHandler = (date) => {
            if (date) {
                onChange(format(date, 'yyyy-MM-dd'));
                setIsOpen(false);
                onComplete?.();
            }
        };

        const TriggerButtonContent = (
            <Button
                ref={ref}
                id={id}
                type="button"
                className={cn(styles.triggerButton, className)}
                onClick={() => !disabled && setIsOpen(true)}
                disabled={disabled || false}
            >
                <span className={cn(!value && styles.placeholder, value && styles.value)}>
                    {dateValue ? format(dateValue, 'PPP', { locale: ko }) : placeholder}
                </span>
                <CalendarIcon />
            </Button>
        );

        return (
            <>
                {TriggerButtonContent}
                <Modal open={isOpen} onOpenChange={setIsOpen}>
                    <div className={styles.header}>
                        <Text typography="t4" fontWeight="bold">날짜를 선택하세요</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Calendar
                            mode="single"
                            selected={dateValue}
                            defaultMonth={dateValue || new Date()}
                            onSelect={handleSelect}
                            className={styles.calendar || ""}
                        />
                    </div>
                </Modal>
            </>
        );
    }
);

DatePicker.displayName = "DatePicker";
