'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import s from './Text.module.scss';

type TextAs =
  | 'span'
  | 'div'
  | 'p'
  | 'label'
  | 'strong'
  | 'em'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  typography?: 't1' | 't2' | 't3' | 't4' | 't5' | 't6' | 't7';
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  trim?: 'normal' | 'start' | 'end' | 'both';
  color?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'grey' | 'white' | string;
  highContrast?: boolean;
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      as = 'span',
      size,
      typography,
      fontWeight = 'regular',
      align = 'left',
      trim = 'normal',
      color,
      highContrast = false,
      asChild = false,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = (asChild ? Slot : as) as React.ElementType;

    // If color is a hex/rgb string (not a predefined key), apply it via style
    const isPredefinedColor =
      color &&
      (s[color] || ['primary', 'secondary', 'tertiary', 'danger', 'grey', 'white'].includes(color));
    const customStyle = !isPredefinedColor && color ? { color, ...style } : style;

    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        style={customStyle}
        className={clsx(
          s.text,
          size && s[`size_${size}`],
          typography && s[`typography_${typography}`],
          fontWeight && s[`weight_${fontWeight}`],
          align && s[`align_${align}`],
          trim !== 'normal' && s[`trim_${trim}`],
          isPredefinedColor && s[color as keyof typeof s],
          highContrast && s.highContrast,
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };
