'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { useField } from '@/components/ui/Field';
import { Clock } from 'lucide-react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    className?: string;
    placeholder?: string;
    minuteStep?: number;
    minHour?: number;
    maxHour?: number;
    id?: string;
    disabled?: boolean;
    part?: 'all' | 'period' | 'time' | 'hour' | 'minute';
    variant?: 'default' | 'unified';
}

type Period = 'AM' | 'PM';

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
    ({ value, onChange, onComplete, className, minuteStep = 10, id, disabled, part = 'all', variant = 'default' }, ref) => {
        const field = useField();

        React.useEffect(() => {
            if (field?.setHasValue) {
                field.setHasValue(!!value);
            }
        }, [value, field]);

        const hasValue = !!value;
        const [hStr, mStr] = value && value.includes(':') ? value.split(':') : ['', ''];

        const hInt = hStr ? parseInt(hStr, 10) : undefined;
        const m = mStr || '';

        const isPm = hInt !== undefined ? hInt >= 12 : true; // Default to PM for weddings usually, but doesn't auto-fill hour
        const period: Period = isPm ? 'PM' : 'AM';

        let displayHour = '';
        if (hInt !== undefined) {
            let displayHourInt = hInt;
            if (hInt > 12) {
                displayHourInt = hInt - 12;
            } else if (hInt === 0) {
                displayHourInt = 12;
            }
            displayHour = String(displayHourInt);
        }

        const updateTime = (newPeriod: Period, newHourStr: string, newMinuteStr: string, isFinal = false) => {
            let formattedHour = '';

            if (newHourStr) {
                let hourVal = parseInt(newHourStr, 10);

                if (newPeriod === 'PM' && hourVal !== 12) {
                    hourVal += 12;
                } else if (newPeriod === 'AM' && hourVal === 12) {
                    hourVal = 0;
                }
                formattedHour = String(hourVal).padStart(2, '0');
            }

            const newValue = (formattedHour || newMinuteStr) ? `${formattedHour}:${newMinuteStr}` : '';
            onChange(newValue);

            if (isFinal && formattedHour && newMinuteStr) {
                onComplete?.();
            }
        };

        const handlePeriodChange = (val: Period) => {
            updateTime(val, displayHour, m);
        };

        const handleHourChange = (val: string) => {
            updateTime(period, val, m);
        };

        const handleMinuteChange = (val: string) => {
            updateTime(period, displayHour, val, true);
        };

        const periodOptions = [
            { label: '오전', value: 'AM' },
            { label: '오후', value: 'PM' }
        ];

        const hourOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(h => ({
            label: `${h}시`,
            value: h
        }));

        const minutes = Array.from(
            { length: Math.floor(60 / minuteStep) },
            (_, i) => String(i * minuteStep).padStart(2, '0')
        );

        const minuteOptions = minutes.map(min => ({ label: `${min}분`, value: min }));

        const renderPeriod = () => (
            <div className={styles.periodSection}>
                <Select
                    id={id}
                    value={hasValue ? period : ''}
                    onValueChange={(val: string) => handlePeriodChange(val as Period)}
                    options={periodOptions}
                    placeholder="오전/오후"
                    modalTitle="오전/오후"
                    disabled={disabled}
                />
            </div>
        );

        const renderHour = () => (
            <div className={styles.hourSection}>
                <Select
                    value={hasValue ? displayHour : ''}
                    onValueChange={handleHourChange}
                    options={hourOptions}
                    placeholder="시"
                    modalTitle="시간"
                    disabled={disabled}
                />
            </div>
        );

        const renderMinute = () => (
            <div className={styles.minuteSection}>
                <Select
                    value={hasValue ? m : ''}
                    onValueChange={handleMinuteChange}
                    options={minuteOptions}
                    placeholder="분"
                    modalTitle="분"
                    disabled={disabled}
                />
            </div>
        );

        const renderTime = () => (
            <>
                {renderHour()}
                <span className={styles.separator}>:</span>
                {renderMinute()}
            </>
        );

        const [isOpen, setIsOpen] = React.useState(false);
        const [tempValue, setTempValue] = React.useState(value || '10:00');

        // Sync tempValue when modal opens (only on open, not on value changes)
        React.useEffect(() => {
            if (isOpen) {
                // Use current value if available, otherwise default to '10:00'
                setTempValue(value || '10:00');
            }
        }, [isOpen]); // Removed 'value' from dependencies to prevent re-sync while modal is open

        const [tH, tM] = (tempValue || '10:00').split(':');
        const tHInt = parseInt(tH || '10', 10);
        const isTPm = tHInt >= 12;
        const tPeriod: Period = isTPm ? 'PM' : 'AM';
        const tDisplayHour = String(tHInt > 12 ? tHInt - 12 : (tHInt === 0 ? 12 : tHInt));
        const currentTM = tM || '00';

        const updateTempTime = (newP: Period, newH: string, newMin: string) => {
            let h = parseInt(newH, 10);
            if (newP === 'PM' && h !== 12) h += 12;
            else if (newP === 'AM' && h === 12) h = 0;
            setTempValue(`${String(h).padStart(2, '0')}:${newMin}`);
        };

        const handleConfirm = () => {
            onChange(tempValue);
            setIsOpen(false);
            onComplete?.();
        };

        const renderUnifiedTrigger = () => {
            const displayStr = hasValue ? `${period === 'AM' ? '오전' : '오후'} ${displayHour}시 ${m}분` : '';
            return (
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    className={cn(styles.unifiedTrigger, field?.variant === 'floating' && styles.floatingTrigger, className)}
                    onClick={() => setIsOpen(true)}
                    data-variant={field?.variant}
                >
                    <span className={cn(!hasValue && styles.placeholder)}>
                        {displayStr}
                    </span>
                    <Clock className={styles.icon} />
                </button>
            );
        };

        // Scroll to current selection when modal opens
        React.useEffect(() => {
            if (isOpen) {
                // 약간의 지연을 주어 모달이 렌더링된 후 스크롤
                const timer = setTimeout(() => {
                    const activeElements = document.querySelectorAll(`.${styles.active}`);
                    activeElements.forEach(el => {
                        el.scrollIntoView({ block: 'center', behavior: 'auto' });
                    });
                }, 100);
                return () => clearTimeout(timer);
            }
            return undefined;
        }, [isOpen]);

        const renderColumn = (title: string, options: { label: string, value: string }[], current: string, onSelect: (val: string) => void, columnId: string) => (
            <div className={styles.column}>
                <div className={styles.columnHeader}>{title}</div>
                <div className={styles.scrollWrapper} data-column={columnId}>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={cn(styles.optionItem, current === opt.value && styles.active)}
                            onClick={() => onSelect(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        );

        if (part === 'all' || variant === 'unified') {
            return (
                <div ref={ref} className={cn(styles.unifiedContainer)}>
                    <ResponsiveModal
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        title="예식 시간 선택"
                        confirmText="선택 완료"
                        onConfirm={handleConfirm}
                        padding="none"
                        fullWidthActions={true}
                        trigger={renderUnifiedTrigger()}
                    >
                        <div className={styles.pickerGrid}>
                            {renderColumn('오전/오후', periodOptions, tPeriod, (v) => updateTempTime(v as Period, tDisplayHour, currentTM), 'period')}
                            {renderColumn('시간', hourOptions, tDisplayHour, (v) => updateTempTime(tPeriod, v, currentTM), 'hour')}
                            {renderColumn('분', minuteOptions, currentTM, (v) => updateTempTime(tPeriod, tDisplayHour, v), 'minute')}
                        </div>
                    </ResponsiveModal>
                </div>
            );
        }

        return (
            <div ref={ref} className={cn(styles.container, className)}>
                {part === 'period' && renderPeriod()}
                {part === 'time' && renderTime()}
                {part === 'hour' && renderHour()}
                {part === 'minute' && renderMinute()}
            </div>
        );
    }
);

TimePicker.displayName = "TimePicker";
