'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Textarea.module.scss';
import { Field } from '../Field';

export type TextareaVariant = 'outline' | 'classic' | 'secondary' | 'primary';
export type TextareaRadius = 'none' | 'small' | 'medium' | 'large';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | undefined;
  variant?: TextareaVariant | undefined;
  radius?: TextareaRadius | undefined;
  highContrast?: boolean | undefined;
  error?: string | boolean | undefined;
  helperText?: string | undefined;
  showCount?: boolean | undefined;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      variant = 'outline',
      radius = 'medium',
      highContrast = false,
      error,
      helperText,
      showCount,
      className,
      id,
      disabled,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const isError = !!error;
    const errorMsg = typeof error === 'string' ? error : undefined;

    const [internalValue, setInternalValue] = React.useState(props.defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const textarea = (
      <div
        className={clsx(
          s.root,
          s[variant],
          s[`radius_${radius}`],
          highContrast && s.highContrast,
          isError && s.invalid,
          disabled && s.disabled,
          className
        )}
      >
        <textarea
          ref={ref}
          id={textareaId}
          className={s.textarea}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          maxLength={maxLength}
          aria-invalid={isError || undefined}
          data-invalid={isError ? 'true' : undefined}
          {...props}
        />
      </div>
    );

    if (label || helperText || error || (showCount && maxLength)) {
      return (
        <Field.Root error={isError} disabled={disabled}>
          {label && <Field.Label htmlFor={textareaId}>{label}</Field.Label>}
          {textarea}
          <Field.Footer>
            {helperText || errorMsg ? (
              <Field.HelperText error={isError}>{errorMsg || helperText}</Field.HelperText>
            ) : (
              <div />
            )}
            {showCount && maxLength && (
              <Field.Counter current={String(currentValue).length} max={maxLength} />
            )}
          </Field.Footer>
        </Field.Root>
      );
    }

    return textarea;
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
