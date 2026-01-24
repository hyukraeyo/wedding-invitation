import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import styles from './ColorPicker.module.scss';

interface ColorPickerProps {
    value: string;
    colors: string[];
    onChange: (color: string) => void;
    className?: string;
}

const getLuma = (hex: string): number => {
    // Basic hex parsing, assumes standard #RRGGBB format
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const ColorPicker = ({ value, colors = [], onChange, className }: ColorPickerProps) => {
    const colorData = useMemo(() =>
        colors.map(color => ({
            color,
            ringColor: getLuma(color) > 220 ? '#D1D5DB' : color
        })),
        [colors]
    );

    return (
        <div className={cn(styles.grid, className)}>
            {colorData.map(({ color, ringColor }) => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={cn(
                        styles.button,
                        styles.buttonInteractive,
                        value === color && styles.selected
                    )}
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
