"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { ko } from "date-fns/locale"
import styles from "./styles.module.scss"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.root, className)}
      locale={ko}
      classNames={{
        months: styles.months,
        month: styles.month,
        month_caption: styles.month_caption,
        caption_label: styles.caption_label,
        nav: styles.nav,
        button_previous: styles.button_previous,
        button_next: styles.button_next,
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
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon size={18} />
          }
          if (orientation === "right") {
            return <ChevronRightIcon size={18} />
          }
          return <ChevronDownIcon size={18} />
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelected = !!modifiers.selected

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      data-selected={isSelected}
      className={cn(
        styles.dayButton,
        isSelected && styles.daySelected,
        modifiers.today && styles.dayToday,
        modifiers.outside && styles.dayOutside,
        className
      )}
    >
      {day.date.getDate()}
    </button>
  )
}

export { Calendar, CalendarDayButton }
