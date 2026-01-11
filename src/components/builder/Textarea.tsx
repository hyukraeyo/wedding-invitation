'use client';

import React from 'react';
import styles from './Textarea.module.scss';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helpText?: string;
    hasError?: boolean;
    containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, containerClassName, label, helpText, hasError, disabled, ...props }, ref) => {
        return (
            <div className={clsx(styles.container, containerClassName)}>
                {label && (
                    <label className={clsx(styles.label, hasError && styles.hasError)}>
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    disabled={disabled}
                    className={clsx(styles.textarea, hasError && styles.hasError, className)}
                    {...props}
                />

                {helpText && (
                    <div className={clsx(styles.helpText, hasError && styles.error)}>
                        {helpText}
                    </div>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
