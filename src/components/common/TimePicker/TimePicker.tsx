'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { useField } from '@/components/ui/Field';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    className?: string;
    placeholder?: string;
    minuteStep?: number;
    minHour?: number;
    maxHour?: number;
    id?: string;
    disabled?: boolean;
    part?: 'all' | 'period' | 'time';
}

type Period = 'AM' | 'PM';

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
    ({ value, onChange, onComplete, className, minuteStep = 10, minHour, maxHour, id, disabled, part = 'all' }, ref) => {
        const field = useField();

        React.useEffect(() => {
            if (field?.setHasValue) {
                field.setHasValue(!!value);
            }
        }, [value, field]);

        const hasValue = !!value;
        const [hStr, mStr] = value ? value.split(':') : [];

        // Defaults for calculation updates
        const hInt = hStr ? parseInt(hStr, 10) : 10;
        const m = mStr || '00';

        const isPm = hInt >= 12;
        const period: Period = isPm ? 'PM' : 'AM';

        let displayHourInt = hInt;
        if (hInt > 12) {
            displayHourInt = hInt - 12;
        } else if (hInt === 0) {
            displayHourInt = 12;
        }
        const displayHour = String(displayHourInt);

        const updateTime = (newPeriod: Period, newHourStr: string, newMinuteStr: string, isFinal = false) => {
            let hourVal = parseInt(newHourStr, 10);

            if (newPeriod === 'PM' && hourVal !== 12) {
                hourVal += 12;
            } else if (newPeriod === 'AM' && hourVal === 12) {
                hourVal = 0;
            }

            const formattedHour = String(hourVal).padStart(2, '0');
            onChange(`${formattedHour}:${newMinuteStr}`);
            if (isFinal) {
                onComplete?.();
            }
        };

        const handlePeriodChange = (val: Period) => {
            updateTime(val, displayHour, m);
        };

        const handleHourChange = (val: string) => {
            updateTime(period, val, m);
        };

        const handleMinuteChange = (val: string) => {
            updateTime(period, displayHour, val, true);
        };

        const periodOptions = [
            { label: '오전', value: 'AM' },
            { label: '오후', value: 'PM' }
        ];

        const hourOptions = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map(h => ({
            label: `${h}시`,
            value: h
        }));

        const minutes = Array.from(
            { length: Math.floor(60 / minuteStep) },
            (_, i) => String(i * minuteStep).padStart(2, '0')
        );

        const minuteOptions = minutes.map(min => ({ label: `${min}분`, value: min }));

        const renderPeriod = () => (
            <div className={styles.periodSection}>
                <Select
                    id={id}
                    value={hasValue ? period : ''}
                    onValueChange={handlePeriodChange as any}
                    options={periodOptions}
                    placeholder="오전/오후"
                    modalTitle="오전/오후"
                    disabled={disabled}
                />
            </div>
        );

        const renderTime = () => (
            <>
                <div className={styles.hourSection}>
                    <Select
                        value={hasValue ? displayHour : ''}
                        onValueChange={handleHourChange}
                        options={hourOptions}
                        placeholder="시"
                        modalTitle="시간"
                        disabled={disabled}
                    />
                </div>

                <span className={styles.separator}>:</span>

                <div className={styles.minuteSection}>
                    <Select
                        value={hasValue ? m : ''}
                        onValueChange={handleMinuteChange}
                        options={minuteOptions}
                        placeholder="분"
                        modalTitle="분"
                        disabled={disabled}
                    />
                </div>
            </>
        );

        return (
            <div ref={ref} className={cn(styles.container, className)}>
                {part === 'all' && (
                    <>
                        {renderPeriod()}
                        {renderTime()}
                    </>
                )}
                {part === 'period' && renderPeriod()}
                {part === 'time' && renderTime()}
            </div>
        );
    }
);

TimePicker.displayName = "TimePicker";
