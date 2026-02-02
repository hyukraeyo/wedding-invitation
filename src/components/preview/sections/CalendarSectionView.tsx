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
    showCalendar?: boolean;
    showDday?: boolean;
    animateEntrance?: boolean;
}

/**
 * Countdown Ticker Component to isolate re-renders
 */
const CountdownTimer = ({ weddingDate }: { weddingDate: Date }) => {
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

    return (
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
    );
};

/**
 * Presentational Component for the Calendar and D-Day section.
 * Renders a monthly calendar view highlighting the wedding date.
 */
const CalendarSectionView = memo(({
    id,
    date,
    time = '12:00',
    accentColor,
    ddayMessage = '(신랑), (신부)의 결혼식이 (D-Day) 남았어요',
    groom,
    bride,
    showCalendar = true,
    showDday = true,
    animateEntrance
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

    // Parse D-Day Message
    const parsedDdayMessage = useMemo(() => {
        if (!ddayMessage) return { prefix: '결혼식까지 남음', suffix: '남았어요' };

        const parts = ddayMessage.split('(D-Day)');
        const prefix = parts[0] || '';
        let suffix = parts.slice(1).join('(D-Day)') || '';

        // d_day_display가 이미 "일"로 끝나므로 suffix 시작 부분의 중복 "일"을 제거
        // "(D-Day) 일 남았어요" → "102일 일 남았어요" 방지
        suffix = suffix.replace(/^[\s]*일[\s]?/, ' ');

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

    // 둘 다 표시 안 하면 섹션 자체를 렌더링하지 않음
    if (!showCalendar && !showDday) {
        return null;
    }

    return (
        <SectionContainer id={id} animateEntrance={animateEntrance}>
            <SectionHeader
                title="우리가 결혼하는 날"
                subtitle="DATE"
                accentColor={accentColor}
            />

            {showCalendar ? (
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
                                {d.isWeddingDay ? (
                                    <div className={styles.dayMarker} style={{ backgroundColor: accentColor }} />
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Countdown Area */}
            {showDday ? (
                <>
                    <CountdownTimer weddingDate={weddingDate} />

                    <div className={styles.ddaySection}>
                        <p className={styles.sentence}>
                            {parsedDdayMessage.prefix}
                            <span className={styles.highlight} style={{ color: accentColor, backgroundColor: `${accentColor}26` }}>
                                {` ${d_day_display} `}
                            </span>
                            {parsedDdayMessage.suffix}
                        </p>
                    </div>
                </>
            ) : null}
        </SectionContainer>
    );
});

CalendarSectionView.displayName = 'CalendarSectionView';

export default CalendarSectionView;
