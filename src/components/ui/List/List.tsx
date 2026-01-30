'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './List.module.scss';

export type ListProps = React.HTMLAttributes<HTMLDivElement>;

const List = React.forwardRef<HTMLDivElement, ListProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(s.list, className)}
                {...props}
            />
        );
    }
);

List.displayName = 'List';

export { List };
