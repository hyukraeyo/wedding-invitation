import React from 'react';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useShallow } from 'zustand/react/shallow';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { TextField } from '@/components/ui/TextField';
import { List, ListRow } from '@/components/ui/List';
import { Switch } from '@/components/ui/Switch';
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
                <List>
                    {/* Date & Time Picking */}
                    <ListRow
                        title="예식일"
                        contents={
                            <DatePicker
                                value={date}
                                onChange={(value) => setDate(value)}
                            />
                        }
                    />
                    <ListRow
                        title="예식 시간"
                        contents={
                            <TimePicker
                                value={time}
                                onChange={(value) => setTime(value)}
                            />
                        }
                    />

                    {/* Additional Options */}
                    <ListRow
                        title="달력 노출"
                        right={
                            <Switch
                                checked={showCalendar}
                                onChange={(_, checked) => setShowCalendar(checked)}
                            />
                        }
                    />

                    <ListRow
                        title="D-Day 노출"
                        right={
                            <Switch
                                checked={showDday}
                                onChange={(_, checked) => setShowDday(checked)}
                            />
                        }
                    />
                    {showDday && (
                        <ListRow
                            contents={
                                <div className={styles.ddayInputWrapper}>
                                    <TextField
                                        variant="line"
                                        label="D-Day 메시지"
                                        placeholder="예: (신랑), (신부)의 결혼식이 (D-Day) 남았습니다"
                                        value={ddayMessage}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDdayMessage(e.target.value)}
                                    />
                                    <InfoMessage>
                                        (신랑), (신부), (D-Day)는 실제 이름과 날짜로 자동 치환됩니다.
                                    </InfoMessage>
                                </div>
                            }
                        />
                    )}
                </List>
            </AccordionContent>
        </AccordionItem>
    );
});

export default DateTimeSection;
