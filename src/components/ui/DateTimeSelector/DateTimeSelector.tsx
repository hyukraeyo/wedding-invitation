'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import styles from './DateTimeSelector.module.scss';

// Mock time slots generation
const generateTimeSlots = () => {
  const times = [];
  for (let i = 9; i <= 20; i++) {
    // 9 AM to 8 PM
    times.push(`${i.toString().padStart(2, '0')}:00`);
    times.push(`${i.toString().padStart(2, '0')}:30`);
  }
  return times;
};

const TIME_SLOTS = generateTimeSlots();

interface DateTimeSelectorProps {
  className?: string;
  onSelect?: (date: Date | undefined, time: string | undefined) => void;
}

export function DateTimeSelector({ className, onSelect }: DateTimeSelectorProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState<string | undefined>();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setTime(undefined); // Reset time when date changes
    onSelect?.(newDate, undefined);
  };

  const handleTimeSelect = (newTime: string) => {
    setTime(newTime);
    onSelect?.(date, newTime);
  };

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.calendarSection}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border-none w-full"
          showOutsideDays={false}
        />
      </div>

      <div className={styles.timeSection}>
        <div className={styles.header}>
          {date ? (
            <span className={styles.dateTitle}>
              {format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
            </span>
          ) : (
            <span className={styles.dateTitle}>날짜를 선택하세요</span>
          )}
        </div>

        {date ? (
          <div className={styles.scrollArea}>
            <div className={styles.timeGrid}>
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={cn(styles.timeButton, time === slot && styles.selected)}
                  onClick={() => handleTimeSelect(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Clock className="w-8 h-8 mb-2 opacity-20" />
            <p>날짜를 먼저 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
