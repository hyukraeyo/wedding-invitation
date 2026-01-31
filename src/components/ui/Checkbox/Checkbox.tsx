'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import s from './Checkbox.module.scss';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    variant?: 'circle' | 'line';
    label?: React.ReactNode;
}

const CheckboxBase = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
    ({ className, variant = 'line', label, id, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className={s.container}>
                <CheckboxPrimitive.Root
                    ref={ref}
                    id={inputId}
                    className={clsx(s.root, s[variant], className)}
                    {...props}
                >
                    <CheckboxPrimitive.Indicator className={s.indicator}>
                        <Check size={variant === 'circle' ? 14 : 16} strokeWidth={3} />
                    </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                {label && (
                    <label htmlFor={inputId} className={clsx(s.label, props.disabled && s.disabled)}>
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

CheckboxBase.displayName = 'Checkbox';

const CheckboxCircle = (props: CheckboxProps) => <CheckboxBase {...props} variant="circle" />;
CheckboxCircle.displayName = 'Checkbox.Circle';

const CheckboxLine = (props: CheckboxProps) => <CheckboxBase {...props} variant="line" />;
CheckboxLine.displayName = 'Checkbox.Line';

const Checkbox = Object.assign(CheckboxBase, {
    Circle: CheckboxCircle,
    Line: CheckboxLine,
});

export { Checkbox };
