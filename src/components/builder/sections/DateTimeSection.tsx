import React from 'react';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useShallow } from 'zustand/react/shallow';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/common/FormField';
import { Switch } from '@/components/ui/Switch';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { TimePicker } from '@/components/common/TimePicker';
import { DatePicker } from '@/components/common/DatePicker';
import styles from './DateTimeSection.module.scss';
import type { SectionProps } from '@/types/builder';

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection({ value }) {
    const {
        date,
        setDate,
        time,
        setTime,
        showCalendar,
        setShowCalendar,
        showDday,
        setShowDday,
        ddayMessage,
        setDdayMessage
    } = useInvitationStore(useShallow((state) => ({
        date: state.date,
        setDate: state.setDate,
        time: state.time,
        setTime: state.setTime,
        showCalendar: state.showCalendar,
        setShowCalendar: state.setShowCalendar,
        showDday: state.showDday,
        setShowDday: state.setShowDday,
        ddayMessage: state.ddayMessage,
        setDdayMessage: state.setDdayMessage,
    })));

    return (
        <AccordionItem value={value} autoScroll>
            <AccordionTrigger>
                예식 일시
            </AccordionTrigger>
            <AccordionContent>
                <SectionContainer>
                    {/* Date & Time Picking */}
                    <Field label="예식일">
                        <DatePicker
                            value={date}
                            onChange={(value) => setDate(value)}
                        />
                    </Field>
                    <Field label="예식 시간">
                        <TimePicker
                            value={time}
                            onChange={(value) => setTime(value)}
                        />
                    </Field>

                    {/* Additional Options */}
                    <FormField label="달력 노출" layout="horizontal" align="center">
                        <Switch
                            checked={showCalendar}
                            onCheckedChange={setShowCalendar}
                        />
                    </FormField>

                    <div className={styles.switchGroup}>
                        <FormField label="D-Day 노출" layout="horizontal" align="center">
                            <Switch
                                checked={showDday}
                                onCheckedChange={setShowDday}
                            />
                        </FormField>
                        {showDday ? (
                            <div className={styles.ddayInputWrapper}>
                                <Input
                                    placeholder="예: (신랑), (신부)의 결혼식이 (D-Day) 남았습니다"
                                    value={ddayMessage}
                                    onChange={(e) => setDdayMessage(e.target.value)}
                                />
                                <InfoMessage>
                                    (신랑), (신부), (D-Day)는 실제 이름과 날짜로 자동 치환됩니다.
                                </InfoMessage>
                            </div>
                        ) : null}
                    </div>
                </SectionContainer>
            </AccordionContent>
        </AccordionItem>
    );
});

export default DateTimeSection;
