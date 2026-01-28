import React, { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldHeader,
    useField
} from '@/components/ui/Field';

// --- Context & Hook (Compatibility) ---
export const useFormField = () => {
    const context = useField();
    return context;
};

// --- Component ---
export interface FormFieldProps {
    label?: ReactNode;
    children: ReactNode;
    className?: string;
    required?: boolean;
    description?: ReactNode;
    error?: ReactNode;
    id?: string;
    action?: ReactNode;
    layout?: 'vertical' | 'horizontal';
    align?: 'start' | 'center';
}

/**
 * FormField: 최신 UI 가이드라인에 맞게 고도화된 필드 컴포넌트.
 * 내부적으로 @/components/ui/Field 구성을 사용합니다.
 */
export const FormField = memo(({
    label,
    children,
    className,
    required,
    description,
    error,
    id,
    action,
    layout = 'vertical',
    align = 'start',
}: FormFieldProps) => {
    const isError = !!error;

    return (
        <Field
            id={id}
            isError={isError}
            orientation={layout}
            className={cn(align === 'center' && 'alignCenter', className)}
        >
            {label ? (
                <FieldHeader>
                    <FieldLabel required={!!required}>
                        {label}
                    </FieldLabel>
                    {action}
                </FieldHeader>
            ) : null}

            <FieldContent>
                {children}

                {/* 에러나 설명이 있을 경우만 렌더링 */}
                {isError ? (
                    <FieldError>{error}</FieldError>
                ) : description ? (
                    <FieldDescription>{description}</FieldDescription>
                ) : null}
            </FieldContent>
        </Field>
    );
});

FormField.displayName = 'FormField';
