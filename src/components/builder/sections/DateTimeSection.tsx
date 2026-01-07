import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function DateTimeSection({ isOpen, onToggle }: SectionProps) {
    const {
        date, setDate,
        time, setTime,
        showCalendar, setShowCalendar,
        showDday, setShowDday,
        ddayMessage, setDdayMessage
    } = useInvitationStore();

    // Calendar States
    const [viewDate, setViewDate] = useState(date ? new Date(date) : new Date());
    const [showPicker, setShowPicker] = useState(false);

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

    // Calendar logic
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = startDayOfMonth(year, month);
        const days = [];

        // Padding for start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 text-gray-100 flex items-center justify-center text-[11px]">.</div>);
        }

        // Days of month
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
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">예식일</label>
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
                                {/* Calendar Header */}
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

                                {/* Weekdays */}
                                <div className="grid grid-cols-7 mb-4">
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                                        <div key={d} className={`text-center text-[9px] font-black tracking-tighter ${i === 0 ? 'text-red-300' : 'text-gray-300'}`}>
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-y-1">
                                    {renderCalendar()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Refined Time Picker */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">예식시간</label>
                    <div className="flex gap-4 p-1 bg-gray-100/30 rounded-[28px] border border-gray-50">
                        {/* Hour Dropdown (Custom Styled) */}
                        <div className="flex-1 relative group bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden group">
                            <select
                                value={currentHour}
                                onChange={(e) => handleTimeChange('hour', parseInt(e.target.value))}
                                className="w-full appearance-none px-6 py-4.5 bg-transparent text-[15px] text-gray-800 font-serif font-bold outline-none cursor-pointer pr-12 transition-all focus:bg-gray-50/50"
                            >
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i} className="font-sans">
                                        {i < 12 ? `오전 ${i === 0 ? 12 : i}시` : `오후 ${i === 12 ? 12 : i - 12}시`}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-forest-green transition-colors">
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        {/* Minute Dropdown (Custom Styled) */}
                        <div className="flex-1 relative group bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden group">
                            <select
                                value={currentMinute}
                                onChange={(e) => handleTimeChange('minute', parseInt(e.target.value))}
                                className="w-full appearance-none px-6 py-4.5 bg-transparent text-[15px] text-gray-800 font-serif font-bold outline-none cursor-pointer pr-12 transition-all focus:bg-gray-50/50"
                            >
                                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                                    <option key={m} value={parseInt(m)} className="font-sans">{m}분</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-forest-green transition-colors">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Options (Minimal Chips) */}
                <div className="space-y-4 pt-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">표시 설정</label>
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
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">디데이 문구 커스텀</label>
                            <div className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-gray-400 font-bold tracking-tighter">PREMIUM</div>
                        </div>
                        <div className="border border-gray-100 rounded-[28px] overflow-hidden bg-white shadow-xl shadow-black/[0.02] ring-1 ring-black/[0.01]">
                            {/* Visual Toolbar */}
                            <div className="flex items-center gap-1.5 p-3 bg-gray-50/30 border-b border-gray-50/50">
                                <div className="flex gap-1.5 ml-1 mr-3">
                                    <div className="w-2 h-2 rounded-full bg-red-200" />
                                    <div className="w-2 h-2 rounded-full bg-amber-200" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-200" />
                                </div>
                                <div className="w-[1px] h-3 bg-gray-200 mx-1" />
                                <button className="px-3 py-1.5 hover:bg-white rounded-xl text-forest-green text-[10px] font-black tracking-tight transition-all bg-white shadow-sm border border-gray-100 active:scale-95">
                                    (신랑)
                                </button>
                                <button className="px-3 py-1.5 hover:bg-white rounded-xl text-forest-green text-[10px] font-black tracking-tight transition-all bg-white shadow-sm border border-gray-100 active:scale-95">
                                    (신부)
                                </button>
                            </div>

                            <div className="p-6 bg-white space-y-4">
                                {(() => {
                                    const parts = ddayMessage.split('(D-Day)');
                                    const prefix = parts[0] || '';
                                    const suffix = parts.slice(1).join('(D-Day)') || '';

                                    return (
                                        <div className="flex flex-col gap-4">
                                            <div className="group">
                                                <input
                                                    type="text"
                                                    value={prefix}
                                                    onChange={(e) => setDdayMessage(`${e.target.value}(D-Day)${suffix}`)}
                                                    className="w-full bg-gray-50/50 border border-transparent focus:border-forest-green/20 focus:bg-white outline-none p-4 rounded-2xl text-[14px] text-gray-800 transition-all font-medium placeholder:text-gray-300"
                                                    placeholder="앞 문구 (예: 저희의 시작이)"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center relative">
                                                <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                                                <div className="relative px-6 py-2 bg-white border border-forest-green/10 text-forest-green rounded-full text-[10px] font-black tracking-[0.25em] shadow-sm select-none">
                                                    D - DAY
                                                </div>
                                            </div>
                                            <div className="group">
                                                <input
                                                    type="text"
                                                    value={suffix}
                                                    onChange={(e) => setDdayMessage(`${prefix}(D-Day)${e.target.value}`)}
                                                    className="w-full bg-gray-50/50 border border-transparent focus:border-forest-green/20 focus:bg-white outline-none p-4 rounded-2xl text-[14px] text-gray-800 transition-all font-medium placeholder:text-gray-300"
                                                    placeholder="뒷 문구 (예: 일 남았습니다)"
                                                />
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
}
