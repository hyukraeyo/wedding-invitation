import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Dialog as Modal } from '@/components/ui/Dialog';
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
    onComplete?: () => void;
    className?: string;
    label?: string;
    placeholder?: string;
    minuteStep?: number;
    id?: string;
    disabled?: boolean;
}

type Period = 'AM' | 'PM';

const ITEM_HEIGHT = 44;

const WheelColumn = ({
    options,
    value,
    onChange,
}: {
    options: { label: string, value: string }[],
    value: string,
    onChange: (val: string) => void,
}) => {
    const swiperRef = useRef<SwiperClass | null>(null);
    const isInternalUpdateRef = useRef(false);

    const initialIndex = useMemo(() => {
        const index = options.findIndex(opt => opt.value === value);
        return index !== -1 ? index : 0;
    }, [options, value]);

    // External value change -> Swiper sync
    useEffect(() => {
        if (swiperRef.current && !isInternalUpdateRef.current) {
            const index = options.findIndex(opt => opt.value === value);
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
                            <div className={cn(styles.optionItem, isActive && styles.active)}>
                                {opt.label}
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const TimePickerRaw = ({
    value,
    onChange,
    onComplete,
    className,
    label,
    placeholder = "시간 선택",
    minuteStep = 10,
    id,
    disabled,
}: TimePickerProps, ref: React.Ref<HTMLButtonElement>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value || '13:00');

    // Parse value for display button
    const displayValue = useMemo(() => {
        if (!value) return '';
        const [hStr, mStr] = value.split(':');
        const hInt = parseInt(hStr || '13', 10);
        const period: Period = hInt >= 12 ? 'PM' : 'AM';
        const displayH = hInt > 12 ? hInt - 12 : (hInt === 0 ? 12 : hInt);
        return `${period === 'AM' ? '오전' : '오후'} ${displayH}시 ${mStr || '00'}분`;
    }, [value]);

    // Parse tempValue for wheel state
    const { currentTM, tPeriod, tDisplayHour } = useMemo(() => {
        const [tHStr, tMStr] = (tempValue || '13:00').split(':');
        const tHInt = parseInt(tHStr || '13', 10);
        const tp: Period = tHInt >= 12 ? 'PM' : 'AM';
        const tdh = String(tHInt > 12 ? tHInt - 12 : (tHInt === 0 ? 12 : tHInt));

        return {
            currentTM: tMStr || '00',
            tPeriod: tp,
            tDisplayHour: tdh
        };
    }, [tempValue]);

    const hourOptions = useMemo(() =>
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => ({
            label: `${h}시`,
            value: String(h)
        })), []
    );

    const minuteOptions = useMemo(() => {
        const minutes = Array.from(
            { length: Math.floor(60 / minuteStep) },
            (_, i) => String(i * minuteStep).padStart(2, '0')
        );
        return minutes.map(min => ({ label: `${min}분`, value: min }));
    }, [minuteStep]);

    // Update tempValue logic - NO side effects (onChange) inside here
    const getNextValue = useCallback((updates: { period?: Period, hour?: string, minute?: string }) => {
        const [hStr, mStr] = (tempValue || '13:00').split(':');
        const h = parseInt(hStr || '13', 10);
        const currentPeriod: Period = h >= 12 ? 'PM' : 'AM';
        const currentDisplayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);

        const p = updates.period ?? currentPeriod;
        const dh = updates.hour ?? String(currentDisplayH);
        const min = updates.minute ?? (mStr || '00');

        let newH = parseInt(dh, 10);
        if (p === 'PM' && newH !== 12) newH += 12;
        else if (p === 'AM' && newH === 12) newH = 0;

        return `${String(newH).padStart(2, '0')}:${min}`;
    }, [tempValue]);

    const handleTempChange = useCallback((updates: { period?: Period, hour?: string, minute?: string }) => {
        const finalValue = getNextValue(updates);
        setTempValue(finalValue);

        // 🍌 Live sync - use a microtask or update it directly if not in a render cycle
        // Calling onChange here is safe as long as it's an event handler and not an updater function.
        if (finalValue !== value) {
            onChange(finalValue);
        }
    }, [onChange, value, getNextValue]);

    const handleConfirm = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        onChange(tempValue);
        setIsOpen(false);
        onComplete?.();
    }, [onChange, tempValue, onComplete]);

    const handleOpenModal = useCallback(() => {
        if (!disabled) {
            setTempValue(value || '13:00');
            setIsOpen(true);
        }
    }, [disabled, value]);

    return (
        <>
            <TextField.Button
                ref={ref}
                id={id}
                label={label || ''}
                variant="box"
                placeholder={placeholder}
                value={displayValue}
                onClick={handleOpenModal}
                className={className}
            />
            <Modal open={isOpen} onOpenChange={setIsOpen}>
                <Modal.Overlay />
                <Modal.Content className={styles.modalContent}>
                    <Modal.Header title="예식 시간 선택" />
                    <Modal.Body className={styles.modalBody}>
                        <div
                            className={styles.periodContainer}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
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

                        <div className={styles.pickerGrid}>
                            <div className={styles.mask} />
                            <div className={styles.highlightLine} />
                            <WheelColumn
                                options={hourOptions}
                                value={tDisplayHour}
                                onChange={(h) => handleTempChange({ hour: h })}
                            />
                            <WheelColumn
                                options={minuteOptions}
                                value={currentTM}
                                onChange={(m) => handleTempChange({ minute: m })}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={styles.footer}>
                        <Button
                            className={styles.fullWidth}
                            variant="fill"
                            size="lg"
                            onClick={handleConfirm}
                        >
                            선택 완료
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

export const TimePicker = React.forwardRef(TimePickerRaw);
TimePicker.displayName = "TimePicker";
