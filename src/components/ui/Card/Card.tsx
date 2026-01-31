'use client';

import React from 'react';
import { Box, BoxProps } from '../Box';
import { clsx } from 'clsx';
import styles from './Card.module.scss';

export interface CardProps extends BoxProps {
    variant?: 'ghost' | 'surface' | 'classic' | 'box';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'surface', className, ...props }, ref) => {
        return (
            <Box
                ref={ref}
                className={clsx(styles.root, styles[variant], className)}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

export { Card };
