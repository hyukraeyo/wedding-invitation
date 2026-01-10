'use client';

import React, { useMemo } from 'react';
import styles from './BuilderColorPicker.module.scss';
import { clsx } from 'clsx';

interface BuilderColorPickerProps {
    value: string;
    colors: string[];
    onChange: (color: string) => void;
    className?: string;
}

const getLuma = (hex: string): number => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const BuilderColorPicker = ({ value, colors, onChange, className }: BuilderColorPickerProps) => {
    const colorData = useMemo(() =>
        colors.map(color => ({
            color,
            ringColor: getLuma(color) > 220 ? '#D1D5DB' : color
        })),
        [colors]
    );

    return (
        <div className={clsx(styles.grid, className)}>
            {colorData.map(({ color, ringColor }) => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={clsx(styles.swatch, value === color && styles.selected)}
                    style={{
                        backgroundColor: color,
                        boxShadow: value === color ? `0 0 0 2px white, 0 0 0 4px ${ringColor}` : undefined
                    }}
                    title={color}
                    type="button"
                />
            ))}
        </div>
    );
};
