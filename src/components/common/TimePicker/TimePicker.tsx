'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    minuteStep?: number;
    minHour?: number;
    maxHour?: number;
}

type Period = 'AM' | 'PM';

export function TimePicker({ value, onChange, className, minuteStep = 10, minHour, maxHour }: TimePickerProps) {
    // 1. Parse existing value "HH:mm" -> Period, Hour, Minute
    // Default to 10:00 AM if empty
    const [hStr = '10', mStr = '00'] = value ? value.split(':') : [];
    const hInt = parseInt(hStr, 10);
    const m = mStr;

    const isPm = hInt >= 12;
    const period: Period = isPm ? 'PM' : 'AM';

    // Convert 24h -> 12h
    let displayHourInt = hInt;
    if (hInt > 12) {
        displayHourInt = hInt - 12;
    } else if (hInt === 0) {
        displayHourInt = 12;
    }
    const displayHour = String(displayHourInt);

    // Helpers to reconstruct 24h string and call onChange
    const updateTime = (newPeriod: Period, newHourStr: string, newMinuteStr: string) => {
        let hourVal = parseInt(newHourStr, 10);

        if (newPeriod === 'PM' && hourVal !== 12) {
            hourVal += 12;
        } else if (newPeriod === 'AM' && hourVal === 12) {
            hourVal = 0;
        }

        const formattedHour = String(hourVal).padStart(2, '0');
        onChange(`${formattedHour}:${newMinuteStr}`);
    };

    const handlePeriodHourChange = (val: string) => {
        const [nextPeriod, nextHour] = val.split(':') as [Period, string];
        if (!nextPeriod || !nextHour) return;
        updateTime(nextPeriod, nextHour, m);
    };

    const handleMinuteChange = (val: string) => {
        updateTime(period, displayHour, val);
    };

    // Generate options dynamically
    // Full 12-hour cycle for general purpose use
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

    // Generate minutes based on step
    const minutes = Array.from(
        { length: Math.floor(60 / minuteStep) },
        (_, i) => String(i * minuteStep).padStart(2, '0')
    );

    return (
        <div className={cn(styles.container, className)}>
            {/* Period + Hour Select */}
            <div className={styles.hourSection}>
                <Select
                    value={`${period}:${displayHour}`}
                    onValueChange={handlePeriodHourChange}
                    options={periodHourOptions}
                    placeholder="오전/오후 시간"
                    modalTitle="시간"
                />
            </div>

            <span className={styles.separator}>:</span>

            {/* Minute Select */}
            <div className={styles.minuteSection}>
                <Select
                    value={m}
                    onValueChange={handleMinuteChange}
                    options={minutes.map(min => ({ label: `${min}분`, value: min }))}
                    placeholder="분"
                    modalTitle="분"
                />
            </div>
        </div>
    );
}
