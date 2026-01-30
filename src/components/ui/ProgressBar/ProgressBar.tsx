'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { clsx } from 'clsx';
import s from './ProgressBar.module.scss';

const ProgressBar = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={clsx(s.Root, className)}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className={s.Indicator}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
ProgressBar.displayName = ProgressPrimitive.Root.displayName;

export { ProgressBar };
