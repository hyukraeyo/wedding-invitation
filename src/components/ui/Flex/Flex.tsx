
import React from 'react';
import { Box, BoxProps } from '../Box';
import { clsx } from 'clsx';
import styles from './Flex.module.scss';

export interface FlexProps extends BoxProps {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
    ({ direction = 'row', align = 'stretch', justify = 'start', wrap = 'nowrap', gap, className, ...props }, ref) => {
        const flexClasses = clsx(
            styles.Flex,
            styles[`direction-${direction}`],
            styles[`align-${align}`],
            styles[`justify-${justify}`],
            styles[`wrap-${wrap}`],
            gap && styles[`gap-${gap}`],
            className
        );

        return <Box ref={ref} display="flex" className={flexClasses} {...props} />;
    }
);

Flex.displayName = 'Flex';

export { Flex };
