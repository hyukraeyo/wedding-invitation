import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
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

    // Helper for Time
    const [hourStr, minuteStr] = time ? time.split(':') : ['', ''];
    const currentHour = hourStr ? parseInt(hourStr, 10) : 12;
    const currentMinute = minuteStr ? parseInt(minuteStr, 10) : 0;

    const handleTimeChange = (type: 'hour' | 'minute', val: number) => {
        let newH = currentHour;
        let newM = currentMinute;
        if (type === 'hour') newH = val;
        if (type === 'minute') newM = val;
        setTime(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
    };

    return (
        <AccordionItem
            title="예식 일시"
            icon={Calendar}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!date && !!time}
        >
            <div className="space-y-8">
                {/* Date Selection */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">예식일</label>
                    <div className="relative group">
                        <div className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl group-hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
                            <span className="text-[15px] font-medium text-gray-800">
                                {date ? date.split('-').join('. ') + '.' : '날짜를 선택해주세요'}
                            </span>
                            <Calendar size={18} className="text-forest-green opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">예식시간</label>
                    <div className="flex gap-3">
                        <div className="flex-1 relative group">
                            <select
                                value={currentHour}
                                onChange={(e) => handleTimeChange('hour', parseInt(e.target.value))}
                                className="w-full appearance-none px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px] text-gray-800 font-medium focus:ring-2 focus:ring-forest-green/10 outline-none transition-all cursor-pointer shadow-sm"
                            >
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>
                                        {i < 12 ? `오전 ${i === 0 ? 12 : i}시` : `오후 ${i === 12 ? 12 : i - 12}시`}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-forest-green transition-colors" />
                        </div>
                        <div className="flex-1 relative group">
                            <select
                                value={currentMinute}
                                onChange={(e) => handleTimeChange('minute', parseInt(e.target.value))}
                                className="w-full appearance-none px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px] text-gray-800 font-medium focus:ring-2 focus:ring-forest-green/10 outline-none transition-all cursor-pointer shadow-sm"
                            >
                                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                                    <option key={m} value={parseInt(m)}>{m}분</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-forest-green transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Display Options (Minimal Chips) */}
                <div className="space-y-4">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">표시 설정</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${showCalendar
                                ? 'bg-forest-green border-forest-green text-white shadow-md'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${showCalendar ? 'bg-white' : 'bg-gray-200'}`} />
                            캘린더 표시
                        </button>

                        <button
                            onClick={() => setShowDday(!showDday)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${showDday
                                ? 'bg-forest-green border-forest-green text-white shadow-md'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${showDday ? 'bg-white' : 'bg-gray-200'}`} />
                            디데이 & 카운트다운
                        </button>
                    </div>
                </div>

                {/* D-Day Message Editor */}
                {showDday && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs text-gray-500 font-medium">디데이 문구 수정</label>
                            <span className="text-[10px] text-gray-400">*(D-Day) 자리는 자동으로 숫자가 표시됩니다</span>
                        </div>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            {/* Visual Toolbar */}
                            <div className="flex items-center gap-1 p-2 border-b border-gray-50 bg-gray-50/30">
                                <button className="p-1.5 hover:bg-white rounded text-gray-400 transition-colors cursor-not-allowed"><span className="font-bold text-xs serif">B</span></button>
                                <button className="p-1.5 hover:bg-white rounded text-gray-400 transition-colors cursor-not-allowed"><span className="italic text-xs serif">I</span></button>
                                <button className="p-1.5 hover:bg-white rounded text-gray-400 transition-colors cursor-not-allowed"><span className="underline text-xs serif">U</span></button>
                                <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
                                <button className="p-1.5 hover:bg-white rounded text-forest-green text-xs font-medium bg-white shadow-sm px-2">
                                    (신랑)
                                </button>
                                <button className="p-1.5 hover:bg-white rounded text-forest-green text-xs font-medium bg-white shadow-sm px-2">
                                    (신부)
                                </button>
                            </div>

                            <div className="p-4 bg-white">
                                {(() => {
                                    const parts = ddayMessage.split('(D-Day)');
                                    const prefix = parts[0] || '';
                                    const suffix = parts.slice(1).join('(D-Day)') || '';

                                    return (
                                        <div className="flex flex-wrap items-center gap-y-2 text-sm">
                                            <input
                                                type="text"
                                                value={prefix}
                                                onChange={(e) => setDdayMessage(`${e.target.value}(D-Day)${suffix}`)}
                                                className="min-w-[60px] flex-1 bg-gray-50/50 border-none outline-none p-2 rounded-lg text-gray-900 focus:bg-gray-50 transition-colors"
                                                placeholder="앞 문구"
                                            />
                                            <div className="mx-2 px-3 py-1 bg-forest-green text-white rounded-full text-[11px] font-bold shadow-sm select-none">
                                                D-Day
                                            </div>
                                            <input
                                                type="text"
                                                value={suffix}
                                                onChange={(e) => setDdayMessage(`${prefix}(D-Day)${e.target.value}`)}
                                                className="min-w-[60px] flex-1 bg-gray-50/50 border-none outline-none p-2 rounded-lg text-gray-900 focus:bg-gray-50 transition-colors"
                                                placeholder="뒷 문구"
                                            />
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
