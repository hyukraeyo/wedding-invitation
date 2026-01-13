import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SwitchField } from '../SwitchField';
import { Field } from '../Field';
import { TimePicker } from '../TimePicker';
import { DatePicker } from '../DatePicker';
import styles from './DateTimeSection.module.scss';

interface SectionProps {
    value: string;
    isOpen: boolean;
    onToggle: () => void;
}

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection({ isOpen, onToggle, value }) {
    const {
        date, setDate,
        time, setTime,
        showCalendar, setShowCalendar,
        showDday, setShowDday,
        ddayMessage, setDdayMessage
    } = useInvitationStore();

    return (
        <AccordionItem
            value={value}
            title="예식 일시"
            icon={Calendar}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!date && !!time}
        >
            <div className={styles.container}>
                {/* Date & Time Picking */}
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

                <div className="flex flex-col gap-3">
                    <SwitchField
                        checked={showDday}
                        onChange={setShowDday}
                        label="D-Day 노출"
                    />
                    {showDday && (
                        <div className={styles.ddayInputWrapper}>
                            <TextField
                                placeholder="예: (신랑), (신부)의 결혼식이 (D-Day) 남았습니다"
                                value={ddayMessage}
                                onChange={(e) => setDdayMessage(e.target.value)}
                            />
                            <div className={styles.infoBox}>
                                <Info size={14} className={styles.infoIcon} />
                                <span>(신랑), (신부), (D-Day)는 실제 이름과 날짜로 자동 치환됩니다.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AccordionItem>
    );
});

export default DateTimeSection;
