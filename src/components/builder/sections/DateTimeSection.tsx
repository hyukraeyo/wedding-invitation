import React from 'react';
import { Calendar } from 'lucide-react';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useShallow } from 'zustand/react/shallow';
import { AccordionItem } from '@/components/common/AccordionItem';
import { TextField } from '@/components/common/TextField';
import { SwitchField } from '@/components/common/SwitchField';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { TimePicker } from '@/components/common/TimePicker';
import { DatePicker } from '@/components/common/DatePicker';
import styles from './DateTimeSection.module.scss';
import type { SectionProps } from '@/types/builder';

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection({ isOpen, value }) {
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
        <AccordionItem
            value={value}
            title="예식 일시"
            icon={Calendar}
            isOpen={isOpen}
            isCompleted={!!date && !!time}
        >
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
                <SwitchField
                    checked={showCalendar}
                    onChange={setShowCalendar}
                    label="달력 노출"
                />

                <div className={styles.switchGroup}>
                    <SwitchField
                        checked={showDday}
                        onChange={setShowDday}
                        label="D-Day 노출"
                    />
                    {showDday ? (
                        <div className={styles.ddayInputWrapper}>
                            <TextField
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
        </AccordionItem>
    );
});

export default DateTimeSection;
