"use client";

import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';
import styles from './Toggle.module.scss';

interface ToggleProps {
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

/**
 * Toggle Component (Chip style)
 * Based on Radix UI Toggle for accessibility and state management.
 * Styled to match TDS (Toss Design System) aesthetics.
 */
export const Toggle = ({
    pressed,
    onPressedChange,
    children,
    className,
    disabled
}: ToggleProps) => {
    return (
        <TogglePrimitive.Root
            pressed={pressed}
            onPressedChange={onPressedChange}
            disabled={disabled}
            className={cn(styles.toggle, className)}
        >
            {children}
        </TogglePrimitive.Root>
    );
};

export default Toggle;
