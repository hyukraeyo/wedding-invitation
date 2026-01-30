
import React from 'react';
import { Box, BoxProps } from '../Box';
import { clsx } from 'clsx';
import styles from './Section.module.scss';

export interface SectionProps extends BoxProps {
    size?: '1' | '2' | '3';
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
    ({ size = '3', className, ...props }, ref) => {
        const sectionClasses = clsx(
            styles.Section,
            styles[`size-${size}`],
            className
        );

        return <Box ref={ref} as="section" className={sectionClasses} {...props} />;
    }
);

Section.displayName = 'Section';

export { Section };
