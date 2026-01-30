import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Selector } from '@/components/ui/Selector';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    className?: string;
    label?: string;
    placeholder?: string;
    minuteStep?: number;
    id?: string;
    disabled?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
    labelOption?: "appear" | "sustain";
}

type Period = 'AM' | 'PM';

export const TimePicker = ({
    value,
    onChange,
    onComplete,
    className,
    label,
    placeholder = "시간 선택",
    minuteStep = 10,
    id,
    disabled,
    ref,
    labelOption = "appear"
}: TimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value || '14:00');

    // Sync tempValue when modal opens


    // Parse values for display and modal state
    const { displayValue, currentTM, tPeriod, tDisplayHour } = useMemo(() => {
        const hasValue = !!value;
        const [hStr, mStr] = value && value.includes(':') ? value.split(':') : ['', ''];
        const hInt = hStr ? parseInt(hStr, 10) : undefined;
        const m = mStr || '';

        const isPm = hInt !== undefined ? hInt >= 12 : false;
        const period: Period = isPm ? 'PM' : 'AM';

        let displayHour = '';
        if (hInt !== undefined) {
            let displayHourInt = hInt;
            if (hInt > 12) displayHourInt = hInt - 12;
            else if (hInt === 0) displayHourInt = 12;
            displayHour = String(displayHourInt);
        }

        const display = hasValue
            ? `${period === 'AM' ? '오전' : '오후'} ${displayHour}시 ${m}분`
            : '';

        // Temp value parsing
        const [tH, tM] = (tempValue || '14:00').split(':');
        const thi = parseInt(tH || '14', 10);
        const tPm = thi >= 12;
        const tp: Period = tPm ? 'PM' : 'AM';
        const tdh = String(thi > 12 ? thi - 12 : (thi === 0 ? 12 : thi));

        return {
            displayValue: display,
            tHInt: thi,
            currentTM: tM || '00',
            tPeriod: tp,
            tDisplayHour: tdh
        };
    }, [value, tempValue]);

    // Options
    const hourOptions = useMemo(() =>
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(h => ({
            label: `${h}시`,
            value: h
        })), []
    );

    const minuteOptions = useMemo(() => {
        const minutes = Array.from(
            { length: Math.floor(60 / minuteStep) },
            (_, i) => String(i * minuteStep).padStart(2, '0')
        );
        return minutes.map(min => ({ label: `${min}분`, value: min }));
    }, [minuteStep]);

    // Update temp time
    const updateTempTime = useCallback((newP: Period, newH: string, newMin: string) => {
        let h = parseInt(newH, 10);
        if (newP === 'PM' && h !== 12) h += 12;
        else if (newP === 'AM' && h === 12) h = 0;
        setTempValue(`${String(h).padStart(2, '0')}:${newMin}`);
    }, []);

    // Confirm selection
    const handleConfirm = useCallback(() => {
        onChange(tempValue);
        setIsOpen(false);
        onComplete?.();
    }, [onChange, tempValue, onComplete]);

    // Scroll to current selection when modal opens or tempValue changes
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            const activeElements = document.querySelectorAll(`.${styles.active}`);
            activeElements.forEach(el => {
                el.scrollIntoView({ block: 'center', behavior: 'auto' });
            });
        }, 50);

        return () => clearTimeout(timer);
    }, [isOpen]);

    // Render column helper
    const renderColumn = (
        options: { label: string, value: string }[],
        current: string,
        onSelect: (val: string) => void,
        columnId: string
    ) => (
        <div className={styles.column}>
            <div className={styles.scrollWrapper} data-column={columnId}>
                {options.map(opt => (
                    <Selector
                        key={opt.value}
                        type="clear"
                        typography="t6"
                        className={cn(styles.optionItem, current === opt.value && styles.active)}
                        onClick={() => onSelect(opt.value)}
                    >
                        {opt.label}
                    </Selector>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <TextField.Button
                ref={ref}
                id={id}
                label={label || ''}
                labelOption={labelOption}
                variant="box"
                placeholder={placeholder}
                value={displayValue}
                onClick={() => {
                    if (!disabled) {
                        setTempValue(value || '14:00');
                        setIsOpen(true);
                    }
                }}
                className={className}
            />
            <Modal open={isOpen} onOpenChange={setIsOpen}>
                <Modal.Overlay />
                <Modal.Content className={styles.modalContent}>
                    <Modal.Header title="예식 시간 선택" />

                    <Modal.Body>
                        <div className={styles.periodContainer}>
                            <SegmentedControl
                                value={tPeriod}
                                onChange={(v: string) => updateTempTime(v as Period, tDisplayHour, currentTM)}
                            >
                                <SegmentedControl.Item value="AM">오전</SegmentedControl.Item>
                                <SegmentedControl.Item value="PM">오후</SegmentedControl.Item>
                            </SegmentedControl>
                        </div>

                        <div className={styles.pickerGrid}>
                            {renderColumn(hourOptions, tDisplayHour, (v) => updateTempTime(tPeriod, v, currentTM), 'hour')}
                            {renderColumn(minuteOptions, currentTM, (v) => updateTempTime(tPeriod, tDisplayHour, v), 'minute')}
                        </div>
                    </Modal.Body>

                    <Modal.Footer className={styles.footer}>
                        <Button
                            className={styles.fullWidth}
                            variant="fill"
                            size="large"
                            onClick={handleConfirm}
                        >
                            선택 완료
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

TimePicker.displayName = "TimePicker";
