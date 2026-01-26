import React, { createContext, useContext, useId } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '../FormPrimitives';
import styles from './FormField.module.scss';

// --- Context ---
interface FormFieldContextValue {
    id: string;
    errorId?: string;
    descriptionId?: string;
    isError: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const useFormField = () => {
    const context = useContext(FormFieldContext);
    return context; // null일 수 있음 (단독 사용 시)
};

// --- Component ---
export interface FormFieldProps {
    label?: React.ReactNode | undefined;
    children: React.ReactNode;
    className?: string | undefined;
    required?: boolean | undefined;
    description?: React.ReactNode | undefined;
    error?: React.ReactNode | undefined;
    id?: string | undefined;
    action?: React.ReactNode | undefined;
    layout?: 'vertical' | 'horizontal' | undefined;
    align?: 'start' | 'center' | undefined;
}

export const FormField = React.memo(({
    label,
    children,
    className,
    required,
    description,
    error,
    id: customId,
    action,
    layout = 'vertical',
    align = 'start',
}: FormFieldProps) => {
    const reactId = useId();
    const id = customId || reactId;
    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;
    const isError = !!error;

    return (
        <FormFieldContext.Provider value={{ id, errorId, descriptionId, isError }}>
            <div className={cn(
                styles.fieldWrapper,
                styles[`layout-${layout}`],
                align === 'center' && styles.alignCenter,
                className
            )}
                role="group"
                aria-labelledby={label ? `${id}-label` : undefined}
            >
                {label ? (
                    <div className={styles.fieldHeader}>
                        <div className={styles.labelGroup}>
                            <Label
                                htmlFor={id}
                                id={`${id}-label`}
                                required={!!required}
                            >
                                {label}
                            </Label>
                        </div>
                        {action}
                    </div>
                ) : null}

                <div className={styles.fieldContent}>
                    {children}

                    {(layout === 'horizontal' || isError || description) && (description || error) ? (
                        <p className={cn(
                            styles.description,
                            isError && styles.error,
                            layout === 'horizontal' && styles.horizontalDesc
                        )}
                            id={isError ? errorId : descriptionId}
                        >
                            {error || description}
                        </p>
                    ) : null}
                </div>
            </div>
        </FormFieldContext.Provider>
    );
});

FormField.displayName = 'FormField';
