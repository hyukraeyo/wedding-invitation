'use client';

import React from 'react';
import { clsx } from 'clsx';
import styles from './SegmentedControl.module.scss';

type SegmentedControlValue = string | number;
type SegmentedControlSize = 'small' | 'large';

interface SegmentedControlContextValue {
    value: SegmentedControlValue;
    onChange: (value: SegmentedControlValue) => void;
    size: SegmentedControlSize;
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null);

interface SegmentedControlProps<T extends SegmentedControlValue> {
    value: T;
    onChange: (value: T) => void;
    className?: string;
    size?: SegmentedControlSize;
    children: React.ReactNode;
}

export function SegmentedControl<T extends SegmentedControlValue>({
    value,
    onChange,
    className,
    size = 'large',
    children,
}: SegmentedControlProps<T>) {
    return (
        <div
            className={clsx(styles.container, size === 'small' ? styles.small : styles.large, className)}
            role="tablist"
            aria-orientation="horizontal"
        >
            <SegmentedControlContext.Provider value={{ value, onChange: onChange as (value: SegmentedControlValue) => void, size }}>
                {children}
            </SegmentedControlContext.Provider>
        </div>
    );
}

interface SegmentedControlItemProps<T extends SegmentedControlValue> {
    value: T;
    children: React.ReactNode;
}

export function SegmentedControlItem<T extends SegmentedControlValue>({ value, children }: SegmentedControlItemProps<T>) {
    const context = React.useContext(SegmentedControlContext);
    if (!context) return null;

    const isActive = context.value === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(
                styles.item,
                context.size === 'small' ? styles.itemSmall : styles.itemLarge,
                isActive && styles.itemActive
            )}
            onClick={() => context.onChange(value)}
        >
            {children}
        </button>
    );
}
