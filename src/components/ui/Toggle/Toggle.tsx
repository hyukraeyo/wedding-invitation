'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { clsx } from 'clsx';
import s from './Toggle.module.scss';

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  variant?: 'solid' | 'outline' | 'ghost' | 'primary' | 'unstyled';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  accentColorOnly?: boolean;
  unstyled?: boolean;
}

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      accentColorOnly,
      unstyled: unstyledProp = false,
      ...props
    },
    ref
  ) => {
    const isUnstyled = unstyledProp || variant === 'unstyled';

    return (
      <TogglePrimitive.Root
        ref={ref}
        className={clsx(
          !isUnstyled && s.root,
          !isUnstyled && s[variant],
          !isUnstyled && s[size],
          isUnstyled && s.unstyled,
          accentColorOnly && s.accentColorOnly,
          className
        )}
        {...props}
      />
    );
  }
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
