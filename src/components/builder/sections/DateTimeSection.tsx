'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderSelect } from '../BuilderSelect';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderField } from '../BuilderField';
import { BuilderCollapse } from '../BuilderCollapse';
import { BuilderCalendar } from '../BuilderCalendar';
import { BuilderTextField } from '../BuilderTextField';
import { Section, Stack, Row, Divider } from '../BuilderLayout';
import commonStyles from '../Builder.module.scss';
import sectionStyles from './DateTimeSection.module.scss';

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
    } = useInvitationStore();

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
            <Section>
                {/* 예식일 */}
                <BuilderField label="예식일">
                    <BuilderCalendar
                        value={date}
                        onChange={setDate}
                        placeholder="날짜 선택"
                    />
                </BuilderField>

                {/* 예식시간 */}
                <BuilderField label="예식시간">
                    <Row gap="md">
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
                    </Row>
                </BuilderField>

                {/* 표시 설정 */}
                <BuilderField label="표시 설정">
                    <Row wrap>
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
                    </Row>
                </BuilderField>

                {/* D-Day Message Editor */}
                {showDday && (
                    <>
                        <Divider />
                        <Stack gap="md">
                            <BuilderCollapse
                                label="디데이 문구 커스텀"
                                isOpen={showDdayEditor}
                                onToggle={() => setShowDdayEditor(!showDdayEditor)}
                            >
                                <div className={sectionStyles.ddayEditor}>
                                    {(() => {
                                        const parts = ddayMessage.split('(D-Day)');
                                        const prefix = parts[0] || '';
                                        const suffix = parts.slice(1).join('(D-Day)') || '';

                                        const displayPrefix = prefix
                                            .replace(/\(신랑\)/g, groom.firstName || '신랑')
                                            .replace(/\(신부\)/g, bride.firstName || '신부');

                                        const displaySuffix = suffix
                                            .replace(/\(신랑\)/g, groom.firstName || '신랑')
                                            .replace(/\(신부\)/g, bride.firstName || '신부');

                                        const handleInputChange = (newVal: string, isPrefix: boolean) => {
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
                                            <Stack gap="lg">
                                                <BuilderTextField
                                                    label="시작 문구"
                                                    value={displayPrefix}
                                                    onChange={(e) => handleInputChange(e.target.value, true)}
                                                    className={sectionStyles.messageInput}
                                                    placeholder="결혼식까지 남음"
                                                />

                                                <Row align="center" justify="center">
                                                    <div className={commonStyles.placeholderIndicator}>
                                                        D-DAY 카운트 표시 위치
                                                    </div>
                                                </Row>

                                                <BuilderTextField
                                                    label="종료 문구"
                                                    value={displaySuffix}
                                                    onChange={(e) => handleInputChange(e.target.value, false)}
                                                    className={sectionStyles.messageInput}
                                                    placeholder="남았습니다"
                                                />
                                            </Stack>
                                        );
                                    })()}
                                </div>
                            </BuilderCollapse>
                        </Stack>
                    </>
                )}
            </Section>
        </AccordionItem>
    );
});

export default DateTimeSection;
