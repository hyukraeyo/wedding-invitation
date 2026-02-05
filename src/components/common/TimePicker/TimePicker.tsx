import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

import styles from './TimePicker.module.scss';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (() => void) | undefined;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: string | undefined; // 모달이 열릴 때 표시할 기본 시간 (예: '14:00')
  minuteStep?: number | undefined;
  variant?: React.ComponentProps<typeof TextField.Button>['variant'];
  radius?: React.ComponentProps<typeof TextField.Button>['radius'];
  id?: string | undefined;
  disabled?: boolean | undefined;
}

type Period = 'AM' | 'PM';

const WheelColumn = ({
  options,
  value,
  onChange,
  hasValue,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  hasValue: boolean;
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const isInternalUpdateRef = useRef(false);

  const initialIndex = useMemo(() => {
    const index = options.findIndex((opt) => opt.value === value);
    return index !== -1 ? index : 0;
  }, [options, value]);

  // External value change -> Swiper sync
  useEffect(() => {
    if (swiperRef.current && !isInternalUpdateRef.current) {
      const index = options.findIndex((opt) => opt.value === value);
      if (index !== -1 && index !== swiperRef.current.activeIndex) {
        swiperRef.current.slideTo(index);
      }
    }
    // Always reset the flag in the next frame or after the potential sync
    isInternalUpdateRef.current = false;
  }, [value, options]);

  return (
    <div className={styles.column}>
      <Swiper
        direction="vertical"
        modules={[FreeMode, Mousewheel]}
        slidesPerView={5}
        centeredSlides={true}
        mousewheel={true}
        initialSlide={initialIndex}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          const index = swiper.activeIndex;
          if (options[index] && options[index].value !== value) {
            isInternalUpdateRef.current = true;
            onChange(options[index].value);
          }
        }}
        className={styles.swiperContainer}
        slideToClickedSlide={true}
        grabCursor={true}
        resistanceRatio={0.5}
      >
        {options.map((opt) => (
          <SwiperSlide key={opt.value} className={styles.swiperSlide}>
            {({ isActive }) => (
              <div className={cn(styles.optionItem, isActive && hasValue && styles.active)}>
                {opt.label}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const TimePickerRaw = (
  {
    value,
    onChange,
    onComplete,
    open: externalOpen,
    onOpenChange: setExternalOpen,
    className,
    label,
    placeholder = '시간 선택',
    defaultValue = '11:00',
    minuteStep = 10,
    variant = 'outline',
    radius = 'large',
    id,
    disabled,
    ...props
  }: TimePickerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (setExternalOpen) {
        setExternalOpen(open);
      } else {
        setInternalOpen(open);
      }
    },
    [setExternalOpen]
  );

  const [tempValue, setTempValue] = useState(value || '');

  // Parse value for display button
  const displayValue = useMemo(() => {
    if (!value) return '';
    const [hStr, mStr] = value.split(':');
    const hInt = parseInt(hStr || '13', 10);

    // 🍌 Custom logic: 12:00 is AM 12
    const isAM = hInt <= 12;
    const periodLabel = isAM ? '오전' : '오후';
    const displayH = isAM ? (hInt === 0 ? 12 : hInt) : hInt - 12;

    return `${periodLabel} ${displayH}시 ${mStr || '00'}분`;
  }, [value]);

  // Parse tempValue for wheel state
  const { currentTM, tPeriod, tDisplayHour } = useMemo(() => {
    // tempValue가 없으면 defaultValue 사용
    const effectiveValue = tempValue || defaultValue;
    const [tHStr, tMStr] = effectiveValue.split(':');
    const tHInt = parseInt(tHStr || '12', 10);

    // 🍌 Custom logic: 12:00 is AM
    const tp: Period = tHInt <= 12 ? 'AM' : 'PM';
    const tdh = String(tHInt <= 12 ? (tHInt === 0 ? 12 : tHInt) : tHInt - 12);

    return {
      currentTM: tMStr || '00',
      tPeriod: tp,
      tDisplayHour: tdh,
    };
  }, [tempValue, defaultValue]);

  const hourOptions = useMemo(() => {
    // 🍌 오전 8~12시, 오후 1~10시 제한
    const hours = tPeriod === 'AM' ? [8, 9, 10, 11, 12] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return hours.map((h) => ({
      label: `${h}시`,
      value: String(h),
    }));
  }, [tPeriod]);

  const minuteOptions = useMemo(() => {
    const minutes = Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) =>
      String(i * minuteStep).padStart(2, '0')
    );
    return minutes.map((min) => ({ label: `${min}분`, value: min }));
  }, [minuteStep]);

  // Update tempValue logic - NO side effects (onChange) inside here
  const getNextValue = useCallback(
    (updates: { period?: Period; hour?: string; minute?: string }) => {
      const effectiveTempValue = tempValue || defaultValue;
      const [hStr, mStr] = effectiveTempValue.split(':');
      const h = parseInt(hStr || '12', 10);

      // Custom logic: 12:00 is AM
      const currentPeriod: Period = h <= 12 ? 'AM' : 'PM';
      const currentDisplayH = h <= 12 ? (h === 0 ? 12 : h) : h - 12;

      const p = updates.period ?? currentPeriod;
      let dh = updates.hour ?? String(currentDisplayH);
      const min = updates.minute ?? (mStr || '00');

      // Validation for the new ranges when period changes
      if (updates.period && !updates.hour) {
        const validHours = p === 'AM' ? [8, 9, 10, 11, 12] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        if (!validHours.includes(parseInt(dh, 10))) {
          dh = String(validHours[0]);
        }
      }

      let newH = parseInt(dh, 10);
      if (p === 'PM') {
        newH += 12;
      } else if (p === 'AM' && newH === 12) {
        newH = 12; // In our custom logic AM 12 is 12:00
      } else if (p === 'AM' && newH === 0) {
        newH = 0; // Midnight (though restricted from UI)
      }

      return `${String(newH).padStart(2, '0')}:${min}`;
    },
    [tempValue, defaultValue]
  );

  const handleTempChange = useCallback(
    (updates: { period?: Period; hour?: string; minute?: string }) => {
      const finalValue = getNextValue(updates);
      setTempValue(finalValue);
      // 🍌 값은 모달 내부에서만 임시 저장되고, 확인 버튼을 클릭할 때만 onChange가 호출됨
    },
    [getNextValue]
  );

  const handleConfirm = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      // tempValue가 빈 문자열이면 defaultValue 사용
      const finalValue = tempValue || defaultValue;
      onChange(finalValue);
      setIsOpen(false);
      onComplete?.();
    },
    [onChange, tempValue, defaultValue, onComplete, setIsOpen]
  );

  const handleOpenModal = useCallback(() => {
    if (!disabled) {
      setTempValue(value || '');
      setIsOpen(true);
    }
  }, [disabled, value, setIsOpen]);

  return (
    <>
      <TextField.Button
        ref={ref}
        id={id}
        variant={variant}
        radius={radius}
        label={label}
        placeholder={placeholder}
        value={displayValue}
        onClick={handleOpenModal}
        className={className}
        {...props}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
        <Dialog.Header title="예식 시간 선택" visuallyHidden />
        <Dialog.Body className={styles.modalBody} padding={false}>
          <div className={styles.periodContainer}>
            <SegmentedControl
              value={tPeriod}
              alignment="fluid"
              size="md"
              onChange={(v: string) => handleTempChange({ period: v as Period })}
            >
              <SegmentedControl.Item value="AM">오전</SegmentedControl.Item>
              <SegmentedControl.Item value="PM">오후</SegmentedControl.Item>
            </SegmentedControl>
          </div>

          <div className={styles.pickerGrid} data-vaul-no-drag>
            <div className={styles.mask} />
            <div className={styles.highlightLine} />
            <WheelColumn
              options={hourOptions}
              value={tDisplayHour}
              onChange={(h) => handleTempChange({ hour: h })}
              hasValue={true}
            />
            <WheelColumn
              options={minuteOptions}
              value={currentTM}
              onChange={(m) => handleTempChange({ minute: m })}
              hasValue={true}
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer className={styles.footer}>
          <Button variant="primary" onClick={handleConfirm}>
            확인
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export const TimePicker = React.forwardRef(TimePickerRaw);
TimePicker.displayName = 'TimePicker';
