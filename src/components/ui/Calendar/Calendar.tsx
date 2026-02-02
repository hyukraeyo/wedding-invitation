'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, useNavigation, UI, DayFlag, type DayButtonProps } from 'react-day-picker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

import styles from './Calendar.module.scss';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  hideTodayIndicator?: boolean;
};

/**
 * 월 표시와 내비게이션 커스텀 컴포넌트
 */
const CustomMonthCaption = (props: { calendarMonth: { date: Date } }) => {
  const { previousMonth, nextMonth, goToMonth } = useNavigation();

  return (
    <div className={styles.customCaption}>
      <button
        type="button"
        className={styles.navButtonSmall}
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        aria-label="이전 달"
      >
        <ChevronLeftIcon />
      </button>

      <div className={styles.captionTitleGroup}>
        <span className={styles.captionYear}>
          {format(props.calendarMonth.date, 'yyyy')}
        </span>
        <span className={styles.captionMonth}>
          {format(props.calendarMonth.date, 'M월')}
        </span>
      </div>

      <button
        type="button"
        className={styles.navButtonSmall}
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        aria-label="다음 달"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

/**
 * 날짜 버튼 커스텀 컴포넌트
 */
const CustomDayButton = (dayButtonProps: DayButtonProps) => {
  const { day, modifiers, className: rdpClassName, ...others } = dayButtonProps;
  const isSelected = !!modifiers.selected;
  const isToday = !!modifiers.today;
  const isOutside = !!modifiers.outside;
  const isDisabled = !!modifiers.disabled;

  const dayOfWeek = day.date.getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  return (
    <Button
      {...others}
      variant={isSelected ? "solid" : "ghost"}
      color={(isSelected ? "primary" : "grey") as "primary" | "grey"}
      size="tiny"
      radius="full"
      className={cn(
        styles.dayButtonBase,
        isSelected && styles.daySelected,
        isToday && styles.dayToday,
        isOutside && styles.dayOutside,
        isDisabled && styles.disabled,
        isSunday && !isSelected && !isOutside && !isDisabled && styles.sunday,
        isSaturday && !isSelected && !isOutside && !isDisabled && styles.saturday,
        rdpClassName
      )}
    >
      {day.date.getDate()}
    </Button>
  );
};

/**
 * Calendar 컴포넌트
 * react-day-picker v9에 기반하며 Banana Wedding 디자인 시스템을 따릅니다.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  hideTodayIndicator = false,
  ...props
}: CalendarProps) {
  // exactOptionalPropertyTypes: true 설정 대응을 위해 undefined인 클래스는 제외합니다.
  const defaultClassNames = Object.entries({
    [UI.Months]: styles.months,
    [UI.Month]: styles.month,
    [UI.MonthCaption]: styles.month_caption,
    [UI.MonthGrid]: styles.table,
    [UI.Weekdays]: styles.weekdays,
    [UI.Weekday]: styles.weekday,
    [UI.Weeks]: styles.weeks,
    [UI.Week]: styles.week,
    [UI.Day]: styles.day,
    [UI.DayButton]: styles.dayButtonBase,
    [DayFlag.outside]: styles.dayOutside,
    [DayFlag.disabled]: styles.disabled,
    [DayFlag.hidden]: styles.hidden,
    ...classNames,
  }).reduce((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  // 컴포넌트 레퍼런스 안정화
  const components = React.useMemo(() => ({
    MonthCaption: CustomMonthCaption,
    DayButton: CustomDayButton,
  }), []);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.root, className)}
      classNames={defaultClassNames}
      locale={ko}
      hideNavigation
      modifiers={{
        today: hideTodayIndicator ? [] : [new Date()],
      }}
      components={components}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
