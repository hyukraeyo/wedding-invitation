import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderSelect } from '../BuilderSelect';
import { BuilderLabel } from '../BuilderLabel';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection({ isOpen, onToggle }) {
    const {
        date, setDate,
        time, setTime,
        showCalendar, setShowCalendar,
        showDday, setShowDday,
        ddayMessage, setDdayMessage,
        groom, bride
    } = useInvitationStore();

    const dDay = date ? Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Calendar States
    const [viewDate, setViewDate] = useState(date ? new Date(date) : new Date());
    const [showPicker, setShowPicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Time Helpers
    const [hourStr, minuteStr] = (time || '12:00').split(':').concat(['00']).slice(0, 2);
    const currentHour = parseInt(hourStr || '12', 10);
    const currentMinute = parseInt(minuteStr || '00', 10);

    const handleTimeChange = (type: 'hour' | 'minute', val: number) => {
        let newH = currentHour;
        let newM = currentMinute;
        if (type === 'hour') newH = val;
        if (type === 'minute') newM = val;
        setTime(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
    };

    // Close calendar on click outside or scroll
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };
        const handleScroll = () => {
            if (showPicker) setShowPicker(false);
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [showPicker]);

    // Calendar logic
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = startDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 text-gray-100 flex items-center justify-center text-[11px]">.</div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = date === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            days.push(
                <button
                    key={day}
                    onClick={() => {
                        setDate(dateStr);
                        setShowPicker(false);
                    }}
                    className={`h-10 w-10 rounded-full text-[13px] font-medium transition-all relative flex items-center justify-center
                        ${isSelected ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20 scale-105' : 'hover:bg-gray-50 text-gray-700'}
                        ${isToday && !isSelected ? 'text-forest-green border border-forest-green/20' : ''}`}
                >
                    {day}
                    {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-forest-green rounded-full" />}
                </button>
            );
        }
        return days;
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const hourOptions = Array.from({ length: 24 }).map((_, i) => ({
        label: i < 12 ? `오전 ${i === 0 ? 12 : i}시` : `오후 ${i === 12 ? 12 : i - 12}시`,
        value: i
    }));

    const minuteOptions = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => ({
        label: `${m}분`,
        value: parseInt(m)
    }));

    return (
        <AccordionItem
            title="예식 일시"
            icon={CalendarIcon}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!date && !!time}
        >
            <div className="space-y-8">
                {/* Custom Date Picker */}
                <div ref={datePickerRef}>
                    <BuilderLabel>예식일</BuilderLabel>
                    <div className="relative">
                        <button
                            onClick={() => setShowPicker(!showPicker)}
                            className={`w-full flex items-center justify-between px-5 py-4 border rounded-2xl transition-all shadow-sm
                                ${showPicker ? 'bg-white border-forest-green ring-4 ring-forest-green/5' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'}`}
                        >
                            <span className="text-[15px] font-medium text-gray-800">
                                {date ? date.split('-').join('. ') + '.' : '날짜를 선택해주세요'}
                            </span>
                            <CalendarIcon size={18} className={`transition-colors ${showPicker ? 'text-forest-green' : 'text-gray-300'}`} />
                        </button>

                        {showPicker && (
                            <div className="mt-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 z-30 relative">
                                <div className="flex items-center justify-between mb-6 px-1">
                                    <h4 className="font-serif text-lg text-gray-800 font-bold">
                                        {viewDate.getFullYear()}년 <span className="text-forest-green ml-1">{viewDate.getMonth() + 1}월</span>
                                    </h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50 shadow-sm">
                                            <ChevronLeft size={16} className="text-gray-400" />
                                        </button>
                                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50 shadow-sm">
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 mb-4">
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                                        <div key={d} className={`text-center text-[9px] font-black tracking-tighter ${i === 0 ? 'text-red-300' : 'text-gray-300'}`}>
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-1">
                                    {renderCalendar()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Refined Time Picker (Using BuilderSelect) */}
                <div>
                    <BuilderLabel>예식시간</BuilderLabel>
                    <div className="flex gap-4 p-1 bg-gray-100/30 rounded-[28px] border border-gray-50">
                        <BuilderSelect
                            value={currentHour}
                            options={hourOptions}
                            onChange={(val) => handleTimeChange('hour', val)}
                        />
                        <BuilderSelect
                            value={currentMinute}
                            options={minuteOptions}
                            onChange={(val) => handleTimeChange('minute', val)}
                        />
                    </div>
                </div>

                {/* Display Options */}
                <div className="pt-2">
                    <BuilderLabel>표시 설정</BuilderLabel>
                    <div className="flex flex-wrap gap-2.5 px-1">
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-full text-[11px] font-black tracking-tight transition-all border ${showCalendar
                                ? 'bg-forest-green border-forest-green text-white shadow-xl shadow-forest-green/20 scale-[1.02]'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${showCalendar ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
                            캘린더 표시
                        </button>
                        <button
                            onClick={() => setShowDday(!showDday)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-full text-[11px] font-black tracking-tight transition-all border ${showDday
                                ? 'bg-forest-green border-forest-green text-white shadow-xl shadow-forest-green/20 scale-[1.02]'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${showDday ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
                            디데이 & 카운트다운
                        </button>
                    </div>
                </div>

                {/* D-Day Message Editor */}
                {showDday && (
                    <div className="pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between px-1 mb-1">
                            <BuilderLabel className="!mb-0 text-[10px] tracking-[0.2em]">디데이 문구 커스텀</BuilderLabel>
                            <div className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-gray-400 font-bold tracking-tighter">PREMIUM</div>
                        </div>
                        <div className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-xl shadow-black/[0.02] ring-1 ring-black/[0.01]">
                            <div className="p-8 bg-white">
                                {(() => {
                                    const parts = ddayMessage.split('(D-Day)');
                                    const prefix = parts[0] || '';
                                    const suffix = parts.slice(1).join('(D-Day)') || '';

                                    // Replace tags with real names for the input value
                                    const displayPrefix = prefix
                                        .replace(/\(신랑\)/g, groom.firstName || '신랑')
                                        .replace(/\(신부\)/g, bride.firstName || '신부');

                                    const displaySuffix = suffix
                                        .replace(/\(신랑\)/g, groom.firstName || '신랑')
                                        .replace(/\(신부\)/g, bride.firstName || '신부');

                                    const handleInputChange = (newVal: string, isPrefix: boolean) => {
                                        // Reverse mapping: replace names back with tags for storage
                                        // We escape regex special characters in name just in case
                                        const escGroom = (groom.firstName || '신랑').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        const escBride = (bride.firstName || '신부').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                                        const mappedValue = newVal
                                            .replace(new RegExp(escGroom, 'g'), '(신랑)')
                                            .replace(new RegExp(escBride, 'g'), '(신부)');

                                        if (isPrefix) {
                                            setDdayMessage(`${mappedValue}(D-Day)${suffix}`);
                                        } else {
                                            setDdayMessage(`${prefix}(D-Day)${mappedValue}`);
                                        }
                                    };

                                    return (
                                        <div className="space-y-6">
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={displayPrefix}
                                                    onChange={(e) => handleInputChange(e.target.value, true)}
                                                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-forest-green outline-none py-3 text-center text-[16px] text-gray-800 transition-all font-serif font-bold placeholder:text-gray-200"
                                                    placeholder="결혼식까지 남음"
                                                />
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity whitespace-nowrap">
                                                    <span className="text-[9px] font-black text-forest-green/50 uppercase tracking-widest">START TEXT</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="px-6 py-2.5 bg-forest-green/[0.03] border border-forest-green/10 text-forest-green rounded-full text-[11px] font-black tracking-[0.3em] shadow-sm animate-pulse-subtle">
                                                        D - {dDay}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={displaySuffix}
                                                    onChange={(e) => handleInputChange(e.target.value, false)}
                                                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-forest-green outline-none py-3 text-center text-[16px] text-gray-800 transition-all font-serif font-bold placeholder:text-gray-200"
                                                    placeholder="남았습니다"
                                                />
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity whitespace-nowrap">
                                                    <span className="text-[9px] font-black text-forest-green/50 uppercase tracking-widest">END TEXT</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AccordionItem>
    );
});

export default DateTimeSection;
