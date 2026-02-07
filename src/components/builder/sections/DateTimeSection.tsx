import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { SectionAccordion } from '@/components/ui/Accordion';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import { SwitchRow } from '@/components/common/SwitchRow';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';
import styles from './DateTimeSection.module.scss';

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection(props) {
  const { date, setDate, time, setTime, showCalendar, setShowCalendar, showDday, setShowDday } =
    useInvitationStore(
      useShallow((state) => ({
        date: state.date,
        setDate: state.setDate,
        time: state.time,
        setTime: state.setTime,
        showCalendar: state.showCalendar,
        setShowCalendar: state.setShowCalendar,
        showDday: state.showDday,
        setShowDday: state.setShowDday,
      }))
    );

  return (
    <SectionAccordion title="예식 일시" value="date-time" isOpen={props.isOpen} onToggle={props.onToggle}>
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <FormField name="wedding-date">
            <FormLabel htmlFor="wedding-date">예식 날짜</FormLabel>
            <FormControl asChild>
              <DatePicker id="wedding-date" value={date} placeholder="" onChange={setDate} />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="wedding-time">
            <FormLabel htmlFor="wedding-time">예식 시간</FormLabel>
            <FormControl asChild>
              <TimePicker id="wedding-time" value={time} placeholder="" onChange={setTime} />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <SwitchRow
            label="달력 노출"
            checked={showCalendar}
            onCheckedChange={setShowCalendar}
          />
        </div>

        <div className={styles.optionItem}>
          <SwitchRow label="D-Day 노출" checked={showDday} onCheckedChange={setShowDday} />
        </div>
      </div>
    </SectionAccordion>
  );
});

export default DateTimeSection;
