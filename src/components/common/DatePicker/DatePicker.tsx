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
    onComplete?: (() => void) | undefined;
    open?: boolean | undefined;
    onOpenChange?: ((open: boolean) => void) | undefined;
    className?: string | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    variant?: 'surface' | 'classic' | 'soft' | 'box' | undefined;
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full' | undefined;
    disabled?: boolean | undefined;
    id?: string | undefined;
    ref?: React.Ref<HTMLButtonElement> | undefined;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(({
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
    ...props
}, ref) => {
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
                variant={variant}
                radius={radius}
                label={label}
                placeholder={placeholder}
                value={dateValue ? format(dateValue, 'PPP', { locale: ko }) : ""}
                onClick={() => !disabled && setIsOpen(true)}
                className={className}
                {...props}
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
});

DatePicker.displayName = "DatePicker";
