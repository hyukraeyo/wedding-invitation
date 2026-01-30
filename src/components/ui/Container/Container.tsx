
import React from 'react';
import { Box, BoxProps } from '../Box';
import { clsx } from 'clsx';
import styles from './Container.module.scss';

export interface ContainerProps extends BoxProps {
    size?: '1' | '2' | '3' | '4';
    align?: 'left' | 'center' | 'right';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ size = '4', align = 'center', className, ...props }, ref) => {
        const containerClasses = clsx(
            styles.Container,
            styles[`size-${size}`],
            styles[`align-${align}`],
            className
        );

        return <Box ref={ref} className={containerClasses} {...props} />;
    }
);

Container.displayName = 'Container';

export { Container };
