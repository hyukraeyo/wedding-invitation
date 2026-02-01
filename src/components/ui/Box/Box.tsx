import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import styles from './Box.module.scss';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    as?: React.ElementType;
    p?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    px?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    py?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    pt?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    pr?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    pb?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    pl?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    m?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    mx?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    my?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    mt?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    mr?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    mb?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    ml?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    display?: 'none' | 'inline' | 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid';
    width?: string;
    height?: string;
    flexGrow?: string | number;
    flexShrink?: string | number;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
    (
        {
            asChild,
            as: Tag = 'div',
            className,
            p,
            px,
            py,
            pt,
            pr,
            pb,
            pl,
            m,
            mx,
            my,
            mt,
            mr,
            mb,
            ml,
            display,
            width,
            height,
            flexGrow,
            flexShrink,
            style,
            ...props
        },
        ref
    ) => {
        const Component = asChild ? Slot : Tag;

        const boxClasses = clsx(
            styles.Box,
            p && styles[`p-${p}`],
            px && styles[`px-${px}`],
            py && styles[`py-${py}`],
            pt && styles[`pt-${pt}`],
            pr && styles[`pr-${pr}`],
            pb && styles[`pb-${pb}`],
            pl && styles[`pl-${pl}`],
            m && styles[`m-${m}`],
            mx && styles[`mx-${mx}`],
            my && styles[`my-${my}`],
            mt && styles[`mt-${mt}`],
            mr && styles[`mr-${mr}`],
            mb && styles[`mb-${mb}`],
            ml && styles[`ml-${ml}`],
            display && styles[`display-${display}`],
            className
        );

        const boxStyle: React.CSSProperties = {
            ...style,
            width,
            height,
            flexGrow,
            flexShrink,
        };

        return (
            <Component ref={ref} className={boxClasses} style={boxStyle} {...props} />
        );
    }
);

Box.displayName = 'Box';

export { Box };
