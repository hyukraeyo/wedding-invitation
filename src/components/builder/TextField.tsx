'use client';

import React, { useState } from 'react';
import styles from './TextField.module.scss';
import { clsx } from 'clsx';
// import { useInvitationStore } from '@/store/useInvitationStore'; // Temporarily disabled to follow TDS blue explicitly

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helpText?: React.ReactNode;
    hasError?: boolean;
    right?: React.ReactNode;
    containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    ({ className, containerClassName, style, label, helpText, hasError, right, disabled, onFocus, onBlur, ...props }, ref) => {
        // const accentColor = useInvitationStore(state => state.theme.accentColor);
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
                        // style={{
                        //     // Option: If we want to override TDS Blue with user theme color
                        //     // '--focus-color': accentColor 
                        //     ...style
                        // } as React.CSSProperties}
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
