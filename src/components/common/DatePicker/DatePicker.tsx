'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    label?: string;
    placeholder?: string;
    variant?: 'surface' | 'classic' | 'soft' | 'box';
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    disabled?: boolean;
    id?: string;
    ref?: React.Ref<HTMLButtonElement>;
}

export const DatePicker = ({
    value,
    onChange,
    onComplete,
    open: externalOpen,
    onOpenChange: setExternalOpen,
    className,
    label,
    placeholder = "날짜 선택",
    variant = "soft",
    radius = "large",
    disabled,
    id,
    ref
}: DatePickerProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    const setIsOpen = (open: boolean) => {
        if (setExternalOpen) {
            setExternalOpen(open);
        } else {
            setInternalOpen(open);
        }
    };

    // Parse string date (YYYY-MM-DD) to Date object
    const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

    const handleSelect: SelectSingleEventHandler = (date) => {
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
            setIsOpen(false);
            onComplete?.();
        }
    };

    return (
        <>
            <TextField.Button
                ref={ref}
                id={id}
                label={label || ''}
                variant={variant}
                radius={radius}
                placeholder={placeholder}
                value={dateValue ? format(dateValue, 'PPP', { locale: ko }) : ""}
                onClick={() => !disabled && setIsOpen(true)}
                className={className}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content>
                        <Dialog.Header title="날짜를 선택하세요" visuallyHidden />
                        <Dialog.Body className={styles.calendarBody}>
                            <Calendar
                                mode="single"
                                selected={dateValue}
                                defaultMonth={new Date()}
                                onSelect={handleSelect}
                                className={styles.calendar || ""}
                                hideTodayIndicator={!dateValue}
                                showOutsideDays={false}
                            />
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </>
    );
};

DatePicker.displayName = "DatePicker";
