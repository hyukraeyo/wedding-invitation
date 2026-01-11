import React, { useCallback } from 'react';
import styles from './Slider.module.scss';
import { Minus, Plus } from 'lucide-react';
import { Button } from './Button';

interface BuilderSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    className?: string;
}

export const Slider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unit: _unit = '',
    className = ''
}: BuilderSliderProps) => {

    const handleStep = useCallback((direction: 'up' | 'down') => {
        const newValue = direction === 'up' ? value + step : value - step;
        if (newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    }, [value, onChange, min, max, step]);

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.sliderWrapper}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={styles.slider}
                />
            </div>

            <div className={styles.buttonGroup}>
                <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleStep('down')}
                    className={styles.iconButton}
                    disabled={value <= min}
                >
                    <Minus size={14} />
                </Button>
                <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleStep('up')}
                    className={styles.iconButton}
                    disabled={value >= max}
                >
                    <Plus size={14} />
                </Button>
            </div>
        </div>
    );
};
