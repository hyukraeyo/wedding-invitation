import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderSelect } from '../BuilderSelect';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderButton } from '../BuilderButton';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderInput } from '../BuilderInput';

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
        groom, bride,
        theme: { accentColor }
    } = useInvitationStore();


    // Calendar States
    const [viewDate, setViewDate] = useState(date ? new Date(date) : new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [showDdayEditor, setShowDdayEditor] = useState(false);
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
                        ${isSelected ? 'text-white shadow-lg scale-105' : 'hover:bg-gray-50 text-gray-700'}
                        ${isToday && !isSelected ? 'border' : ''}`}
                    style={{
                        backgroundColor: isSelected ? accentColor : undefined,
                        boxShadow: isSelected ? `0 4px 12px ${accentColor}40` : undefined,
                        color: isToday && !isSelected ? accentColor : undefined,
                        borderColor: isToday && !isSelected ? `${accentColor}40` : undefined
                    }}
                >
                    {day}
                    {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />}
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
                            className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl transition-all
                                ${showPicker ? 'bg-white ring-4' : 'bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-white'}`}
                            style={showPicker ? {
                                borderColor: accentColor,
                                boxShadow: `0 0 0 4px ${accentColor}0D` // 5% opacity
                            } : {}}
                        >
                            <span className={`text-[14px] font-bold ${date ? 'text-gray-900' : 'text-gray-300'}`}>
                                {date ? date.split('-').join('. ') + '.' : '날짜를 선택해주세요'}
                            </span>
                            <CalendarIcon
                                size={18}
                                className={`transition-colors shrink-0 ${showPicker ? '' : 'text-gray-400'}`}
                                style={showPicker ? { color: accentColor } : {}}
                            />
                        </button>

                        {showPicker && (
                            <div className="mt-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 z-30 relative">
                                <div className="flex items-center justify-between mb-6 px-1">
                                    <h4 className="font-serif text-lg text-gray-800 font-bold text-[15px]">
                                        {viewDate.getFullYear()}년 <span className="ml-1 font-black" style={{ color: accentColor }}>{viewDate.getMonth() + 1}월</span>
                                    </h4>
                                    <div className="flex gap-2">
                                        <BuilderButton variant="outline" size="sm" onClick={() => changeMonth(-1)} className="w-8 h-8 p-0">
                                            <ChevronLeft size={16} />
                                        </BuilderButton>
                                        <BuilderButton variant="outline" size="sm" onClick={() => changeMonth(1)} className="w-8 h-8 p-0">
                                            <ChevronRight size={16} />
                                        </BuilderButton>
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
                    <div className="flex gap-3">
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
                    <div className="flex flex-wrap gap-2 px-1">
                        <BuilderToggle
                            checked={showCalendar}
                            onChange={setShowCalendar}
                            label="캘린더 표시"
                        />
                        <BuilderToggle
                            checked={showDday}
                            onChange={setShowDday}
                            label="디데이 & 카운트다운"
                        />
                    </div>
                </div>

                {/* D-Day Message Editor */}
                {showDday && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <button
                            onClick={() => setShowDdayEditor(!showDdayEditor)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-white border border-gray-100 rounded-xl transition-all group"
                        >
                            <div className="flex items-center gap-2">
                                <BuilderLabel className="!mb-0 text-gray-500">디데이 문구 커스텀</BuilderLabel>
                                <span className="px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[8px] text-gray-400 font-black tracking-tighter">PREMIUM</span>
                            </div>
                            <ChevronDown
                                size={14}
                                className={`text-gray-400 transition-transform duration-300 ${showDdayEditor ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {showDdayEditor && (
                            <div className="rounded-2xl bg-gray-50/30 border border-gray-50 p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
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
                                            <div className="space-y-2 text-center">
                                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-1">시작 문구</label>
                                                <BuilderInput
                                                    type="text"
                                                    value={displayPrefix}
                                                    onChange={(e) => handleInputChange(e.target.value, true)}
                                                    className="text-center font-bold !bg-white"
                                                    placeholder="결혼식까지 남음"
                                                />
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <div className="px-5 py-2 border border-dashed border-gray-200 text-gray-400 rounded-full text-[11px] font-bold tracking-tight bg-white/50">
                                                    D-DAY 카운트 표시 위치
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-center">
                                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-1">종료 문구</label>
                                                <BuilderInput
                                                    type="text"
                                                    value={displaySuffix}
                                                    onChange={(e) => handleInputChange(e.target.value, false)}
                                                    className="text-center font-bold !bg-white"
                                                    placeholder="남았습니다"
                                                />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AccordionItem>
    );
});

export default DateTimeSection;
