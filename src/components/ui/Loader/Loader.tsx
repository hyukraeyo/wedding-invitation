'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Loader.module.scss';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    ({ className, size = 'md', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(s.loader, s[`size_${size}`], className)}
                {...props}
            >
                <div className={s.spinner} />
            </div>
        );
    }
);

Loader.displayName = 'Loader';

export { Loader };
