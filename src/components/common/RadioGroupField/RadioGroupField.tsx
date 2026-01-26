import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import { Field } from '@/components/common/FormPrimitives';
import { cn } from '@/lib/utils';
import styles from './RadioGroupField.module.scss';

interface RadioOption {
    label: string;
    value: string;
    description?: string;
    disabled?: boolean;
}

interface RadioGroupFieldProps {
    label?: string;
    description?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    options: RadioOption[];
    name?: string;
    className?: string;
    itemClassName?: string;
    required?: boolean;
    error?: React.ReactNode;
}

export const RadioGroupField = ({
    label,
    description,
    value,
    defaultValue,
    onValueChange,
    options,
    name,
    className,
    itemClassName,
    required,
    error,
}: RadioGroupFieldProps) => {
    const generatedId = React.useId();

    return (
        <Field
            label={label}
            description={description}
            required={required}
            error={error}
            className={className}
        >
            <RadioGroup
                {...(value !== undefined ? { value } : {})}
                {...(defaultValue !== undefined ? { defaultValue } : {})}
                {...(onValueChange ? { onValueChange } : {})}
                {...(name ? { name } : {})}
                className={styles.container}
            >
                {options.map((option) => {
                    const id = `${generatedId}-${option.value}`;
                    return (
                        <div key={option.value} className={cn(styles.item, itemClassName)}>
                            <RadioGroupItem
                                value={option.value}
                                id={id}
                                disabled={option.disabled}
                                className={styles.radio}
                            />
                            <div className={styles.content}>
                                <Label
                                    htmlFor={id}
                                    className={cn(
                                        styles.label,
                                        option.disabled && styles.disabled
                                    )}
                                >
                                    {option.label}
                                </Label>
                                {option.description && (
                                    <p className={styles.description}>
                                        {option.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </RadioGroup>
        </Field>
    );
};
