'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './Badge.module.scss';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: '1' | '2' | '3';
    variant?: 'solid' | 'soft' | 'surface' | 'outline';
    color?: 'primary' | 'secondary' | 'danger' | 'grey' | 'blue' | 'green' | 'red';
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
    highContrast?: boolean;
    asChild?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    (
        {
            className,
            size = '2',
            variant = 'soft',
            color = 'secondary',
            radius = 'medium',
            highContrast = false,
            asChild = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'span';

        return (
            <Comp
                ref={ref}
                className={clsx(
                    s.badge,
                    s[`size_${size}`],
                    s[variant],
                    s[color],
                    s[`radius_${radius}`],
                    highContrast && s.highContrast,
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
