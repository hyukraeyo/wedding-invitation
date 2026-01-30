
import React from 'react';
import { Box, BoxProps } from '../Box';
import { clsx } from 'clsx';
import styles from './Grid.module.scss';

export interface GridProps extends BoxProps {
    columns?: string;
    rows?: string;
    gap?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    gapX?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    gapY?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    areas?: string;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ columns, rows, gap, gapX, gapY, align, justify, areas, className, style, ...props }, ref) => {
        const gridClasses = clsx(
            styles.Grid,
            gap && styles[`gap-${gap}`],
            gapX && styles[`gapX-${gapX}`],
            gapY && styles[`gapY-${gapY}`],
            align && styles[`align-${align}`],
            justify && styles[`justify-${justify}`],
            className
        );

        const gridStyle: React.CSSProperties = {
            ...style,
            gridTemplateColumns: columns,
            gridTemplateRows: rows,
            gridTemplateAreas: areas,
        };

        return <Box ref={ref} display="grid" className={gridClasses} style={gridStyle} {...props} />;
    }
);

Grid.displayName = 'Grid';

export { Grid };
