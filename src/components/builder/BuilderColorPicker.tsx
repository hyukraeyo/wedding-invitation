'use client';

import React from 'react';
import styles from './BuilderColorPicker.module.scss';
import { clsx } from 'clsx';


interface BuilderColorPickerProps {
    value: string;
    colors: string[];
    onChange: (color: string) => void;
    className?: string;
}

export const BuilderColorPicker = ({ value, colors, onChange, className }: BuilderColorPickerProps) => {
    return (
        <div className={clsx(styles.grid, className)}>
            {colors.map((color) => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={clsx(styles.swatch, value === color && styles.selected)}
                    style={{
                        backgroundColor: color,
                        // Use the color itself for the ring, or accentColor if it's the accent picker?
                        // Let's standardise: White ring + Color ring
                        boxShadow: value === color
                            ? `0 0 0 2px white, 0 0 0 4px ${color}` // Use the color itself for distinct selection
                            : undefined
                    }}
                    title={color}
                    type="button"
                />
            ))}
        </div>
    );
};
