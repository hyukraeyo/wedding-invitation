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
}

type InputTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
};

type TextareaTextFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
};

export type TextFieldProps = BaseTextFieldProps & (InputTextFieldProps | TextareaTextFieldProps);

export const TextField = React.memo(React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
    ({ className, containerClassName, style, label, helpText, hasError, right, disabled, multiline, rows, ...props }, ref) => {
        const id = props.id || props.name;
        const inputProps = props as React.InputHTMLAttributes<HTMLInputElement>;
        const textareaProps = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

        const fieldProps = {
            ...(id ? { id } : {}),
            label,
            error: hasError ? helpText : undefined,
            description: !hasError ? helpText : undefined,
            className: containerClassName,
            required: props.required,
        };

        return (
            <Field {...fieldProps}>
                <div className={styles.inputWrapper} style={style}>
                    {multiline ? (
                        <Textarea
                            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                            rows={rows}
                            disabled={disabled}
                            className={cn(hasError && styles.errorInput, className)}
                            {...textareaProps}
                        />
                    ) : (
                        <Input
                            ref={ref as React.ForwardedRef<HTMLInputElement>}
                            disabled={disabled}
                            className={cn(
                                hasError && styles.errorInput,
                                right && styles.paddingRight,
                                className
                            )}
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
