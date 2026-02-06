import React from 'react';

import { useInvitationStore } from '@/store/useInvitationStore';
import { useShallow } from 'zustand/react/shallow';
import { SectionAccordion } from '@/components/ui/Accordion';

import { Switch } from '@/components/ui/Switch';
import { TimePicker } from '@/components/common/TimePicker';
import { DatePicker } from '@/components/common/DatePicker';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import styles from './DateTimeSection.module.scss';
import type { SectionProps } from '@/types/builder';

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
    <SectionAccordion
      title="예식 일시"
      value="date-time"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
    >
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <FormField name="wedding-date">
            <FormLabel htmlFor="wedding-date">예식 날짜</FormLabel>
            <FormControl asChild>
              <DatePicker
                id="wedding-date"
                value={date}
                placeholder=""
                onChange={(value) => setDate(value)}
              />
            </FormControl>
          </FormField>
        </div>
        <div className={styles.optionItem}>
          <FormField name="wedding-time">
            <FormLabel htmlFor="wedding-time">예식 시간</FormLabel>
            <FormControl asChild>
              <TimePicker
                id="wedding-time"
                value={time}
                placeholder=""
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
            <Switch checked={showDday} onCheckedChange={(checked) => setShowDday(checked)} />
          </div>
        </div>
      </div>
    </SectionAccordion>
  );
});

export default DateTimeSection;
