import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BuilderCalendar.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

interface BuilderCalendarProps {
    value: string | null;
    onChange: (date: string) => void;
    className?: string;
    placeholder?: string;
}

interface BuilderCalendarProps {
    value: string | null;
    onChange: (date: string) => void;
    className?: string;
    placeholder?: string;
}

export const BuilderCalendar = ({ value, onChange, className, placeholder = '날짜를 선택해주세요' }: BuilderCalendarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme: { accentColor } } = useInvitationStore();

    // Parse value or default to today
    const selectedDate = value ? new Date(value) : null;
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    useEffect(() => {
        if (selectedDate) setViewDate(selectedDate);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const handleDateClick = (day: number) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        // Format as YYYY-MM-DD (local time)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendarDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = startDayOfMonth(year, month);
        const days = [];

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} />);
        }

        // Days
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = value === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={clsx(
                        styles.dayBtn,
                        isSelected && styles.selected,
                        isToday && styles.today
                    )}
                    type="button"
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const cssVars = {
        '--accent-color': accentColor,
    } as React.CSSProperties;

    const displayDate = value ? value.split('-').join('. ') + '.' : placeholder;

    return (
        <div
            className={clsx(styles.calendarWrapper, className)}
            ref={containerRef}
            style={cssVars}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(styles.trigger, isOpen && styles.open)}
            >
                <span className={clsx(styles.triggerText, value && styles.hasValue)}>
                    {displayDate}
                </span>
                <CalendarIcon
                    size={18}
                    className={clsx(styles.triggerIcon, isOpen && styles.active)}
                />
            </button>

            {isOpen && (
                <div className={styles.popup}>
                    <div className={styles.header}>
                        <div className={styles.monthTitle}>
                            {viewDate.getFullYear()}년
                            <span className={styles.monthHighlight}>{viewDate.getMonth() + 1}월</span>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => changeMonth(-1)} className={styles.navButton} type="button">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => changeMonth(1)} className={styles.navButton} type="button">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.weekdays}>
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                            <div key={d} className={clsx(styles.weekday, i === 0 && styles.sunday)}>
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className={styles.daysGrid}>
                        {renderCalendarDays()}
                    </div>
                </div>
            )}
        </div>
    );
};
