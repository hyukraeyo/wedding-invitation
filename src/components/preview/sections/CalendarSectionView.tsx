'use client';

import React, { memo, useMemo } from 'react';
import SectionContainer from '../SectionContainer';
import styles from './CalendarSectionView.module.scss';
import { clsx } from 'clsx';

interface CalendarSectionViewProps {
    id?: string | undefined;
    date?: string;
    accentColor: string;
}

/**
 * Presentational Component for the Calendar and D-Day section.
 * Renders a monthly calendar view highlighting the wedding date.
 */
const CalendarSectionView = memo(({
    id,
    date,
    accentColor
}: CalendarSectionViewProps) => {

    const weddingDate = useMemo(() => date ? new Date(date) : new Date(), [date]);

    const daysInMonth = useMemo(() => {
        const year = weddingDate.getFullYear();
        const month = weddingDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInVal = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Fill previous month empty days
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, isOtherMonth: true });
        }
        // Fill current month days
        for (let i = 1; i <= daysInVal; i++) {
            days.push({
                day: i,
                isOtherMonth: false,
                isWeddingDay: i === weddingDate.getDate(),
                isSunday: (i + firstDay - 1) % 7 === 0
            });
        }
        return days;
    }, [weddingDate]);

    const dDay = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(weddingDate);
        target.setHours(0, 0, 0, 0);

        const diff = target.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'D-Day';
        if (days > 0) return `D-${days}`;
        return `Wedding Day +${Math.abs(days)}`;
    }, [weddingDate]);

    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <SectionContainer id={id}>
            <div className={styles.header}>
                <span className={styles.subtitle} style={{ color: accentColor }}>DATE</span>
                <h2 className={styles.title}>우리가 결혼하는 날</h2>
                <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
            </div>

            <div className={styles.calendarContainer}>
                <div className={styles.calendarHeader}>
                    <div className={styles.monthYear}>
                        {monthNames[weddingDate.getMonth()]} {weddingDate.getFullYear()}
                    </div>
                </div>

                <div className={styles.calendarGrid}>
                    {weekDays.map(wd => (
                        <div key={wd} className={clsx(styles.weekday, wd === "SUN" && styles.sunday)}>
                            {wd}
                        </div>
                    ))}
                    {daysInMonth.map((d, i) => (
                        <div
                            key={i}
                            className={clsx(
                                styles.day,
                                d.isOtherMonth && styles.otherMonth,
                                d.isSunday && !d.isWeddingDay && styles.sunday,
                                d.isWeddingDay && styles.selectedDay
                            )}
                        >
                            {d.day}
                            {d.isWeddingDay && (
                                <div className={styles.dayMarker} style={{ backgroundColor: accentColor }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.ddaySection}>
                <div className={styles.ddayLabel}>우리 둘의 약속까지</div>
                <div className={styles.ddayValue} style={{ color: accentColor }}>{dDay}</div>
            </div>
        </SectionContainer>
    );
});

CalendarSectionView.displayName = 'CalendarSectionView';

export default CalendarSectionView;
