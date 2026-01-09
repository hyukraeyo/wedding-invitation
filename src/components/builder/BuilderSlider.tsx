'use client';

import React from 'react';
import styles from './BuilderSlider.module.scss';
import { Minus, Plus } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { clsx } from 'clsx';
import { BuilderButton } from './BuilderButton';

interface BuilderSliderProps {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    className?: string;
    showButtons?: boolean;
}

export const BuilderSlider = ({
    value,
    min,
    max,
    step,
    onChange,
    className,
    showButtons = true
}: BuilderSliderProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const handleStep = (direction: 'up' | 'down') => {
        const newValue = direction === 'up' ? value + step : value - step;
        // Clamp value
        const clamped = Math.min(Math.max(newValue, min), max);
        onChange(Number(clamped.toFixed(1))); // Handle floating point precision
    };

    return (
        <div className={clsx(styles.container, className)}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className={styles.slider}
                style={{ '--accent-color': accentColor } as React.CSSProperties}
            />

            {showButtons && (
                <div className={styles.buttonGroup}>
                    <BuilderButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleStep('down')}
                        className={styles.iconButton}
                        disabled={value <= min}
                    >
                        <Minus size={14} />
                    </BuilderButton>
                    <BuilderButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleStep('up')}
                        className={styles.iconButton}
                        disabled={value >= max}
                    >
                        <Plus size={14} />
                    </BuilderButton>
                </div>
            )}
        </div>
    );
};
