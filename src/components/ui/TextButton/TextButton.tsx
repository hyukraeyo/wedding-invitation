'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './TextButton.module.scss';

export interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'blue' | 'grey';
  underline?: boolean;
  asChild?: boolean;
}

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className, color = 'grey', underline = false, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={clsx(s.textButton, s[color], underline && s.underline, className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

TextButton.displayName = 'TextButton';

export { TextButton };
