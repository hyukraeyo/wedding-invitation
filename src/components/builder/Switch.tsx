'use client';

import { Switch as TDSSwitch } from '@toss/tds-mobile';
import styles from './Switch.module.scss';
import { clsx } from 'clsx';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string; // Additional className for the container
    disabled?: boolean;
}

export const Switch = ({ checked, onChange, label, className, disabled }: SwitchProps) => {
    return (
        <label className={clsx(styles.switchLabel, className)}>
            <div className={styles.switchWrapper}>
                <TDSSwitch
                    checked={checked}
                    onChange={(_, isChecked) => onChange(isChecked)}
                    disabled={disabled}
                />
            </div>
            {label && <span className={styles.labelText}>{label}</span>}
        </label>
    );
};
