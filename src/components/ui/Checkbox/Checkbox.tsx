'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import s from './Checkbox.module.scss';

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
    ({ className, ...props }, ref) => (
        <CheckboxPrimitive.Root
            ref={ref}
            className={clsx(s.root, className)}
            {...props}
        >
            <CheckboxPrimitive.Indicator className={s.indicator}>
                <Check size={16} strokeWidth={3} />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
