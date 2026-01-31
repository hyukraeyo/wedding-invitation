import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Dialog as Modal } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
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
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    // Sync scroll position when value changes externally
    useEffect(() => {
        if (scrollRef.current && !isScrollingRef.current) {
            const index = options.findIndex(opt => opt.value === value);
            if (index !== -1) {
                scrollRef.current.scrollTop = index * ITEM_HEIGHT;
            }
        }
    }, [value, options]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        isScrollingRef.current = true;

        const scrollTop = scrollRef.current.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);

        if (options[index] && options[index].value !== value) {
            onChange(options[index].value);
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 150);
    }, [options, value, onChange]);

    return (
        <div className={styles.column}>
            <div
                ref={scrollRef}
                className={styles.scrollWrapper}
                onScroll={handleScroll}
            >
                <div style={{ height: ITEM_HEIGHT * 2 }} />
                {options.map((opt) => {
                    const isActive = value === opt.value;
                    return (
                        <div
                            key={opt.value}
                            className={cn(styles.optionItem, isActive && styles.active)}
                            onClick={() => {
                                if (scrollRef.current) {
                                    const index = options.findIndex(o => o.value === opt.value);
                                    scrollRef.current.scrollTo({
                                        top: index * ITEM_HEIGHT,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                        >
                            {opt.label}
                        </div>
                    );
                })}
                <div style={{ height: ITEM_HEIGHT * 2 }} />
            </div>
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

    // Sync from parent
    useEffect(() => {
        if (value) setTempValue(value);
    }, [value]);

    const { displayValue, currentTM, tPeriod, tDisplayHour } = useMemo(() => {
        const hasValue = !!value;
        const [hStr, mStr] = (value || '13:00').split(':');
        const hInt = parseInt(hStr, 10);
        const period: Period = hInt >= 12 ? 'PM' : 'AM';
        const displayH = hInt > 12 ? hInt - 12 : (hInt === 0 ? 12 : hInt);

        const display = hasValue
            ? `${period === 'AM' ? '오전' : '오후'} ${displayH}시 ${mStr}분`
            : '';

        const [tHStr, tMStr] = (tempValue || '13:00').split(':');
        const tHInt = parseInt(tHStr, 10);
        const tp: Period = tHInt >= 12 ? 'PM' : 'AM';
        const tdh = String(tHInt > 12 ? tHInt - 12 : (tHInt === 0 ? 12 : tHInt));

        return {
            displayValue: display,
            currentTM: tMStr || '00',
            tPeriod: tp,
            tDisplayHour: tdh
        };
    }, [value, tempValue]);

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

    const updateTempTime = useCallback((updates: { period?: Period, hour?: string, minute?: string }) => {
        setTempValue(prev => {
            const [hStr, mStr] = prev.split(':');
            const h = parseInt(hStr, 10);
            const currentPeriod: Period = h >= 12 ? 'PM' : 'AM';
            const currentDisplayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);

            const p = updates.period ?? currentPeriod;
            const dh = updates.hour ?? String(currentDisplayH);
            const min = updates.minute ?? mStr;

            let newH = parseInt(dh, 10);
            if (p === 'PM' && newH !== 12) newH += 12;
            else if (p === 'AM' && newH === 12) newH = 0;

            return `${String(newH).padStart(2, '0')}:${min}`;
        });
    }, []);

    // Sync to parent
    useEffect(() => {
        if (isOpen && tempValue !== value) {
            onChange(tempValue);
        }
    }, [tempValue, isOpen, onChange, value]);

    const handleConfirm = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        onChange(tempValue);
        setIsOpen(false);
        onComplete?.();
    }, [onChange, tempValue, onComplete]);

    return (
        <>
            <TextField.Button
                ref={ref}
                id={id}
                label={label || ''}
                variant="box"
                placeholder={placeholder}
                value={displayValue}
                onClick={() => {
                    if (!disabled) {
                        setTempValue(value || '13:00');
                        setIsOpen(true);
                    }
                }}
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
                                onChange={(v: string) => updateTempTime({ period: v as Period })}
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
                                onChange={(h) => updateTempTime({ hour: h })}
                            />
                            <WheelColumn
                                options={minuteOptions}
                                value={currentTM}
                                onChange={(m) => updateTempTime({ minute: m })}
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
