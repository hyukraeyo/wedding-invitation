import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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

export const BuilderCalendar = ({ value, onChange, className, placeholder = '날짜를 선택해주세요' }: BuilderCalendarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const { theme: { accentColor } } = useInvitationStore();

    // Parse value or default to today
    const selectedDate = value ? new Date(value) : null;
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    useEffect(() => {
        if (value) {
            setViewDate(new Date(value));
        }
    }, [value]);

    const closeCalendar = useCallback(() => setIsOpen(false), []);

    // 팝업 위치 계산
    useLayoutEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPopupStyle({
                position: 'fixed',
                top: rect.bottom + 8,
                left: rect.left,
                minWidth: Math.max(rect.width, 280),
                zIndex: 9999,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideContainer = containerRef.current?.contains(target);
            const isInsidePopup = popupRef.current?.contains(target);

            if (!isInsideContainer && !isInsidePopup) {
                closeCalendar();
            }
        };

        const handleScroll = () => {
            if (isOpen) closeCalendar();
        };

        if (!isOpen) return;

        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, closeCalendar]);

    const changeMonth = useCallback((offset: number) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    }, []);

    const handleDateClick = useCallback((day: number) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        closeCalendar();
    }, [viewDate, onChange, closeCalendar]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = startDayOfMonth(year, month);
        const days = [];

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} aria-hidden="true" />);
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
                    aria-label={`${year}년 ${month + 1}월 ${day}일`}
                    aria-current={isSelected ? 'date' : undefined}
                >
                    {day}
                </button>
            );
        }
        return days;
    }, [viewDate, value, handleDateClick]);

    const cssVars = useMemo(() => ({
        '--accent-color': accentColor,
    } as React.CSSProperties), [accentColor]);

    const displayDate = value ? value.split('-').join('. ') + '.' : placeholder;

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={clsx(styles.calendarWrapper, className)}
            ref={containerRef}
            style={cssVars}
        >
            <button
                ref={triggerRef}
                type="button"
                onClick={handleTriggerClick}
                className={clsx(styles.trigger, isOpen && styles.open)}
                aria-haspopup="grid"
                aria-expanded={isOpen}
                aria-label={value ? `선택된 날짜: ${displayDate}` : placeholder}
            >
                <span className={clsx(styles.triggerText, value && styles.hasValue)}>
                    {displayDate}
                </span>
                <CalendarIcon
                    size={18}
                    className={clsx(styles.triggerIcon, isOpen && styles.active)}
                    aria-hidden="true"
                />
            </button>

            {isOpen && createPortal(
                <div
                    ref={popupRef}
                    className={styles.popup}
                    style={{ ...popupStyle, ...cssVars }}
                    role="grid"
                    aria-label={`${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월 달력`}
                >
                    <div className={styles.header}>
                        <div className={styles.monthTitle}>
                            <span className={styles.year}>{viewDate.getFullYear()}년</span>
                            <span className={styles.monthHighlight}>{viewDate.getMonth() + 1}월</span>
                        </div>
                        <div className={styles.navGroup}>
                            <button
                                onClick={() => changeMonth(-1)}
                                className={styles.navButton}
                                type="button"
                                aria-label="이전 달"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                className={styles.navButton}
                                type="button"
                                aria-label="다음 달"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.weekdays} role="row">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                            <div
                                key={d}
                                className={clsx(styles.weekday, i === 0 && styles.sunday)}
                                role="columnheader"
                                aria-label={d === 'SUN' ? '일요일' : d === 'MON' ? '월요일' : d === 'TUE' ? '화요일' : d === 'WED' ? '수요일' : d === 'THU' ? '목요일' : d === 'FRI' ? '금요일' : '토요일'}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className={styles.daysGrid}>
                        {calendarDays}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
