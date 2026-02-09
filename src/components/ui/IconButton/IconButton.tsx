'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './IconButton.module.scss';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'primary' | 'unstyled';
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  iconSize?: number;
  // TDS compatibility props
  name?: string;
  asChild?: boolean;
  unstyled?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      iconSize,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      name,
      asChild = false,
      unstyled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isUnstyled = variant === 'unstyled' || unstyled;
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={clsx(
          !isUnstyled && s.iconButton,
          !isUnstyled && s[variant],
          !isUnstyled && s[size],
          isUnstyled && s.unstyled,
          className
        )}
        type={type}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
