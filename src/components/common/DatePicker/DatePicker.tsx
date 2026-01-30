'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Modal } from '@/components/ui/Modal';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    className?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    ref?: React.Ref<HTMLButtonElement>;
    labelOption?: "appear" | "sustain";
}

export const DatePicker = ({ value, onChange, onComplete, className, label, placeholder = "날짜 선택", disabled, id, ref, labelOption = "appear" }: DatePickerProps) => {
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

    return (
        <>
            <TextField.Button
                ref={ref}
                id={id}
                label={label || ''}
                labelOption={labelOption}
                variant="box"
                placeholder={placeholder}
                value={dateValue ? format(dateValue, 'PPP', { locale: ko }) : ""}
                onClick={() => !disabled && setIsOpen(true)}
                className={className}
            />
            <Modal open={isOpen} onOpenChange={setIsOpen}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header title="날짜를 선택하세요" />
                    <Modal.Body className={styles.calendarBody}>
                        <Calendar
                            mode="single"
                            selected={dateValue}
                            defaultMonth={dateValue || new Date()}
                            onSelect={handleSelect}
                            className={styles.calendar || ""}
                        />
                    </Modal.Body>
                    <Modal.Footer className={styles.footer}>
                        <Button
                            className={styles.fullWidth}
                            onClick={() => setIsOpen(false)}
                        >
                            닫기
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

DatePicker.displayName = "DatePicker";
