import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DatePicker } from '@/components/common/DatePicker';
import { SectionHeadingFields } from '@/components/common/SectionHeadingFields';
import { TimePicker } from '@/components/common/TimePicker';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { EditorSection } from '@/components/ui/EditorSection';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { SwitchRow } from '@/components/common/SwitchRow';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isRequiredField } from '@/constants/requiredFields';
import { useInvitationStore } from '@/store/useInvitationStore';
import { isBlank } from '@/lib/utils';
import { useBuilderSection, useBuilderField } from '@/hooks/useBuilder';
import type { SectionProps } from '@/types/builder';

const DateTimeSection = React.memo<SectionProps>(function DateTimeSection(props) {
  const {
    date,
    setDate,
    time,
    setTime,
    dateTimeTitle,
    setDateTimeTitle,
    dateTimeSubtitle,
    setDateTimeSubtitle,
    showCalendar,
    setShowCalendar,
    showDday,
    setShowDday,
  } = useInvitationStore(
    useShallow((state) => ({
      date: state.date,
      setDate: state.setDate,
      time: state.time,
      setTime: state.setTime,
      dateTimeTitle: state.dateTimeTitle,
      setDateTimeTitle: state.setDateTimeTitle,
      dateTimeSubtitle: state.dateTimeSubtitle,
      setDateTimeSubtitle: state.setDateTimeSubtitle,
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
    <EditorSection
      title={<RequiredSectionTitle title="예식 일시" isComplete={isComplete} />}
      isInvalid={isSectionInvalid}
    >
      <SectionHeadingFields
        prefix="date-time"
        subtitle={{ value: dateTimeSubtitle, onValueChange: setDateTimeSubtitle }}
        title={{ value: dateTimeTitle, onValueChange: setDateTimeTitle }}
      />
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

      <FormField name="show-calendar">
        <SwitchRow label="달력 노출" checked={showCalendar} onCheckedChange={setShowCalendar} />
      </FormField>

      <FormField name="show-dday">
        <SwitchRow label="D-Day 노출" checked={showDday} onCheckedChange={setShowDday} />
      </FormField>
    </EditorSection>
  );
});

export default DateTimeSection;
