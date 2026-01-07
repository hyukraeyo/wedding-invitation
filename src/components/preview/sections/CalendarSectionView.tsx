import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
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
        <div className="my-16 px-6 w-full">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                {/* 2026.01.06 Header */}
                <div className="text-center mb-8 space-y-2 relative z-10">
                    <div className="text-2xl font-serif tracking-widest text-gray-700">
                        {date.replace(/-/g, '.')}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        {new Date(date).toLocaleDateString('ko-KR', { weekday: 'long' })}
                        {' '}
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

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-gray-200/60 mb-8" />

                {/* Calendar Grid */}
                {showCalendar && (
                    <div className="mb-10 relative z-10">
                        <div className="grid grid-cols-7 mb-4">
                            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                                <div key={d} className={`text-center text-xs font-medium ${i === 0 ? 'text-red-400' : 'text-gray-600'}`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-4">
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
                                        <div key={i} className="flex items-center justify-center">
                                            <div
                                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
                                  ${isWedding ? 'text-white shadow-md transform scale-110' : (isSun ? 'text-red-400 opacity-80' : 'text-gray-700')}
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

                {theme.pattern !== 'none' && (
                    <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
                        <Heart size={100} fill={theme.accentColor} stroke="none" />
                    </div>
                )}

                {/* Divider Line (only if D-Day follows) */}
                {showDday && showCalendar && <div className="w-full h-[1px] bg-gray-200/60 mb-10" />}

                {/* D-Day Countdown */}
                {showDday && (
                    <div className="text-center relative z-10">
                        <div className="flex justify-center gap-6 mb-6 font-serif">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Days</span>
                                <span className="text-2xl text-gray-800">{timeLeft?.days || 0}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Hour</span>
                                <span className="text-2xl text-gray-800">{timeLeft?.hours || 0}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Min</span>
                                <span className="text-2xl text-gray-800">{timeLeft?.minutes || 0}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Sec</span>
                                <span className="text-2xl text-gray-800">{timeLeft?.seconds || 0}</span>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 font-medium whitespace-pre-wrap">
                            {ddayMessage
                                .replace('(신랑)', groom.firstName)
                                .replace('(신부)', bride.firstName)
                                .replace('(D-Day)', dDay.toString())
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
