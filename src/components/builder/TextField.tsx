import React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string | undefined;
    helpText?: React.ReactNode | undefined;
    hasError?: boolean | undefined;
    right?: React.ReactNode | undefined;
    containerClassName?: string | undefined;
    multiline?: boolean | undefined;
    rows?: number | undefined;
}

export const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
    ({ className, containerClassName, style, label, helpText, hasError, right, disabled, onFocus, onBlur, multiline, rows, ...props }, ref) => {
        const id = props.id || props.name;

        const commonProps = {
            disabled,
            className: cn(
                hasError && "border-destructive focus-visible:ring-destructive",
                right && "pr-10",
                className
            ),
            onFocus,
            onBlur,
            style,
            ...props,
        };

        return (
            <div className={cn("flex flex-col gap-1.5", containerClassName)}>
                {label && (
                    <Label
                        htmlFor={id}
                        className={cn(hasError && "text-destructive")}
                    >
                        {label}
                    </Label>
                )}

                <div className="relative">
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
                    {right && !multiline && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {right}
                        </div>
                    )}
                </div>

                {helpText && (
                    <p className={cn("text-sm text-muted-foreground", hasError && "text-destructive")}>
                        {helpText}
                    </p>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';
