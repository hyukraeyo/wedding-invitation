import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import styles from './TextField.module.scss';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string | undefined;
    helpText?: React.ReactNode | undefined;
    hasError?: boolean | undefined;
    right?: React.ReactNode | undefined;
    containerClassName?: string | undefined;
    multiline?: boolean | undefined;
    rows?: number | undefined;
}

export const TextField = React.memo(React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
    ({ className, containerClassName, style, label, helpText, hasError, right, disabled, onFocus, onBlur, multiline, rows, ...props }, ref) => {
        const id = props.id || props.name;

        const commonProps = {
            disabled,
            className: cn(
                hasError && styles.errorInput,
                right && styles.paddingRight,
                className
            ),
            onFocus,
            onBlur,
            style,
            ...props,
        };

        return (
            <div className={cn(styles.container, containerClassName)}>
                {label ? (
                    <Label
                        htmlFor={id}
                        className={cn(hasError && styles.errorLabel)}
                    >
                        {label}
                    </Label>
                ) : null}

                <div className={styles.inputWrapper}>
                    {multiline ? (
                        <Textarea
                            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                            rows={rows}
                            {...(commonProps as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    ) : (
                        <Input
                            ref={ref as React.ForwardedRef<HTMLInputElement>}
                            {...(commonProps as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
                        />
                    )}
                    {right && !multiline ? (
                        <div className={styles.rightIcon}>
                            {right}
                        </div>
                    ) : null}
                </div>

                {helpText ? (
                    <p className={cn(styles.helpText, hasError && styles.hasError)}>
                        {helpText}
                    </p>
                ) : null}
            </div>
        );
    }
));

TextField.displayName = 'TextField';
