import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionAccordion } from '@/components/ui/Accordion';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { SwitchRow } from '@/components/common/SwitchRow';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isRequiredField } from '@/constants/requiredFields';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';
import styles from './DateTimeSection.module.scss';

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
    validationErrors,
  } = useInvitationStore(
    useShallow((state) => ({
      date: state.date,
      setDate: state.setDate,
      time: state.time,
      setTime: state.setTime,
      showCalendar: state.showCalendar,
      setShowCalendar: state.setShowCalendar,
      showDday: state.showDday,
      setShowDday: state.setShowDday,
      validationErrors: state.validationErrors,
    }))
  );
  const isComplete = Boolean(date && time);
  const isInvalid = validationErrors.includes(props.value);

  return (
    <SectionAccordion
      title={<RequiredSectionTitle title="예식 일시" isComplete={isComplete} />}
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
    >
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <FormField name="wedding-date">
            <FormHeader>
              <FormLabel htmlFor="wedding-date">예식 날짜</FormLabel>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
            </FormHeader>
            <DatePicker id="wedding-date" value={date} placeholder="" onChange={setDate} />
            <FormControl asChild>
              <VisuallyHidden asChild>
                <input
                  id="wedding-date-required"
                  aria-label="예식 날짜"
                  required={isRequiredField('weddingDate')}
                  readOnly
                  value={date || ''}
                />
              </VisuallyHidden>
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="wedding-time">
            <FormHeader>
              <FormLabel htmlFor="wedding-time">예식 시간</FormLabel>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
            </FormHeader>
            <TimePicker id="wedding-time" value={time} placeholder="" onChange={setTime} />
            <FormControl asChild>
              <VisuallyHidden asChild>
                <input
                  id="wedding-time-required"
                  aria-label="예식 시간"
                  required={isRequiredField('weddingTime')}
                  readOnly
                  value={time || ''}
                />
              </VisuallyHidden>
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <SwitchRow label="달력 노출" checked={showCalendar} onCheckedChange={setShowCalendar} />
        </div>

        <div className={styles.optionItem}>
          <SwitchRow label="D-Day 노출" checked={showDday} onCheckedChange={setShowDday} />
        </div>
      </div>
    </SectionAccordion>
  );
});

export default DateTimeSection;
