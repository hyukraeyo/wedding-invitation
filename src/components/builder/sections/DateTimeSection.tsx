import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Switch } from '../Switch';
import { Field } from '../Field';
import styles from './DateTimeSection.module.scss';

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

    return (
        <AccordionItem
            title="예식 일시"
            icon={Calendar}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!date && !!time}
        >
            <div className={styles.container}>
                {/* Date & Time Picking */}
                <div className={styles.row}>
                    <Field label="예식일" className={styles.fieldItem}>
                        <TextField
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Field>
                    <Field label="예식 시간" className={styles.fieldItem}>
                        <TextField
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </Field>
                </div>

                {/* Additional Options */}
                <Field label="추가 옵션">
                    <div className={styles.optionWrapper}>
                        <Switch
                            checked={showCalendar}
                            onChange={setShowCalendar}
                            label="달력 노출"
                        />
                        <div className="flex flex-col gap-3">
                            <Switch
                                checked={showDday}
                                onChange={setShowDday}
                                label="D-Day 노출"
                            />
                            {showDday && (
                                <div className={styles.ddayInputWrapper}>
                                    <TextField
                                        label="D-Day 문구"
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
                </Field>
            </div>
        </AccordionItem>
    );
}
