import React from 'react';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useShallow } from 'zustand/react/shallow';
import { BoardRow } from '@/components/ui/BoardRow';
import { TextField } from '@/components/ui/TextField';
import { List, ListRow } from '@/components/ui/List';
import { Switch } from '@/components/ui/Switch';
import { TimePicker } from '@/components/common/TimePicker';
import { DatePicker } from '@/components/common/DatePicker';
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
        <BoardRow
            title="예식 일시"
            isOpened={props.isOpen}
            onOpen={() => props.onToggle?.(true)}
            onClose={() => props.onToggle?.(false)}
            icon={<BoardRow.ArrowIcon />}
        >
            <List>
                {/* Date & Time Picking */}
                <ListRow
                    contents={
                        <DatePicker
                            label="예식 날짜"
                            value={date}
                            onChange={(value) => setDate(value)}
                        />
                    }
                />
                <ListRow
                    contents={
                        <TimePicker
                            label="예식 시간"
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
                            onCheckedChange={(checked) => setShowCalendar(checked)}
                        />
                    }
                />

                <ListRow
                    title="D-Day 노출"
                    right={
                        <Switch
                            checked={showDday}
                            onCheckedChange={(checked) => setShowDday(checked)}
                        />
                    }
                />
                {showDday && (
                    <ListRow
                        contents={
                            <div className={styles.ddayInputWrapper}>
                                <TextField
                                    variant="surface"
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
        </BoardRow>
    );
});

export default DateTimeSection;
