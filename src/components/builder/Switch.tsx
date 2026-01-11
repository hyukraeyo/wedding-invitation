'use client';

import React from 'react';
import styles from './Switch.module.scss';
import { clsx } from 'clsx';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string; // Additional className for the container
}

export const Switch = ({ checked, onChange, label, className, disabled, ...props }: SwitchProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange(e.target.checked);
    };

    return (
        <label className={clsx(styles.switchLabel, className)}>
            <div className={styles.switchWrapper}>
                <input
                    type="checkbox"
                    className={styles.input}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    {...props}
                />
                <div className={styles.track}>
                    <div className={styles.handle} />
                </div>
            </div>
            {label && <span style={{ marginLeft: '12px', fontSize: '15px', fontWeight: 500, color: '#333d4b' }}>{label}</span>}
        </label>
    );
};
