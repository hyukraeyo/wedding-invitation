'use client';

import React from 'react';
import styles from './BuilderInput.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

type BuilderInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const hexToRgbValues = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export const BuilderInput = ({ className, style, ...props }: BuilderInputProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <input
            {...props}
            className={clsx(styles.input, className)}
            style={{
                ...style,
                '--accent-color': accentColor,
                '--accent-rgb': hexToRgbValues(accentColor)
            } as React.CSSProperties}
        />
    );
};
