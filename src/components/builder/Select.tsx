import React from 'react';
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';

interface Option<T> {
    label: string;
    value: T;
}

interface SelectProps<T> {
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string | undefined;
    className?: string | undefined;
    labelClassName?: string | undefined;
    label?: string | undefined; // Add label support if needed or inferred
}

export const Select = <T extends string | number>({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    labelClassName = "",
    label
}: SelectProps<T>) => {
    // We assume T matches string or number which can be converted to string for Select value
    const stringValue = String(value);

    const handleValueChange = (val: string) => {
        // Find orig option to get correct type value back?
        const opt = options.find(o => String(o.value) === val);
        if (opt) {
            onChange(opt.value);
        }
    };

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && <Label className={labelClassName}>{label}</Label>}
            <ShadcnSelect value={stringValue} onValueChange={handleValueChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, idx) => (
                        <SelectItem key={`${String(option.value)}-${idx}`} value={String(option.value)}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </ShadcnSelect>
        </div>
    );
};
