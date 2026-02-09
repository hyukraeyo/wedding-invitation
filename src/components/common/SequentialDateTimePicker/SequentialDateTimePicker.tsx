'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import styles from './SequentialDateTimePicker.module.scss';

export interface SequentialDateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  placeholder?: string;
  className?: string;
}

export function SequentialDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  placeholder = '터치하여 날짜와 시간을 선택하세요',
  className,
}: SequentialDateTimePickerProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const formattedValue =
    date && time
      ? `${date} ${(() => {
          const [h = '0', mStr] = time.split(':');
          const m = mStr || '00';
          const hour = parseInt(h, 10);
          // 🍌 Custom logic: 12:00 is AM per TimePicker logic
          const isAM = hour <= 12;
          const period = isAM ? '오전' : '오후';
          const displayHour = isAM ? (hour === 0 ? 12 : hour) : hour - 12;
          return `${period} ${displayHour}:${m}`;
        })()}`
      : date;

  return (
    <>
      <TextField.Button
        placeholder={placeholder}
        value={formattedValue}
        onClick={() => setDateOpen(true)}
        rightSlot={<CalendarIcon size={18} />}
        className={className}
      />

      {/* Hidden Pickers - controlled by state */}
      <DatePicker
        className={styles.hidden}
        open={dateOpen}
        onOpenChange={setDateOpen}
        onChange={(newDate) => {
          onDateChange(newDate);
          setDateOpen(false);
          // Automatically open time picker after a short delay for smooth transition
          setTimeout(() => setTimeOpen(true), 150);
        }}
        value={date}
      />
      <TimePicker
        className={styles.hidden}
        open={timeOpen}
        onOpenChange={setTimeOpen}
        onChange={onTimeChange}
        value={time}
      />
    </>
  );
}
