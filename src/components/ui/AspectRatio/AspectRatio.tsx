'use client';

import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import styles from './AspectRatio.module.scss';
import clsx from 'clsx';

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
    className?: string | undefined;
}

const AspectRatio = React.forwardRef<
    React.ElementRef<typeof AspectRatioPrimitive.Root>,
    AspectRatioProps
>(({ className, ...props }, ref) => (
    <AspectRatioPrimitive.Root
        ref={ref}
        className={clsx(styles.root, className)}
        {...props}
    />
));

AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };
