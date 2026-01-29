import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from '../FormField';
import { Input, InputProps } from '@/components/ui/Input';

export interface TextFieldProps extends Omit<FormFieldProps, 'children'>, Omit<InputProps, 'label' | 'error'> {
    // Optionally override or add props here
}

/**
 * TextField: FormField와 Input을 결합한 편리한 컴포넌트입니다.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
    label,
    description,
    error,
    required,
    id,
    className,
    action,
    layout,
    align,
    variant,
    ...props
}, ref) => {
    return (
        <FormField
            label={label}
            description={description}
            error={error}
            required={required}
            id={id}
            className={className}
            action={action}
            layout={layout}
            align={align}
            variant={variant}
        >
            <Input ref={ref} {...props} />
        </FormField>
    );
});

TextField.displayName = 'TextField';
