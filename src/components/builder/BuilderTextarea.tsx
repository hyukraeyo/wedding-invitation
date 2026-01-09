import React from 'react';
import styles from './BuilderTextarea.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

type BuilderTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const hexToRgbValues = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

export const BuilderTextarea = (props: BuilderTextareaProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <textarea
            {...props}
            className={clsx(styles.textarea, props.className)}
            style={{
                ...props.style,
                '--accent-color': accentColor,
                '--accent-rgb': hexToRgbValues(accentColor)
            } as React.CSSProperties}
        />
    );
};
