'use client';

import React from 'react';
import { Select } from './Select';
import { cn } from '@/lib/utils';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

type Period = 'AM' | 'PM';

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    // 1. Parse existing value "HH:mm" -> Period, Hour, Minute
    // Default to 12:00 PM if empty
    const [hStr = '12', mStr = '00'] = value ? value.split(':') : [];
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
    // const displayHour = String(displayHourInt).padStart(2, '0'); // keep logic, but Select uses string values usually
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

    // Arrays for dropdown options
    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1)); // "1" to "12"
    const periodHourOptions = [
        ...hours.map((hour) => ({ label: `오전 ${hour}시`, value: `AM:${hour}` })),
        ...hours.map((hour) => ({ label: `오후 ${hour}시`, value: `PM:${hour}` })),
    ];
    const minutes = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'));

    return (
        <div className={cn("flex w-full items-center gap-2", className)}>
            {/* Period + Hour Select */}
            <div className="flex-[2]">
                <Select
                    value={`${period}:${displayHour}`}
                    onChange={handlePeriodHourChange}
                    options={periodHourOptions}
                    placeholder="오전/오후 시간"
                    modalTitle="시간"
                />
            </div>

            <span className="text-sm font-medium pt-1">:</span>

            {/* Minute Select */}
            <div className="flex-1">
                <Select
                    value={m}
                    onChange={handleMinuteChange}
                    options={minutes.map(min => ({ label: min, value: min }))}
                    placeholder="분"
                    modalTitle="분"
                />
            </div>
        </div>
    );
}
