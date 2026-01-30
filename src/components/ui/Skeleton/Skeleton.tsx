'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Skeleton.module.scss';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, width, height, circle, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(s.skeleton, circle && s.circle, className)}
                style={{
                    width,
                    height,
                    ...style,
                }}
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
