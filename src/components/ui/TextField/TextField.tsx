'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './TextField.module.scss';

// --- Context for sharing props between Root and Input/Slot ---
interface TextFieldContextValue {
    size?: '1' | '2' | '3';
    variant?: 'surface' | 'classic' | 'soft';
    color?: string;
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    disabled?: boolean;
}

const TextFieldContext = React.createContext<TextFieldContextValue>({});

// --- TextField.Root ---
export interface TextFieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: '1' | '2' | '3';
    variant?: 'surface' | 'classic' | 'soft';
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    highContrast?: boolean;
    disabled?: boolean;
}

const TextFieldRoot = React.forwardRef<HTMLDivElement, TextFieldRootProps>(
    ({ className, size = '2', variant = 'surface', radius = 'medium', highContrast = false, disabled = false, ...props }, ref) => {
        return (
            <TextFieldContext.Provider value={{ size, variant, radius, disabled }}>
                <div
                    ref={ref}
                    className={clsx(
                        s.root,
                        s[`size_${size}`],
                        s[variant],
                        s[`radius_${radius}`],
                        highContrast && s.highContrast,
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
        return (
            <input
                ref={ref}
                disabled={disabled}
                className={clsx(s.input, className)}
                {...props}
            />
        );
    }
);
TextFieldInput.displayName = 'TextField.Input';

// --- TextField.Slot ---
export interface TextFieldSlotProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: 'left' | 'right';
}

const TextFieldSlot = React.forwardRef<HTMLDivElement, TextFieldSlotProps>(
    ({ className, side = 'left', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(s.slot, s[`side_${side}`], className)}
                {...props}
            />
        );
    }
);
TextFieldSlot.displayName = 'TextField.Slot';

// --- TextField.Button ---
export interface TextFieldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    labelOption?: 'appear' | 'sustain';
    variant?: 'surface' | 'classic' | 'soft' | 'box';
    placeholder?: string;
}

const TextFieldButton = React.forwardRef<HTMLButtonElement, TextFieldButtonProps>(
    ({ className, children, label, labelOption, variant = 'surface', ...props }, ref) => {
        // Map 'box' to 'surface' for compatibility
        const mappedVariant = (variant === 'box' ? 'surface' : variant) as any;

        const button = (
            <TextFieldRoot variant={mappedVariant} className={className}>
                <button
                    ref={ref}
                    type="button"
                    className={clsx(s.input, s.button, className)}
                    {...props}
                >
                    {props.value || props.placeholder || children}
                </button>
            </TextFieldRoot>
        );

        if (label) {
            return (
                <label className={s.container}>
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
// Existing code uses <TextField label="..." variant="line" />
// We convert 'line' to 'classic' and handle the label.
export interface TextFieldLegacyProps extends Omit<TextFieldInputProps, 'size'> {
    label?: string;
    variant?: 'surface' | 'classic' | 'soft' | 'line' | 'box';
    size?: '1' | '2' | '3';
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldLegacyProps>(
    ({ label, variant = 'surface', size = '2', radius = 'medium', leftSlot, rightSlot, className, ...props }, ref) => {
        // Map existing 'line' or 'box' variant to Radix 'classic' or 'surface'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let mappedVariant = variant as any;
        if (variant === 'line') mappedVariant = 'classic';
        if (variant === 'box') mappedVariant = 'surface';

        const input = (
            <TextFieldRoot variant={mappedVariant} size={size} radius={radius} className={className}>
                {leftSlot && <TextFieldSlot side="left">{leftSlot}</TextFieldSlot>}
                <TextFieldInput ref={ref} {...props} />
                {rightSlot && <TextFieldSlot side="right">{rightSlot}</TextFieldSlot>}
            </TextFieldRoot>
        );

        if (label) {
            return (
                <label className={s.container}>
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
export type { TextFieldLegacyProps as TextFieldProps };
