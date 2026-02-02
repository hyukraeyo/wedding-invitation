'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Textarea.module.scss';

type TextareaVariant = 'surface' | 'classic' | 'soft' | 'toss';
type TextareaRadius = 'none' | 'small' | 'medium' | 'large';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string | undefined;
    variant?: TextareaVariant | undefined;
    radius?: TextareaRadius | undefined;
    highContrast?: boolean | undefined;
    className?: string | undefined;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, variant = 'surface', radius = 'medium', highContrast = false, className, id, disabled, ...props }, ref) => {
        const generatedId = React.useId();
        const textareaId = id || generatedId;

        const textarea = (
            <div
                className={clsx(
                    s.root,
                    s[variant],
                    s[`radius_${radius}`],
                    highContrast && s.highContrast,
                    disabled && s.disabled,
                    className
                )}
            >
                <textarea ref={ref} id={textareaId} className={s.textarea} disabled={disabled} {...props} />
            </div>
        );

        if (label) {
            return (
                <label htmlFor={textareaId} className={s.container}>
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
