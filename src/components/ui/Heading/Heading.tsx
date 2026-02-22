'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './Heading.module.scss';

type HeadingAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';

export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  as?: HeadingAs;
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right';
  trim?: 'normal' | 'start' | 'end' | 'both';
  color?: 'primary' | 'secondary' | 'danger' | 'grey';
  highContrast?: boolean;
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLElement, HeadingProps>(
  (
    {
      className,
      as = 'h1',
      size = '6',
      weight = 'bold',
      align = 'left',
      trim = 'normal',
      color,
      highContrast = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = (asChild ? Slot : as) as React.ElementType;

    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={clsx(
          s.heading,
          s[`size_${size}`],
          s[`weight_${weight}`],
          s[`align_${align}`],
          trim !== 'normal' && s[`trim_${trim}`],
          color && s[color],
          highContrast && s.highContrast,
          className
        )}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
