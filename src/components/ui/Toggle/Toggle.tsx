"use client";

import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';
import styles from './Toggle.module.scss';

interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  size?: 'sm' | 'md' | 'lg' | 'square';
}

/**
 * Toggle Component
 * Based on Radix UI Toggle for accessibility and state management.
 * Used for binary state switching in button form.
 */
export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({
  size = 'md',
  className,
  ...props
}, ref) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        styles.toggle,
        styles[size],
        className
      )}
      {...props}
    />
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
