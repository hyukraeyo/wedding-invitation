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
import { isBlank } from '@/lib/utils';
import { useBuilderSection, useBuilderField } from '@/hooks/useBuilder';
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

  const isComplete = Boolean(date && time);

  const { isInvalid: isSectionInvalid } = useBuilderSection(props.value, isComplete);

  const {
    value: dateValue,
    onValueChange: handleDateChange,
    isInvalid: isDateInvalid,
  } = useBuilderField({
    value: date,
    onChange: setDate,
    fieldName: 'wedding-date',
  });

  const {
    value: timeValue,
    onValueChange: handleTimeChange,
    isInvalid: isTimeInvalid,
  } = useBuilderField({
    value: time,
    onChange: setTime,
    fieldName: 'wedding-time',
  });

  return (
    <SectionAccordion
      title={<RequiredSectionTitle title="예식 일시" isComplete={isComplete} />}
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isSectionInvalid}
    >
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <FormField name="wedding-date">
            <FormHeader>
              <FormLabel htmlFor="wedding-date">예식 날짜</FormLabel>
              <FormMessage forceMatch={isDateInvalid && isBlank(dateValue)}>
                필수 항목이에요.
              </FormMessage>
            </FormHeader>
            <DatePicker
              id="wedding-date"
              value={dateValue}
              placeholder=""
              onChange={handleDateChange}
              error={isDateInvalid}
            />
            <FormControl asChild>
              <VisuallyHidden asChild>
                <input
                  id="wedding-date-required"
                  aria-label="예식 날짜"
                  required={isRequiredField('weddingDate')}
                  readOnly
                  value={dateValue || ''}
                />
              </VisuallyHidden>
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="wedding-time">
            <FormHeader>
              <FormLabel htmlFor="wedding-time">예식 시간</FormLabel>
              <FormMessage forceMatch={isTimeInvalid && isBlank(timeValue)}>
                필수 항목이에요.
              </FormMessage>
            </FormHeader>
            <TimePicker
              id="wedding-time"
              value={timeValue}
              placeholder=""
              onChange={handleTimeChange}
              error={isTimeInvalid}
            />
            <FormControl asChild>
              <VisuallyHidden asChild>
                <input
                  id="wedding-time-required"
                  aria-label="예식 시간"
                  required={isRequiredField('weddingTime')}
                  readOnly
                  value={timeValue || ''}
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
