'use client';

import React, { useState } from 'react';
import styles from './TextField.module.scss';
import { clsx } from 'clsx';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helpText?: React.ReactNode;
    hasError?: boolean;
    right?: React.ReactNode;
    containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    ({ className, containerClassName, style, label, helpText, hasError, right, disabled, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        return (
            <div className={clsx(styles.container, containerClassName)}>
                {label && (
                    <label
                        className={clsx(styles.label, hasError && styles.hasError)}
                    >
                        {label}
                    </label>
                )}

                <div
                    className={clsx(styles.inputWrapper,
                        isFocused && styles.focused,
                        hasError && styles.hasError,
                        disabled && styles.disabled,
                        props.readOnly && styles.readOnly
                    )}
                >
                    <input
                        ref={ref}
                        disabled={disabled}
                        className={clsx(styles.input, className)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={style}
                        {...props}
                    />
                    {right && <div className={styles.rightAddon}>{right}</div>}
                </div>

                {helpText && (
                    <div className={clsx(styles.helpText, hasError && styles.error)}>
                        {helpText}
                    </div>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';
