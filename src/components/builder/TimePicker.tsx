'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
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

    const handlePeriodChange = (val: string) => {
        updateTime(val as Period, displayHour, m);
    };

    const handleHourChange = (val: string) => {
        updateTime(period, val, m);
    };

    const handleMinuteChange = (val: string) => {
        updateTime(period, displayHour, val);
    };

    // Arrays for dropdown options
    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1)); // "1" to "12"
    // 10-minute intervals: "00", "10", "20", "30", "40", "50"
    const minutes = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'));

    return (
        <div className={cn("flex w-full items-center gap-2", className)}>
            {/* AM/PM Select */}
            <div className="flex-1">
                <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="오전/오후" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="AM">오전</SelectItem>
                        <SelectItem value="PM">오후</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Hour Select */}
            <div className="flex-1">
                <Select value={displayHour} onValueChange={handleHourChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="시" />
                    </SelectTrigger>
                    <SelectContent>
                        {hours.map((h) => (
                            <SelectItem key={h} value={h}>
                                {h}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <span className="text-sm font-medium pt-1">:</span>

            {/* Minute Select */}
            <div className="flex-1">
                <Select value={m} onValueChange={handleMinuteChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="분" />
                    </SelectTrigger>
                    <SelectContent>
                        {minutes.map((min) => (
                            <SelectItem key={min} value={min}>
                                {min}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
