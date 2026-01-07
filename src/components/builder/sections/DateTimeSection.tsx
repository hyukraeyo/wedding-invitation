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
            <div className="space-y-6">
                {/* Date */}
                <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                    <label className="text-sm text-gray-700">예식일</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-forest-green"
                    />
                </div>

                {/* Time */}
                <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                    <label className="text-sm text-gray-700">예식시간</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                value={currentHour}
                                onChange={(e) => handleTimeChange('hour', parseInt(e.target.value))}
                                className="w-full appearance-none px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-forest-green pr-8"
                            >
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>
                                        {i < 12 ? `오전 ${i === 0 ? 12 : i}시` : `오후 ${i === 12 ? 12 : i - 12}시`}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1">
                            <select
                                value={currentMinute}
                                onChange={(e) => handleTimeChange('minute', parseInt(e.target.value))}
                                className="w-full appearance-none px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-forest-green pr-8"
                            >
                                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                                    <option key={m} value={parseInt(m)}>{m}분</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Display Options */}
                <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                    <label className="text-sm text-gray-700 pt-1">표시</label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showCalendar}
                                onChange={(e) => setShowCalendar(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                            />
                            <span className="text-sm text-gray-800">캘린더</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showDday}
                                onChange={(e) => setShowDday(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                            />
                            <span className="text-sm text-gray-800">디데이 & 카운트다운</span>
                        </label>
                    </div>
                </div>

                {/* D-Day Message Editor */}
                {showDday && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mt-2">
                        {/* Visual Toolbar */}
                        <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-white">
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><span className="font-bold text-xs serif">B</span></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><span className="italic text-xs serif">I</span></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><span className="underline text-xs serif">U</span></button>
                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <button className="flex items-center gap-1 p-1.5 hover:bg-gray-100 rounded text-gray-600 text-xs">
                                <span className="underline decoration-black decoration-2">A</span>
                                <ChevronDown size={10} />
                            </button>
                            <button className="flex items-center gap-1 p-1.5 hover:bg-gray-100 rounded text-gray-600 text-xs bg-gray-800 text-white">
                                <span>A</span>
                                <ChevronDown size={10} />
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4">
                            <input
                                type="text"
                                value={ddayMessage}
                                onChange={(e) => setDdayMessage(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400"
                                placeholder="디데이 메시지를 입력하세요"
                            />
                        </div>
                    </div>
                )}
            </div>
        </AccordionItem>
    );
}
