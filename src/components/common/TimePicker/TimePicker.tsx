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
}

type Period = 'AM' | 'PM';

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
    ({ value, onChange, onComplete, className, minuteStep = 10, minHour, maxHour, id, disabled }, ref) => {
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

        const handlePeriodHourChange = (val: string) => {
            const [nextPeriod, nextHour] = val.split(':') as [Period, string];
            if (!nextPeriod || !nextHour) return;
            updateTime(nextPeriod, nextHour, m);
        };

        const handleMinuteChange = (val: string) => {
            updateTime(period, displayHour, val, true);
        };

        const hours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

        const periodHourOptions = [
            ...hours.map((hour) => ({
                label: `오전 ${hour}시`,
                value: `AM:${hour}`
            })),
            ...hours.map((hour) => ({
                label: `오후 ${hour}시`,
                value: `PM:${hour}`
            })),
        ].filter(option => {
            const [p, hStr] = option.value.split(':') as [Period, string];
            let h = parseInt(hStr, 10);
            if (p === 'PM' && h !== 12) h += 12;
            if (p === 'AM' && h === 12) h = 0;

            const min = minHour !== undefined ? minHour : 0;
            const max = maxHour !== undefined ? maxHour : 23;

            return h >= min && h <= max;
        });

        const minutes = Array.from(
            { length: Math.floor(60 / minuteStep) },
            (_, i) => String(i * minuteStep).padStart(2, '0')
        );

        return (
            <div ref={ref} className={cn(styles.container, className)}>
                {/* Period + Hour Select */}
                <div className={styles.hourSection}>
                    <Select
                        id={id}
                        value={hasValue ? `${period}:${displayHour}` : ''}
                        onValueChange={handlePeriodHourChange}
                        options={periodHourOptions}
                        placeholder="오전/오후 시간"
                        modalTitle="시간"
                        disabled={disabled}
                    />
                </div>

                <span className={styles.separator}>:</span>

                {/* Minute Select */}
                <div className={styles.minuteSection}>
                    <Select
                        value={hasValue ? m : ''}
                        onValueChange={handleMinuteChange}
                        options={minutes.map(min => ({ label: `${min}분`, value: min }))}
                        placeholder="분"
                        modalTitle="분"
                        disabled={disabled}
                    />
                </div>
            </div>
        );
    }
);

TimePicker.displayName = "TimePicker";
