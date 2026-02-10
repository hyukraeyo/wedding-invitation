import React, { useState, useMemo, useCallback } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWheelSwiper } from '@/hooks/useWheelSwiper';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

import styles from './RelationPicker.module.scss';

const RELATION_OPTIONS = [
  { label: '본인', value: '본인' },
  { label: '아버지', value: '아버지' },
  { label: '어머니', value: '어머니' },
  { label: '직접 입력', value: 'custom' },
];

interface RelationPickerProps {
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
  options: { label: string; value: string }[];
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

const RelationPickerRaw = (
  {
    value,
    onChange,
    className,
    placeholder = '관계 선택',
    variant = 'outline',
    radius = 'md',
    id,
    disabled,
    ...props
  }: RelationPickerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const [isOpen, setIsOpen] = useState(false);

  // Map the raw value to the picker value (custom if not preset)
  const pickerValue = useMemo(() => {
    if (['본인', '아버지', '어머니'].includes(value)) return value;
    return 'custom';
  }, [value]);

  const [tempValue, setTempValue] = useState(pickerValue);

  const displayValue = useMemo(() => {
    const option = RELATION_OPTIONS.find((opt) => opt.value === pickerValue);
    if (pickerValue === 'custom' && value) return value;
    return option?.label || value;
  }, [value, pickerValue]);

  const handleTempChange = useCallback((newValue: string) => {
    setTempValue(newValue);
  }, []);

  const handleConfirm = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (tempValue === 'custom') {
        onChange('');
      } else {
        onChange(tempValue);
      }
      setIsOpen(false);
    },
    [onChange, tempValue]
  );

  const handleTriggerClick = useCallback(() => {
    if (disabled) return;
    setTempValue(pickerValue);
  }, [disabled, pickerValue]);

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
          rightSlot={<Users size={18} />}
          disabled={disabled}
          {...props}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header title="관계 선택" visuallyHidden />
        <Dialog.Body className={styles.modalBody} padding={false}>
          <div className={styles.pickerGrid} data-vaul-no-drag>
            <div className={styles.mask} />
            <div className={styles.highlightLine} />
            <WheelColumn
              options={RELATION_OPTIONS}
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

export const RelationPicker = React.forwardRef(RelationPickerRaw);
RelationPicker.displayName = 'RelationPicker';
