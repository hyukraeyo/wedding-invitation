"use client";

import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';
import styles from './Toggle.module.scss';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
}

/**
 * Toggle Component (Chip style)
 * Based on Radix UI Toggle for accessibility and state management.
 * Styled to match TDS (Toss Design System) aesthetics.
 */
export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({
  pressed,
  onPressedChange,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      className={cn(styles.toggle, className)}
      {...props}
    >
      {children}
    </TogglePrimitive.Root>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
