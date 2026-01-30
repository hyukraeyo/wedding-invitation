"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, useDayPicker, MonthCaptionProps, ClassNames } from "react-day-picker"
import { format, isValid, isSameMonth } from "date-fns"
import { ko } from "date-fns/locale"
import { IconButton } from "@/components/ui/IconButton"
import { cn } from "@/lib/utils"
import styles from "./Calendar.module.scss"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames: ClassNames = {
    months: styles.months,
    month: styles.month,
    table: styles.table,
    weekdays: styles.weekdays,
    weekday: styles.weekday,
    week: styles.week,
    day: styles.day,
    today: styles.today,
    outside: styles.outside,
    disabled: styles.disabled,
    range_start: styles.range_start,
    range_middle: styles.range_middle,
    range_end: styles.range_end,
    hidden: styles.hidden,
    ...classNames,
  } as ClassNames;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks
      className={cn(styles.root, className)}
      locale={ko}
      classNames={defaultClassNames}
      components={{
        MonthCaption: CustomMonthCaption,
        Nav: () => <></>,
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

/**
 * MonthCaption 컴포넌트를 커스텀하여 텍스트 양옆에 네비게이션 버튼을 배치합니다.
 * react-day-picker v9에서는 MonthCaption이 헤더의 핵심 역할을 합니다.
 */
function CustomMonthCaption(props: MonthCaptionProps) {
  const { calendarMonth } = props;
  const { goToMonth, previousMonth, nextMonth } = useDayPicker();

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (previousMonth) {
      goToMonth(previousMonth);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (nextMonth) {
      goToMonth(nextMonth);
    }
  };

  // 날짜 유효성 검사 및 포맷팅 (calendarMonth.date 사용)
  const displayDate = calendarMonth.date;
  const formattedDate = isValid(displayDate)
    ? format(displayDate, "yyyy년 M월")
    : "";

  return (
    <div className={styles.month_caption}>
      <div className={styles.customHeader}>
        <IconButton
          variant="clear"
          iconSize={20}
          className={styles.navButton}
          onClick={handlePrev}
          disabled={!previousMonth || false}
          aria-label="이전 달"
          name="prev-month"
        >
          <ChevronLeftIcon />
        </IconButton>

        <span className={styles.caption_label}>
          {formattedDate}
        </span>

        <IconButton
          variant="clear"
          iconSize={20}
          className={styles.navButton}
          onClick={handleNext}
          disabled={!nextMonth || false}
          aria-label="다음 달"
          name="next-month"
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const { goToMonth, months } = useDayPicker();

  React.useEffect(() => {
    if (ref.current && modifiers.focused) {
      ref.current.focus();
    }
  }, [modifiers.focused])

  const isSelected = !!modifiers.selected
  const isSunday = day.date.getDay() === 0
  const isSaturday = day.date.getDay() === 6

  // 외부 날짜(이전/다음 달) 클릭 시 선택 대신 달 이동 처리
  const handleDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentMonth = months?.[0]?.date;

    // 현재 표시된 달과 클릭된 날짜의 달이 다르면 (Outside Day)
    // 원래의 선택 동작(props.onClick)을 막고 달만 이동시킴
    if (currentMonth && !isSameMonth(day.date, currentMonth)) {
      e.preventDefault();
      e.stopPropagation(); // 상위로 이벤트 전파 방지 (DatePicker 닫힘 방지)
      goToMonth(day.date);
      return;
    }

    // 현재 달의 날짜면 원래 동작 수행
    props.onClick?.(e);
  };

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      onClick={handleDayClick}
      data-selected={isSelected}
      className={cn(
        styles.dayButton,
        modifiers.today && styles.dayToday,
        modifiers.outside && styles.dayOutside,
        !isSelected && !modifiers.outside && isSunday && styles.sunday,
        !isSelected && !modifiers.outside && isSaturday && styles.saturday,
        className
      )}
    >
      {day.date.getDate()}
    </button>
  )
}

export { Calendar, CalendarDayButton }
