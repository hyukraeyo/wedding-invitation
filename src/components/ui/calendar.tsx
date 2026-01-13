"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: "ghost" | "outline" | "default"
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white p-4 rounded-xl",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 rounded-lg p-0 hover:bg-slate-100 transition-colors duration-200",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 rounded-lg p-0 hover:bg-slate-100 transition-colors duration-200",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-9 w-full items-center justify-center",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-9 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md border border-slate-200",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-semibold text-slate-900 text-base tracking-tight",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-slate-400 flex-1 select-none text-xs font-medium uppercase tracking-wider h-10 flex items-center justify-center",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-10 select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-slate-400 select-none text-xs",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative h-10 w-10 select-none p-0 text-center",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-slate-900 rounded-l-lg",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-slate-100", defaultClassNames.range_middle),
        range_end: cn("bg-slate-900 rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "text-slate-900 font-semibold",
          defaultClassNames.today
        ),
        outside: cn(
          "text-slate-300",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-slate-300 cursor-not-allowed",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4 text-slate-600", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4 text-slate-600", className)}
                {...props}
              />
            )
          }

          return <></>
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-10 items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
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
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  // 오늘 날짜인지 확인
  const isToday = modifiers.today
  // 선택된 날짜인지 확인
  const isSelected = modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
  // 일요일(첫 번째 열) 또는 토요일(마지막 열) 확인
  const dayOfWeek = day.date.getDay()
  const isSunday = dayOfWeek === 0
  const isSaturday = dayOfWeek === 6

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // 기본 스타일
        "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-normal transition-all duration-200",
        // 기본 호버 효과
        "hover:bg-slate-100",
        // 요일별 색상
        isSunday && !modifiers.outside && "text-rose-500",
        isSaturday && !modifiers.outside && "text-blue-500",
        // 오늘 날짜 스타일 (선택되지 않았을 때)
        isToday && !isSelected && "bg-slate-100 font-semibold",
        // 선택된 날짜 스타일
        isSelected && "bg-slate-900 text-white font-semibold hover:bg-slate-800",
        // 범위 선택 스타일
        modifiers.range_start && "bg-slate-900 text-white rounded-lg",
        modifiers.range_end && "bg-slate-900 text-white rounded-lg",
        modifiers.range_middle && "bg-slate-100 text-slate-900 rounded-none",
        // 외부 날짜 (이전/다음 달)
        modifiers.outside && "text-slate-300",
        // 비활성화된 날짜
        modifiers.disabled && "text-slate-300 cursor-not-allowed hover:bg-transparent",
        // 포커스 스타일
        "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

