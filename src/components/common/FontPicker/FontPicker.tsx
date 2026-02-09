import React, { useState, useMemo, useCallback } from 'react';
import { Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWheelSwiper } from '@/hooks/useWheelSwiper';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

import styles from './FontPicker.module.scss';

export interface FontOption {
  label: string;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: FontOption[];
  className?: string;
  label?: string;
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
  options: FontOption[];
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
              <div
                className={cn(
                  styles.optionItem,
                  isActive && hasValue && styles.active,
                  opt.className
                )}
                style={opt.style}
              >
                {opt.label}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const FontPickerRaw = (
  {
    value,
    onChange,
    options,
    className,
    label,
    placeholder = '글꼴 선택',
    variant = 'outline',
    radius = 'md',
    id,
    disabled,
    ...props
  }: FontPickerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Parse value for display button
  const displayValue = useMemo(() => {
    return options.find((opt) => opt.value === value)?.label || value;
  }, [value, options]);

  const handleTempChange = useCallback((newValue: string) => {
    setTempValue(newValue);
  }, []);

  const handleConfirm = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onChange(tempValue);
      setIsOpen(false);
    },
    [onChange, tempValue, setIsOpen]
  );

  const handleTriggerClick = useCallback(() => {
    if (disabled) {
      return;
    }

    setTempValue(value);
  }, [disabled, value]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
      <Dialog.Trigger asChild>
        <TextField.Button
          ref={ref}
          id={id}
          variant={variant}
          radius={radius}
          label={label}
          placeholder={placeholder}
          value={displayValue}
          onClick={handleTriggerClick}
          className={className}
          rightSlot={<Type size={18} />}
          disabled={disabled}
          {...props}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header title="글꼴 선택" visuallyHidden />
        <Dialog.Body className={styles.modalBody} padding={false}>
          <div className={styles.pickerGrid} data-vaul-no-drag>
            <div className={styles.mask} />
            <div className={styles.highlightLine} />
            <WheelColumn
              options={options}
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

export const FontPicker = React.forwardRef(FontPickerRaw);
FontPicker.displayName = 'FontPicker';
