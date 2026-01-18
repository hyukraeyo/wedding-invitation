'use client';

import React from 'react';
import { SegmentedControl as BaseSegmentedControl, SegmentedControlItem } from '@/components/ui/SegmentedControl';
import styles from './SegmentedControl.module.scss';

interface Option<T> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}

interface SegmentedControlProps<T> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    className?: string | undefined;
    size?: 'sm' | 'md' | undefined;
}

export const OptionsSegmentedControl = <T extends string | number>({
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
                    <span className={styles.itemContent}>
                        {option.icon}
                        <span>{option.label}</span>
                    </span>
                </SegmentedControlItem>
            ))}
        </BaseSegmentedControl>
    );
};

// Re-export for convenience
export { OptionsSegmentedControl as SegmentedControl };
