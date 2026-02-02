'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** 
     * @default 'primary'
     * Radix UI Themes style color 
     */
    color?: 'primary' | 'secondary' | 'danger' | 'grey' | undefined;

    /** 
     * @default 'solid'
     * Radix UI Themes style variants (with TDS aliases)
     */
    variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'surface' | 'filled' | 'fill' | 'weak' | 'clear' | 'apple' | 'toss' | undefined;

    /** 
     * @default 'md'
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;

    /** 
     * @default 'medium'
     */
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full' | undefined;

    /** 
     * Whether to use high contrast colors
     */
    highContrast?: boolean | undefined;

    /** 
     * Show loading spinner and disable interaction
     */
    loading?: boolean | undefined;

    fullWidth?: boolean | undefined;
    asChild?: boolean | undefined;
    leftIcon?: React.ReactNode | undefined;
    rightIcon?: React.ReactNode | undefined;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            color = 'primary',
            variant = 'toss',
            size = 'lg',
            radius,
            highContrast = false,
            loading = false,
            fullWidth = false,
            asChild = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';

        // Mapping for variant aliases to internal SCSS classes
        const variantClass = clsx(
            (variant === 'solid' || variant === 'filled' || variant === 'fill') && s.solid,
            (variant === 'soft' || variant === 'weak' || variant === 'surface') && s.soft,
            variant === 'outline' && s.outline,
            (variant === 'ghost' || variant === 'clear') && s.ghost,
            variant === 'apple' && s.apple,
            variant === 'toss' && s.toss
        );

        // Mapping for size aliases
        const sizeClass = s[size];

        return (
            <Comp
                className={clsx(
                    s.button,
                    s[color],
                    variantClass,
                    sizeClass,
                    radius && s[`radius_${radius}`],
                    highContrast && s.highContrast,
                    loading && s.isLoading,
                    fullWidth && s.fullWidth,
                    className
                )}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <span className={s.spinner} />}

                {/* Render icons only when not loading or maintain layout if needed */}
                {!loading && leftIcon && <span className={s.icon}>{leftIcon}</span>}

                {asChild ? children : <span>{children}</span>}

                {!loading && rightIcon && <span className={s.icon}>{rightIcon}</span>}
            </Comp>
        );
    }
);

Button.displayName = 'Button';

export { Button };
