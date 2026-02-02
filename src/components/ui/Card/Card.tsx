'use client';

import React from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.scss';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'ghost' | 'surface' | 'classic' | 'box';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'surface', className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(styles.root, styles[variant], className)}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

export { Card };
