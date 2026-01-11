import React from 'react';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helpText?: string;
    hasError?: boolean;
    containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, containerClassName, label, helpText, hasError, disabled, ...props }, ref) => {
        const id = props.id || props.name;

        return (
            <div className={cn("grid w-full gap-1.5", containerClassName)}>
                {label && (
                    <Label
                        htmlFor={id}
                        className={cn(hasError && "text-destructive")}
                    >
                        {label}
                    </Label>
                )}

                <ShadcnTextarea
                    ref={ref}
                    disabled={disabled}
                    className={cn(
                        hasError && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    {...props}
                />

                {helpText && (
                    <p className={cn("text-sm text-muted-foreground", hasError && "text-destructive")}>
                        {helpText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
