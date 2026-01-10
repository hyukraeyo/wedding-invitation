'use client';

import React, { memo, useMemo } from 'react';
import SectionContainer from '../SectionContainer';
import styles from './CalendarSectionView.module.scss';
import { clsx } from 'clsx';
import SectionHeader from '../SectionHeader';

interface CalendarSectionViewProps {
    id?: string | undefined;
    date?: string;
    time?: string;
    accentColor: string;
    ddayMessage?: string;
    groom?: { firstName: string };
    bride?: { firstName: string };
}

/**
 * Presentational Component for the Calendar and D-Day section.
 * Renders a monthly calendar view highlighting the wedding date.
 */
const CalendarSectionView = memo(({
    id,
    date,
    time = '12:00',
    accentColor,
    ddayMessage = '(신랑), (신부)의 결혼식이 (D-Day) 남았습니다',
    groom,
    bride
}: CalendarSectionViewProps) => {

    const weddingDate = useMemo(() => {
        if (!date) return new Date();
        // date is YYYY-MM-DD
        const parts = date.split('-');
        const [h, m] = time.split(':');
        const year = parseInt(parts[0] || '0', 10);
        const month = parseInt(parts[1] || '1', 10) - 1;
        const day = parseInt(parts[2] || '1', 10);
        const hour = parseInt(h || '12', 10);
        const min = parseInt(m || '00', 10);

        const d = new Date(year, month, day, hour, min, 0, 0);
        return d;
    }, [date, time]);

    // Countdown Ticker
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    React.useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const diff = weddingDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            });
        };

        calculate();
        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [weddingDate]);

    // Parse D-Day Message
    const parsedDdayMessage = useMemo(() => {
        if (!ddayMessage) return { prefix: '결혼식까지 남음', suffix: '남았습니다' };

        const parts = ddayMessage.split('(D-Day)');
        const prefix = parts[0] || '';
        const suffix = parts.slice(1).join('(D-Day)') || '';

        const replaceTokens = (text: string) => {
            return text
                .replace(/\(신랑\)/g, groom?.firstName || '신랑')
                .replace(/\(신부\)/g, bride?.firstName || '신부');
        };

        return {
            prefix: replaceTokens(prefix),
            suffix: replaceTokens(suffix)
        };
    }, [ddayMessage, groom?.firstName, bride?.firstName]);

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

    const d_day_display = useMemo(() => {
        const now = new Date();
        const targetMidnight = new Date(weddingDate);
        targetMidnight.setHours(0, 0, 0, 0);

        const diff = targetMidnight.getTime() - now.getTime();
        // Math.ceil gives us the "days remaining" including the partial day we are in.
        // If it's 99 days and 1 hour left, it's D-100.
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return '오늘';
        if (days > 0) return `${days}일`;
        return `+${Math.abs(days)}일`;
    }, [weddingDate]);

    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <SectionContainer id={id}>
            <SectionHeader
                title="우리가 결혼하는 날"
                subtitle="DATE"
                accentColor={accentColor}
            />

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

            {/* Countdown Area */}
            <div className={styles.countdownArea}>
                <div className={styles.timerGrid}>
                    <div className={styles.column}>
                        <span className={styles.label}>DAYS</span>
                        <span className={styles.value}>{timeLeft.days}</span>
                    </div>
                    <span className={styles.divider}>:</span>
                    <div className={styles.column}>
                        <span className={styles.label}>HOUR</span>
                        <span className={styles.value}>{timeLeft.hours}</span>
                    </div>
                    <span className={styles.divider}>:</span>
                    <div className={styles.column}>
                        <span className={styles.label}>MIN</span>
                        <span className={styles.value}>{timeLeft.minutes}</span>
                    </div>
                    <span className={styles.divider}>:</span>
                    <div className={styles.column}>
                        <span className={styles.label}>SEC</span>
                        <span className={styles.value}>{timeLeft.seconds}</span>
                    </div>
                </div>
            </div>

            <div className={styles.ddaySection}>
                <p className={styles.sentence}>
                    {parsedDdayMessage.prefix}
                    <span className={styles.highlight} style={{ color: accentColor }}>
                        {` ${d_day_display} `}
                    </span>
                    {parsedDdayMessage.suffix}
                </p>
            </div>
        </SectionContainer>
    );
});

CalendarSectionView.displayName = 'CalendarSectionView';

export default CalendarSectionView;
