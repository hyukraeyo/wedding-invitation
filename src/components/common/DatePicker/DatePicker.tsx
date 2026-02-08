'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/Calendar';
import { format, parse, startOfToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SelectSingleEventHandler, Matcher } from 'react-day-picker';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (() => void) | undefined;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  variant?: React.ComponentProps<typeof TextField.Button>['variant'];
  radius?: React.ComponentProps<typeof TextField.Button>['radius'];
  disabled?: boolean | undefined;
  calendarDisabled?: Matcher | Matcher[] | undefined;
  id?: string | undefined;
  error?: string | boolean | undefined;
  ref?: React.Ref<HTMLButtonElement> | undefined;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      onComplete,
      open: externalOpen,
      onOpenChange: setExternalOpen,
      className,
      label,
      placeholder = '날짜 선택',
      variant = 'outline',
      radius = 'md',
      disabled,
      calendarDisabled = { before: startOfToday() },
      id,
      error,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    const setIsOpen = (open: boolean) => {
      if (setExternalOpen) {
        setExternalOpen(open);
      } else {
        setInternalOpen(open);
      }
    };

    // Parse string date (YYYY-MM-DD) to Date object
    const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

    const handleSelect: SelectSingleEventHandler = (date) => {
      if (date) {
        onChange(format(date, 'yyyy-MM-dd'));
        setIsOpen(false);
        onComplete?.();
      }
    };

    return (
      <>
        <TextField.Button
          ref={ref}
          id={id}
          variant={variant}
          radius={radius}
          label={label}
          placeholder={placeholder}
          value={dateValue ? format(dateValue, 'PPP', { locale: ko }) : ''}
          onClick={() => !disabled && setIsOpen(true)}
          className={className}
          rightSlot={<CalendarIcon size={18} />}
          error={error}
          {...props}
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
          <Dialog.Header title="날짜를 선택하세요" visuallyHidden />
          <Dialog.Body className={styles.calendarBody}>
            <Calendar
              mode="single"
              selected={dateValue}
              defaultMonth={dateValue || new Date()}
              onSelect={handleSelect}
              disabled={calendarDisabled}
              className={styles.calendar || ''}
              hideTodayIndicator={!dateValue}
              showOutsideDays={false}
            />
          </Dialog.Body>
        </Dialog>
      </>
    );
  }
);

DatePicker.displayName = 'DatePicker';
