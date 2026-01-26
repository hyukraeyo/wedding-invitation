import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import styles from './TextField.module.scss';
import { Field } from '@/components/common/FormPrimitives';

interface BaseTextFieldProps {
    label?: string;
    helpText?: React.ReactNode;
    hasError?: boolean;
    right?: React.ReactNode;
    containerClassName?: string;
    multiline?: boolean;
    rows?: number;
    size?: 'sm' | 'md' | 'lg';
    hideLabel?: boolean;
    hideHelpText?: boolean;
}

type InputTextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    multiline?: false;
};

type TextareaTextFieldProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
    multiline: true;
};

export type TextFieldProps = BaseTextFieldProps & (InputTextFieldProps | TextareaTextFieldProps);

export const TextField = React.memo(React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
    ({ className, containerClassName, style, label, helpText, hasError, right, disabled, multiline, rows, size = 'md', hideLabel, hideHelpText, ...props }, ref) => {
        const id = props.id || props.name;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size: _size, ...inputProps } = props as React.InputHTMLAttributes<HTMLInputElement>;
        const textareaProps = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

        const fieldProps = {
            ...(id ? { id } : {}),
            label,
            error: hasError ? helpText : undefined,
            description: !hasError ? helpText : undefined,
            className: containerClassName,
            required: props.required,
            hideLabel,
            hideDescription: hideHelpText,
        };

        return (
            <Field {...fieldProps}>
                <div className={styles.inputWrapper} style={style}>
                    {multiline ? (
                        <Textarea
                            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                            rows={rows}
                            size={size}
                            disabled={disabled}
                            className={className}
                            error={!!hasError}
                            {...textareaProps}
                        />
                    ) : (
                        <Input
                            ref={ref as React.ForwardedRef<HTMLInputElement>}
                            size={size}
                            disabled={disabled}
                            className={cn(
                                right && styles.paddingRight,
                                className
                            )}
                            error={!!hasError}
                            {...inputProps}
                        />
                    )}
                    {right && !multiline ? (
                        <div className={styles.rightIcon}>
                            {right}
                        </div>
                    ) : null}
                </div>
            </Field>
        );
    }
));

TextField.displayName = 'TextField';
