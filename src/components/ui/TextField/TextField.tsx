'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './TextField.module.scss';

// --- Context for sharing props between Root and Input/Slot ---
type TextFieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type TextFieldVariant = 'surface' | 'classic' | 'soft' | 'apple' | 'toss';
type TextFieldRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

interface TextFieldContextValue {
  size?: TextFieldSize | undefined;
  variant?: TextFieldVariant | undefined;
  color?: string | undefined;
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
  className?: string | undefined;
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
  ({ className, ...props }, ref) => {
    const { disabled } = React.useContext(TextFieldContext);
    return <input ref={ref} disabled={disabled} className={clsx(s.input, className)} {...props} />;
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
}

const TextFieldButton = React.forwardRef<HTMLButtonElement, TextFieldButtonProps>(
  (
    { className, children, label, variant = 'toss', size = 'md', radius = 'medium', id, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isPlaceholder = !props.value && !!props.placeholder;

    const button = (
      <TextFieldRoot variant={variant} size={size} radius={radius} className={className}>
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

    if (label) {
      return (
        <label htmlFor={inputId} className={s.container}>
          <span className={s.label}>{label}</span>
          {button}
        </label>
      );
    }

    return button;
  }
);
TextFieldButton.displayName = 'TextField.Button';

// --- Combined / Compatibility Export ---
// --- Combined / Compatibility Export ---
export interface TextFieldProps extends Omit<TextFieldInputProps, 'size'> {
  label?: string | undefined;
  variant?: TextFieldVariant | undefined;
  size?: TextFieldSize | undefined;
  radius?: TextFieldRadius | undefined;
  invalid?: boolean | undefined;
  leftSlot?: React.ReactNode | undefined;
  rightSlot?: React.ReactNode | undefined;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      variant = 'toss',
      size = 'md',
      radius = 'medium',
      invalid = false,
      leftSlot,
      rightSlot,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const input = (
      <TextFieldRoot
        variant={variant}
        size={size}
        radius={radius}
        invalid={invalid}
        className={className}
      >
        {leftSlot && <TextFieldSlot side="left">{leftSlot}</TextFieldSlot>}
        <TextFieldInput ref={ref} id={inputId} aria-invalid={invalid || undefined} {...props} />
        {rightSlot && <TextFieldSlot side="right">{rightSlot}</TextFieldSlot>}
      </TextFieldRoot>
    );

    if (label) {
      return (
        <label htmlFor={inputId} className={s.container}>
          <span className={s.label}>{label}</span>
          {input}
        </label>
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
