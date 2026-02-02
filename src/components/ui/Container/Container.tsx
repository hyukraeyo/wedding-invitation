
import React from 'react';
import { clsx } from 'clsx';
import styles from './Container.module.scss';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
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

        return <div ref={ref} className={containerClasses} {...props} />;
    }
);

Container.displayName = 'Container';

export { Container };
