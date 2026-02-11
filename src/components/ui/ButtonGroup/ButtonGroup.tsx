'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import styles from './ButtonGroup.module.scss';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ align = 'center', wrap = false, className, role, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={role ?? 'group'}
        className={clsx(
          styles.container,
          align === 'start' && styles.alignStart,
          align === 'center' && styles.alignCenter,
          align === 'end' && styles.alignEnd,
          align === 'stretch' && styles.alignStretch,
          wrap && styles.wrap,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
