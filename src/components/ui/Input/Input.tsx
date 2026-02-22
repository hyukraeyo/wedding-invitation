'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={clsx(s.container, error && s.hasError, className)}>
        {label && (
          <label htmlFor={inputId} className={s.label}>
            {label}
          </label>
        )}
        <div className={s.inputWrapper}>
          {leftIcon && <div className={s.iconLeft}>{leftIcon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={clsx(s.input, leftIcon && s.paddingLeft, rightIcon && s.paddingRight)}
            {...props}
          />
          {rightIcon && <div className={s.iconRight}>{rightIcon}</div>}
        </div>
        {(error || helperText) && (
          <p className={clsx(s.message, error && s.errorMessage)}>{error || helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
