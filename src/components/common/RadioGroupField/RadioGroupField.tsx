import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import { Field } from '@/components/common/FormPrimitives';
import { cn } from '@/lib/utils';

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
                className="flex flex-col gap-3 py-1"
            >
                {options.map((option) => {
                    const id = `${generatedId}-${option.value}`;
                    return (
                        <div key={option.value} className={cn("flex items-start gap-3 cursor-pointer group", itemClassName)}>
                            <RadioGroupItem
                                value={option.value}
                                id={id}
                                disabled={option.disabled}
                                className="mt-0.5"
                            />
                            <div className="flex flex-col gap-1 cursor-pointer">
                                <Label
                                    htmlFor={id}
                                    className={cn(
                                        "cursor-pointer font-medium transition-colors",
                                        option.disabled ? "opacity-50" : "group-hover:text-zinc-900"
                                    )}
                                >
                                    {option.label}
                                </Label>
                                {option.description && (
                                    <p className="text-xs text-zinc-500 leading-relaxed cursor-pointer">
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
