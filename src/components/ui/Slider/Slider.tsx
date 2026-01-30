'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { clsx } from 'clsx';
import s from './Slider.module.scss';

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={clsx(s.root, className)}
        {...props}
    >
        <SliderPrimitive.Track className={s.track}>
            <SliderPrimitive.Range className={s.range} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={s.thumb} aria-label="Volume" />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
