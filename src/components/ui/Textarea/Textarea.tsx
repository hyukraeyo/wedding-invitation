'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Textarea.module.scss';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    variant?: 'surface' | 'classic' | 'soft';
    radius?: 'none' | 'small' | 'medium' | 'large';
    highContrast?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, variant = 'surface', radius = 'medium', highContrast = false, className, ...props }, ref) => {
        const textarea = (
            <div
                className={clsx(
                    s.root,
                    s[variant],
                    s[`radius_${radius}`],
                    highContrast && s.highContrast,
                    props.disabled && s.disabled,
                    className
                )}
            >
                <textarea ref={ref} className={s.textarea} {...props} />
            </div>
        );

        if (label) {
            return (
                <label className={s.container}>
                    <span className={s.label}>{label}</span>
                    {textarea}
                </label>
            );
        }

        return textarea;
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
