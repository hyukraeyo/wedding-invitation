'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import s from './TextField.module.scss';
import { Field } from '../Field';

// --- Context for sharing props between Root and Input/Slot ---
export type TextFieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextFieldVariant = 'surface' | 'classic' | 'soft' | 'apple' | 'toss';
export type TextFieldRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

export type TextFieldEnterKeyHint = React.InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];

interface TextFieldContextValue {
  size?: TextFieldSize | undefined;
  variant?: TextFieldVariant | undefined;
  radius?: TextFieldRadius | undefined;
  disabled?: boolean | undefined;
}

const TextFieldContext = React.createContext<TextFieldContextValue>({});

// --- TextField.Root ---
export interface TextFieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: TextFieldSize | undefined;
  variant?: TextFieldVariant | undefined;
  radius?: TextFieldRadius | undefined;
  highContrast?: boolean | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
}

const TextFieldRoot = React.forwardRef<HTMLDivElement, TextFieldRootProps>(
  (
    {
      className,
      size = 'md',
      variant = 'toss',
      radius = 'medium',
      highContrast = false,
      disabled = false,
      invalid = false,
      ...props
    },
    ref
  ) => {
    return (
      <TextFieldContext.Provider value={{ size, variant, radius, disabled }}>
        <div
          ref={ref}
          className={clsx(
            s.root,
            s[size],
            s[variant],
            s[`radius_${radius}`],
            highContrast && s.highContrast,
            invalid && s.invalid,
            disabled && s.disabled,
            className
          )}
          {...props}
        />
      </TextFieldContext.Provider>
    );
  }
);
TextFieldRoot.displayName = 'TextField.Root';

// --- TextField.Input ---
export type TextFieldInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const TextFieldInput = React.forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ className, enterKeyHint, ...props }, ref) => {
    const { disabled } = React.useContext(TextFieldContext);
    return (
      <input
        ref={ref}
        disabled={disabled}
        enterKeyHint={enterKeyHint}
        className={clsx(s.input, className)}
        {...props}
      />
    );
  }
);
TextFieldInput.displayName = 'TextField.Input';

// --- TextField.Slot ---
export interface TextFieldSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | undefined;
}

const TextFieldSlot = React.forwardRef<HTMLDivElement, TextFieldSlotProps>(
  ({ className, side = 'left', ...props }, ref) => {
    return <div ref={ref} className={clsx(s.slot, s[`side_${side}`], className)} {...props} />;
  }
);
TextFieldSlot.displayName = 'TextField.Slot';

// --- TextField.Button ---
export interface TextFieldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string | undefined;
  variant?: TextFieldVariant | undefined;
  size?: TextFieldSize | undefined;
  radius?: TextFieldRadius | undefined;
  placeholder?: string | undefined;
  error?: string | boolean | undefined;
  helperText?: string | undefined;
}

const TextFieldButton = React.forwardRef<HTMLButtonElement, TextFieldButtonProps>(
  (
    {
      className,
      children,
      label,
      variant = 'toss',
      size = 'md',
      radius = 'medium',
      error,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isPlaceholder = !props.value && !!props.placeholder;

    const button = (
      <TextFieldRoot
        variant={variant}
        size={size}
        radius={radius}
        invalid={!!error}
        className={className}
      >
        <button
          ref={ref}
          id={inputId}
          type="button"
          className={clsx(s.input, s.button, isPlaceholder && s.placeholder, className)}
          {...props}
        >
          {props.value || props.placeholder || children}
        </button>
      </TextFieldRoot>
    );

    if (label || helperText || error) {
      return (
        <Field.Root error={error} disabled={props.disabled}>
          {label && <Field.Label htmlFor={inputId}>{label}</Field.Label>}
          {button}
          {(helperText || typeof error === 'string') && (
            <Field.HelperText error={!!error}>{typeof error === 'string' ? error : helperText}</Field.HelperText>
          )}
        </Field.Root>
      );
    }

    return button;
  }
);
TextFieldButton.displayName = 'TextField.Button';

// --- Main TextField Component ---
export interface TextFieldProps extends Omit<TextFieldInputProps, 'size' | 'prefix'> {
  label?: string | undefined;
  variant?: TextFieldVariant | undefined;
  size?: TextFieldSize | undefined;
  radius?: TextFieldRadius | undefined;
  invalid?: boolean | undefined; // Backward compatibility
  error?: string | boolean | undefined;
  helperText?: string | undefined;
  leftSlot?: React.ReactNode | undefined;
  rightSlot?: React.ReactNode | undefined;
  prefix?: React.ReactNode | undefined;
  suffix?: React.ReactNode | undefined;
  clearable?: boolean | undefined;
  onClear?: (() => void) | undefined;
  showCount?: boolean | undefined;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      variant = 'toss',
      size = 'md',
      radius = 'medium',
      invalid,
      error,
      helperText,
      leftSlot,
      rightSlot,
      prefix,
      suffix,
      clearable,
      onClear,
      showCount,
      className,
      id,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isError = !!error || !!invalid;
    const errorMsg = typeof error === 'string' ? error : undefined;

    const lSlot = prefix || leftSlot;
    const rSlot = suffix || rightSlot;

    const [internalValue, setInternalValue] = React.useState(props.defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      if (value === undefined) {
        setInternalValue('');
      } else {
        // If controlled, we can't clear it ourselves, but we should trigger onChange
      }
      // Trigger onChange if possible
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const input = (
      <TextFieldRoot
        variant={variant}
        size={size}
        radius={radius}
        invalid={isError}
        className={className}
      >
        {lSlot && <TextFieldSlot side="left">{lSlot}</TextFieldSlot>}
        <TextFieldInput
          ref={ref}
          id={inputId}
          aria-invalid={isError || undefined}
          value={currentValue}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {(clearable && currentValue) && (
          <TextFieldSlot side="right">
            <button
              type="button"
              className={s.clearButton}
              onClick={handleClear}
              aria-label="Clear"
            >
              <X />
            </button>
          </TextFieldSlot>
        )}
        {rSlot && <TextFieldSlot side="right">{rSlot}</TextFieldSlot>}
      </TextFieldRoot>
    );

    if (label || helperText || error || (showCount && maxLength)) {
      return (
        <Field.Root error={isError} disabled={props.disabled}>
          {label && <Field.Label htmlFor={inputId}>{label}</Field.Label>}
          {input}
          <Field.Footer>
            {(helperText || errorMsg) ? (
              <Field.HelperText error={isError}>{errorMsg || helperText}</Field.HelperText>
            ) : <div />}
            {(showCount && maxLength) && (
              <Field.Counter current={String(currentValue).length} max={maxLength} />
            )}
          </Field.Footer>
        </Field.Root>
      );
    }

    return input;
  }
);
TextField.displayName = 'TextField';

// Assign sub-components
const TextFieldNamespace = Object.assign(TextField, {
  Root: TextFieldRoot,
  Input: TextFieldInput,
  Slot: TextFieldSlot,
  Button: TextFieldButton,
});

export { TextFieldNamespace as TextField };
