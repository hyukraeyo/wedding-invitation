'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderSelect } from '../BuilderSelect';
// BuilderLabel removed
import { BuilderButton } from '../BuilderButton';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderInput } from '../BuilderInput';
import { BuilderField } from '../BuilderField';
import { SubAccordion } from '../SubAccordion';
import { BuilderCalendar } from '../BuilderCalendar';
import { BuilderTextField } from '../BuilderTextField';


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


    // States
    const [showDdayEditor, setShowDdayEditor] = useState(false);

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
            <div className="space-y-6">
                {/* Custom Date Picker */}
                <BuilderField label="예식일">
                    <BuilderCalendar
                        value={date}
                        onChange={setDate}
                        placeholder="날짜 선택"
                    />
                </BuilderField>

                {/* Refined Time Picker (Using BuilderSelect) */}
                <BuilderField label="예식시간">
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
                </BuilderField>

                {/* Display Options */}
                <BuilderField label="표시 설정">
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
                </BuilderField>

                {/* D-Day Message Editor */}
                {showDday && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <SubAccordion
                            label="디데이 문구 커스텀"
                            isOpen={showDdayEditor}
                            onClick={() => setShowDdayEditor(!showDdayEditor)}
                        />


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
                                            <BuilderTextField
                                                label="시작 문구"
                                                value={displayPrefix}
                                                onChange={(e) => handleInputChange(e.target.value, true)}
                                                className="text-center font-bold !bg-white"
                                                placeholder="결혼식까지 남음"
                                                containerClassName="text-center"
                                            />

                                            <div className="flex items-center justify-center">
                                                <div className="px-5 py-2 border border-dashed border-gray-200 text-gray-400 rounded-full text-[11px] font-bold tracking-tight bg-white/50">
                                                    D-DAY 카운트 표시 위치
                                                </div>
                                            </div>

                                            <BuilderTextField
                                                label="종료 문구"
                                                value={displaySuffix}
                                                onChange={(e) => handleInputChange(e.target.value, false)}
                                                className="text-center font-bold !bg-white"
                                                placeholder="남았습니다"
                                                containerClassName="text-center"
                                            />
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
