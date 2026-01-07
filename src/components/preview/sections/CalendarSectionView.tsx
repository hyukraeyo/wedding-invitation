import React, { useState, useEffect } from 'react';
// import { Heart } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function CalendarSectionView() {
    const {
        date, time, theme,
        showCalendar, showDday, ddayMessage,
        groom, bride
    } = useInvitationStore();

    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [dDay, setDDay] = useState<number>(0);

    useEffect(() => {
        if (!date || !time) return;

        const calculateTime = () => {
            const target = new Date(`${date}T${time}:00`);
            const now = new Date();
            const difference = target.getTime() - now.getTime();

            const d = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            setDDay(d);

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);

        return () => clearInterval(timer);
    }, [date, time]);

    if ((!showCalendar && !showDday) || !date) return null;

    return (
        <div className="py-24 px-8 w-full">
            <div className="relative overflow-hidden">
                {/* 2026.01.06 Header */}
                <div className="text-center mb-12 space-y-3 relative z-10">

                    <div
                        className="font-serif font-light tracking-widest text-gray-800"
                        style={{ fontSize: 'calc(30px * var(--font-scale))' }}
                    >
                        {date.replace(/-/g, '.')}
                    </div>
                    <div
                        className="text-gray-400 font-light tracking-wide"
                        style={{ fontSize: 'calc(13px * var(--font-scale))' }}
                    >
                        {new Date(date).toLocaleDateString('ko-KR', { weekday: 'long' })}
                        <span className="mx-2 opacity-30">|</span>
                        {(() => {
                            if (!time) return '';
                            const [h, m] = time.split(':').map(Number);
                            if (h == null || m == null) return '';
                            const amp = h < 12 ? '오전' : (h === 12 ? '낮' : '오후');
                            const displayH = h <= 12 ? h : h - 12;
                            return `${amp} ${displayH === 0 ? 12 : displayH}시${m > 0 ? ` ${m}분` : ''}`;
                        })()}
                    </div>
                </div>

                {/* Calendar Grid */}
                {showCalendar && (
                    <div className="mb-16 relative z-10 max-w-[320px] mx-auto">
                        <div className="grid grid-cols-7 mb-6">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                                <div
                                    key={d}
                                    className={`text-center tracking-tighter font-semibold ${i === 0 ? 'text-red-300' : 'text-gray-300'}`}
                                    style={{ fontSize: 'calc(9px * var(--font-scale))' }}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-3">
                            {(() => {
                                const d = new Date(date);
                                const year = d.getFullYear();
                                const month = d.getMonth();
                                const firstDay = new Date(year, month, 1).getDay();
                                const days = [];
                                const weddingDay = d.getDate();

                                // Empty slots
                                for (let i = 0; i < firstDay; i++) {
                                    days.push(<div key={`empty-${i}`} />);
                                }

                                // Days
                                const lastDate = new Date(year, month + 1, 0).getDate();
                                for (let i = 1; i <= lastDate; i++) {
                                    const isWedding = i === weddingDay;
                                    const current = new Date(year, month, i);
                                    const isSun = current.getDay() === 0;

                                    days.push(
                                        <div key={i} className="flex items-center justify-center relative h-10">
                                            {isWedding && (
                                                <div
                                                    className="absolute inset-0 m-auto w-8 h-8 rounded-full opacity-10 animate-pulse-slow scale-125"
                                                    style={{ backgroundColor: theme.accentColor }}
                                                ></div>
                                            )}
                                            <div
                                                className={`flex items-center justify-center rounded-full text-[14px] transition-all duration-500 z-10
                                   ${isWedding ? 'text-white w-8 h-8 font-medium' : (isSun ? 'text-red-300' : 'text-gray-600 font-light')}
                                `}
                                                style={isWedding ? { backgroundColor: theme.accentColor } : {}}
                                            >
                                                {i}
                                            </div>
                                        </div>
                                    );
                                }
                                return days;
                            })()}
                        </div>
                    </div>
                )}

                {/* D-Day Countdown */}
                {showDday && (
                    <div className="text-center relative z-10 animate-in fade-in duration-1000">
                        <div className="inline-block px-10 py-8 border border-forest-green/10 rounded-full">
                            <div className="flex justify-center gap-8 mb-4 font-serif">
                                <div className="flex flex-col items-center">
                                    <span
                                        className="text-gray-300 uppercase tracking-widest mb-1 font-sans"
                                        style={{ fontSize: 'calc(9px * var(--font-scale))' }}
                                    >Days</span>
                                    <span
                                        className="text-gray-700 font-light"
                                        style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                    >{timeLeft?.days || 0}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span
                                        className="text-gray-300 uppercase tracking-widest mb-1 font-sans"
                                        style={{ fontSize: 'calc(9px * var(--font-scale))' }}
                                    >Hours</span>
                                    <span
                                        className="text-gray-700 font-light"
                                        style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                    >{timeLeft?.hours || 0}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span
                                        className="text-gray-300 uppercase tracking-widest mb-1 font-sans"
                                        style={{ fontSize: 'calc(9px * var(--font-scale))' }}
                                    >Mins</span>
                                    <span
                                        className="text-gray-700 font-light"
                                        style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                    >{timeLeft?.minutes || 0}</span>
                                </div>
                            </div>

                            <div
                                className="text-gray-500 font-light tracking-wide whitespace-pre-wrap"
                                style={{ fontSize: 'calc(13px * var(--font-scale))' }}
                            >
                                {ddayMessage
                                    .replace('(신랑)', groom.firstName)
                                    .replace('(신부)', bride.firstName)
                                    .replace('(D-Day)', dDay.toString())
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
