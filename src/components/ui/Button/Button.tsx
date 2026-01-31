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
    variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'surface' | 'filled' | 'fill' | 'weak' | 'clear' | undefined;

    /** 
     * @default '2'
     * size 1 (xs) to 4 (xl) 
     */
    size?: '1' | '2' | '3' | '4' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'tiny' | 'medium' | 'large' | 'large_xl' | undefined;

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
            variant = 'solid',
            size = '2',
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
            (variant === 'ghost' || variant === 'clear') && s.ghost
        );

        // Mapping for size aliases
        const sizeClass = clsx(
            (size === '1' || size === 'xs' || size === 'tiny') && s.size_1,
            (size === '2' || size === 'sm' || size === 'md' || size === 'medium') && s.size_2,
            (size === '3' || size === 'lg' || size === 'large') && s.size_3,
            (size === '4' || size === 'xl' || size === 'large_xl') && s.size_4
        );

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
