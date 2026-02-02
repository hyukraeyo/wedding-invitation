import React from 'react';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useShallow } from 'zustand/react/shallow';
import { SectionAccordion } from '@/components/ui/Accordion';
import { TextField } from '@/components/ui/TextField';
import { Switch } from '@/components/ui/Switch';
import { TimePicker } from '@/components/common/TimePicker';
import { DatePicker } from '@/components/common/DatePicker';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import styles from './DateTimeSection.module.scss';
import type { SectionProps } from '@/types/builder';

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection(props) {
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
        <SectionAccordion
            title="예식 일시"
            value="date-time"
            isOpen={props.isOpen}
            onToggle={props.onToggle}
        >
            <div className={styles.container}>
                {/* Date & Time Picking */}
                <div className={styles.optionItem}>
                    <FormField name="wedding-date">
                        <FormLabel className={styles.formLabel} htmlFor="wedding-date">
                            예식 날짜
                        </FormLabel>
                        <FormControl asChild>
                            <DatePicker
                                id="wedding-date"
                                value={date}
                                onChange={(value) => setDate(value)}
                            />
                        </FormControl>
                    </FormField>
                </div>
                <div className={styles.optionItem}>
                    <FormField name="wedding-time">
                        <FormLabel className={styles.formLabel} htmlFor="wedding-time">
                            예식 시간
                        </FormLabel>
                        <FormControl asChild>
                            <TimePicker
                                id="wedding-time"
                                value={time}
                                onChange={(value) => setTime(value)}
                            />
                        </FormControl>
                    </FormField>
                </div>

                {/* Additional Options */}
                <div className={styles.optionItem}>
                    <div className={styles.rowTitle}>달력 노출</div>
                    <div className={styles.rowRight}>
                        <Switch
                            checked={showCalendar}
                            onCheckedChange={(checked) => setShowCalendar(checked)}
                        />
                    </div>
                </div>

                <div className={styles.optionItem}>
                    <div className={styles.rowTitle}>D-Day 노출</div>
                    <div className={styles.rowRight}>
                        <Switch
                            checked={showDday}
                            onCheckedChange={(checked) => setShowDday(checked)}
                        />
                    </div>
                </div>

                {showDday && (
                    <div className={styles.optionItem}>
                        <div className={styles.ddayInputWrapper}>
                            <FormField name="dday-message">
                                <FormLabel className={styles.formLabel} htmlFor="dday-message">
                                    D-Day 메시지
                                </FormLabel>
                                <FormControl asChild>
                                    <TextField
                                        id="dday-message"
                                        variant="surface"
                                        placeholder="예: (신랑), (신부)의 결혼식이 (D-Day) 남았어요"
                                        value={ddayMessage}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDdayMessage(e.target.value)}
                                    />
                                </FormControl>
                            </FormField>
                            <InfoMessage>
                                (신랑), (신부), (D-Day)는 실제 이름과 날짜로 자동 치환됩니다.
                            </InfoMessage>
                        </div>
                    </div>
                )}
            </div>
        </SectionAccordion>
    );
});

export default DateTimeSection;
