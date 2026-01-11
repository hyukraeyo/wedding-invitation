'use client';

import { SegmentedControl as BaseSegmentedControl, SegmentedControlItem } from '@/components/common/SegmentedControl';

interface Option<T> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}

interface SegmentedControlProps<T> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    className?: string;
    size?: 'sm' | 'md';
}

export const SegmentedControl = <T extends string | number>({
    value,
    options,
    onChange,
    className = "",
    size = 'md'
}: SegmentedControlProps<T>) => {
    return (
        <BaseSegmentedControl
            value={value}
            onChange={onChange}
            className={className}
            size={size === 'sm' ? 'small' : 'large'}
        >
            {options.map((option) => (
                <SegmentedControlItem key={String(option.value)} value={option.value}>
                    {option.icon}
                    {option.label}
                </SegmentedControlItem>
            ))}
        </BaseSegmentedControl>
    );
};
