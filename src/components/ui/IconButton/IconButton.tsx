'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './IconButton.module.scss';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'clear' | 'fill' | 'primary';
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    iconSize?: number;
    // TDS compatibility props
    name?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ className, variant = 'clear', size = 'md', children, iconSize, name, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(s.iconButton, s[variant], s[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';

export { IconButton };
