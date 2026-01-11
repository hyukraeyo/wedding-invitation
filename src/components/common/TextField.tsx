'use client';

import React, { forwardRef, useState } from 'react';
import styles from './TextField.module.scss';
import { clsx } from 'clsx';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'box' | 'line' | 'big' | 'hero';
    label?: string;
    labelOption?: 'appear' | 'sustain';
    help?: React.ReactNode;
    hasError?: boolean;
    leftAddon?: React.ReactNode;
    rightAddon?: React.ReactNode;
    right?: React.ReactNode;
    onClear?: () => void;
    clearable?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            variant = 'box',
            label,
            labelOption = 'sustain',
            help,
            hasError = false,
            leftAddon,
            rightAddon,
            right,
            onClear,
            clearable = false,
            className,
            value,
            onChange,
            onFocus,
            onBlur,
            disabled,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [internalValue, setInternalValue] = useState(props.defaultValue || '');

        // Support both controlled and uncontrolled
        const isControlled = value !== undefined;
        const hasValue = isControlled ? String(value).length > 0 : String(internalValue).length > 0;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!isControlled) {
                setInternalValue(e.target.value);
            }
            onChange?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        const showLabel = labelOption === 'sustain' || (labelOption === 'appear' && hasValue);

        return (
            <div className={clsx(styles.container, className)}>
                <div
                    className={clsx(
                        styles.inputWrapper,
                        styles[variant],
                        hasError && styles.hasError,
                        disabled && styles.disabled,
                        isFocused && styles.focused
                    )}
                >
                    <div className={styles.labelWrapper}>
                        {label && (
                            <label
                                className={clsx(
                                    styles.label,
                                    styles[labelOption],
                                    showLabel && styles.visible
                                )}
                            >
                                {label}
                            </label>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {leftAddon && <span className={styles.prefix}>{leftAddon}</span>}
                            <input
                                ref={ref}
                                className={styles.input}
                                value={value}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={disabled}
                                {...props}
                            />
                            {rightAddon && <span className={styles.suffix}>{rightAddon}</span>}
                        </div>
                    </div>

                    {(clearable && hasValue && !disabled) && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={onClear}
                            aria-label="Clear input"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </button>
                    )}

                    {right && <div className={styles.right}>{right}</div>}
                </div>

                {help && (
                    <div className={clsx(styles.help, hasError && styles.hasError)}>
                        {help}
                    </div>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';
