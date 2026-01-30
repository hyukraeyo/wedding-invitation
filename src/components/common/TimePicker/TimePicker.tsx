import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

import { SegmentedControl } from '@/components/ui/SegmentedControl';
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

const TimePickerRaw = ({
    value,
    onChange,
    onComplete,
    className,
    label,
    placeholder = "시간 선택",
    minuteStep = 10,
    id,
    disabled,
    labelOption = "appear"
}: TimePickerProps, ref: React.Ref<HTMLButtonElement>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value || '14:00');

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

    // Functional update to avoid stale closures
    const updateTempTime = useCallback((updates: { period?: Period, hour?: string, minute?: string }) => {
        setTempValue(prev => {
            const currentVal = prev || '12:00';
            const [hStr, mStr] = currentVal.split(':');
            const h = parseInt(hStr || '12', 10);
            const m = mStr || '00';

            // 현재 상태 계산
            const isPm = h >= 12;
            const currentPeriod: Period = isPm ? 'PM' : 'AM';
            const currentDisplayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);

            // 새 값 결정
            const p = updates.period !== undefined ? updates.period : currentPeriod;
            const dh = updates.hour !== undefined ? updates.hour : String(currentDisplayH);
            const min = updates.minute !== undefined ? updates.minute : m;

            // 24시간 형식으로 재계산
            let newH = parseInt(dh, 10);
            if (p === 'PM' && newH !== 12) newH += 12;
            else if (p === 'AM' && newH === 12) newH = 0;

            const nextValue = `${String(newH).padStart(2, '0')}:${min}`;
            return nextValue;
        });
    }, []);

    // Confirm selection
    const handleConfirm = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        onChange(tempValue);
        setIsOpen(false);
        onComplete?.();
    }, [onChange, tempValue, onComplete]);

    // Handle modal close
    const handleModalClose = useCallback((open: boolean) => {
        setIsOpen(open);
    }, []);

    // Scroll to current selection when modal opens
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            const container = document.querySelector(`.${styles.pickerGrid}`);
            if (container) {
                const activeElements = container.querySelectorAll(`.${styles.active}`);
                activeElements.forEach(el => {
                    el.scrollIntoView({ block: 'center', behavior: 'auto' });
                });
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [isOpen]);

    // Render column helper
    const renderColumn = (
        options: { label: string, value: string }[],
        current: string,
        columnType: 'hour' | 'minute'
    ) => (
        <div className={styles.column}>
            <div className={styles.scrollWrapper} data-column={columnType}>
                {options.map(opt => (
                    <Button
                        key={opt.value}
                        variant="weak"
                        size="medium"
                        color="dark"
                        className={cn(styles.optionItem, current === opt.value && styles.active)}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (columnType === 'hour') {
                                updateTempTime({ hour: opt.value });
                            } else {
                                updateTempTime({ minute: opt.value });
                            }
                        }}
                    >
                        {opt.label}
                    </Button>
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
                        setTempValue(value || '12:00');
                        setIsOpen(true);
                    }
                }}
                className={className}
            />
            <Modal open={isOpen} onOpenChange={handleModalClose}>
                <Modal.Overlay />
                <Modal.Content className={styles.modalContent}>
                    <Modal.Header title="예식 시간 선택" />

                    <Modal.Body className={styles.modalBody}>
                        <div
                            className={styles.periodContainer}
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <SegmentedControl
                                value={tPeriod}
                                onChange={(v: any) => {
                                    updateTempTime({ period: v as Period });
                                }}
                            >
                                <SegmentedControl.Item value="AM">오전</SegmentedControl.Item>
                                <SegmentedControl.Item value="PM">오후</SegmentedControl.Item>
                            </SegmentedControl>
                        </div>

                        <div className={styles.pickerGrid}>
                            {renderColumn(hourOptions, tDisplayHour, 'hour')}
                            {renderColumn(minuteOptions, currentTM, 'minute')}
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

export const TimePicker = React.forwardRef(TimePickerRaw);

TimePicker.displayName = "TimePicker";
