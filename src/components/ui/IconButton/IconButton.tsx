'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './IconButton.module.scss';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'clear' | 'fill' | 'primary';
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    iconSize?: number;
    // TDS compatibility props
    name?: string;
    asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ className, variant = 'clear', size = 'md', children, iconSize, name, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                ref={ref}
                className={clsx(s.iconButton, s[variant], s[size], className)}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);

IconButton.displayName = 'IconButton';

export { IconButton };
