'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './SegmentedControl.module.scss';

export interface SegmentedControlProps {
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    children: React.ReactNode;
    alignment?: 'auto' | 'fluid' | undefined;
    className?: string | undefined;
}

const SegmentedControlContext = React.createContext<{
    value?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
}>({});

const SegmentedControlMain = ({ value: propsValue, defaultValue, onChange, children, alignment = 'auto', className }: SegmentedControlProps) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const value = propsValue !== undefined ? propsValue : internalValue;

    const handleChange = (val: string) => {
        if (propsValue === undefined) {
            setInternalValue(val);
        }
        onChange?.(val);
    };

    return (
        <SegmentedControlContext.Provider value={{ value, onChange: handleChange }}>
            <div className={clsx(s.root, alignment === 'fluid' && s.fluid, className)}>
                {children}
            </div>
        </SegmentedControlContext.Provider>
    );
};

export interface SegmentedControlItemProps {
    value: string;
    children: React.ReactNode;
    className?: string | undefined;
}

const Item = ({ value: itemValue, children, className }: SegmentedControlItemProps) => {
    const context = React.useContext(SegmentedControlContext);
    const isActive = context.value === itemValue;

    return (
        <button
            type="button"
            className={clsx(s.item, isActive && s.active, className)}
            onClick={() => context.onChange?.(itemValue)}
        >
            {children}
        </button>
    );
};

export const SegmentedControl = Object.assign(SegmentedControlMain, {
    Item,
});
