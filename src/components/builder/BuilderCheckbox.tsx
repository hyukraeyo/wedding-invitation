import React, { useId } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './Builder.module.scss';
import { clsx } from 'clsx';

interface BuilderCheckboxProps {
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

const hexToRgbValues = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export function BuilderCheckbox({ id, checked, onChange, children, className = '' }: BuilderCheckboxProps) {
    const internalId = useId();
    const generatedId = id || internalId;
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <label
            htmlFor={generatedId}
            className={clsx(styles.checkboxLabel, className)}
        >
            <input
                id={generatedId}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={styles.checkbox}
                style={{
                    '--accent-color': accentColor,
                    '--accent-rgb': hexToRgbValues(accentColor)
                } as React.CSSProperties}
            />
            {children && (
                <span className={styles.text}>
                    {children}
                </span>
            )}
        </label>
    );
}
