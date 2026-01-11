import React from 'react';
import styles from './Textarea.module.scss';
import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
};

export const Textarea = (props: TextareaProps) => {
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <textarea
            {...props}
            className={clsx(styles.textarea, props.className)}
            style={{
                ...props.style,
                '--focus-color': accentColor, // Assuming focus color logic similar to input
            } as React.CSSProperties}
        />
    );
};
