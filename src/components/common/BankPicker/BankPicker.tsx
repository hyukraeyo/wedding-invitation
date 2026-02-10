import React, { useState, useMemo, useCallback } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWheelSwiper } from '@/hooks/useWheelSwiper';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { BANK_OPTIONS } from '@/constants/banks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

import styles from './BankPicker.module.scss';

interface BankPickerOption {
  label: string;
  value: string;
}

interface BankPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  variant?: React.ComponentProps<typeof TextField.Button>['variant'];
  radius?: React.ComponentProps<typeof TextField.Button>['radius'];
  id?: string;
  disabled?: boolean;
}

const WheelColumn = ({
  options,
  value,
  onChange,
  hasValue,
}: {
  options: BankPickerOption[];
  value: string;
  onChange: (val: string) => void;
  hasValue: boolean;
}) => {
  const { initialIndex, onSwiper, onSlideChange } = useWheelSwiper({
    options,
    value,
    onChange,
  });

  return (
    <div className={styles.column}>
      <Swiper
        direction="vertical"
        modules={[FreeMode, Mousewheel]}
        slidesPerView={5}
        centeredSlides={true}
        mousewheel={true}
        initialSlide={initialIndex}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
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

const BankPickerRaw = (
  {
    value,
    onChange,
    className,
    placeholder = '은행 선택',
    variant = 'outline',
    radius = 'md',
    id,
    disabled,
    ...props
  }: BankPickerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const displayValue = useMemo(() => {
    return BANK_OPTIONS.find((opt) => opt.value === value)?.label || value;
  }, [value]);

  const handleTempChange = useCallback((newValue: string) => {
    setTempValue(newValue);
  }, []);

  const handleConfirm = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onChange(tempValue);
      setIsOpen(false);
    },
    [onChange, tempValue]
  );

  const handleTriggerClick = useCallback(() => {
    if (disabled) return;
    setTempValue(value || BANK_OPTIONS[0]?.value || '카카오뱅크');
  }, [disabled, value]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
      <Dialog.Trigger asChild>
        <TextField.Button
          ref={ref}
          id={id}
          variant={variant}
          radius={radius}
          placeholder={placeholder}
          value={displayValue || undefined}
          onClick={handleTriggerClick}
          className={className}
          rightSlot={<Building2 size={18} />}
          disabled={disabled}
          {...props}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header title="은행 선택" visuallyHidden />
        <Dialog.Body className={styles.modalBody} padding={false}>
          <div className={styles.pickerGrid} data-vaul-no-drag>
            <div className={styles.mask} />
            <div className={styles.highlightLine} />
            <WheelColumn
              options={BANK_OPTIONS}
              value={tempValue}
              onChange={handleTempChange}
              hasValue={true}
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer className={styles.footer}>
          <Button onClick={handleConfirm}>확인</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export const BankPicker = React.forwardRef(BankPickerRaw);
BankPicker.displayName = 'BankPicker';
