'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { clsx } from 'clsx';
import s from './Toggle.module.scss';

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  variant?: 'solid' | 'outline' | 'ghost' | 'toss';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant = 'toss', size = 'md', ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={clsx(s.root, s[variant], s[size], className)}
      {...props}
    />
  )
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
