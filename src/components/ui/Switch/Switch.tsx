'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { clsx } from 'clsx';
import s from './Switch.module.scss';

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
        className={clsx(s.root, className)}
        {...props}
        ref={ref}
    >
        <SwitchPrimitive.Thumb className={clsx(s.thumb)} />
    </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
