'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { Banana } from 'lucide-react';
import s from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'blue' | 'hero' | 'unstyled' | 'dashed';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  asChild?: boolean;
  fluid?: boolean;
  fullWidth?: boolean;
  unstyled?: boolean;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'lg',
      isLoading: isLoadingProp = false,
      loading = false,
      asChild = false,
      fluid: fluidProp = false,
      fullWidth = false,
      unstyled = false,
      radius = 'md',
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const isLoading = isLoadingProp || loading;
    const fluid = fluidProp || fullWidth;

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          !unstyled && s.button,
          !unstyled && s[variant],
          !unstyled && s[size],
          fluid && s.fluid,
          unstyled && s.unstyled,
          radius === 'full' && s.radius_full,
          radius === 'none' && s.radius_none,
          radius === 'sm' && s.radius_sm,
          radius === 'md' && s.radius_md,
          radius === 'lg' && s.radius_lg,
          className
        )}
        type={type}
        {...props}
      >
        {isLoading && !unstyled && (
          <div className={s.loader}>
            <Banana className={s.spinner} size={18} />
          </div>
        )}
        <div className={clsx(s.content, isLoading && s.hidden, unstyled && s.unstyledContent)}>
          {leftIcon && <span className={s.icon}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={s.icon}>{rightIcon}</span>}
        </div>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
