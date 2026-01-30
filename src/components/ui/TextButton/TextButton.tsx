'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './TextButton.module.scss';

export interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'blue' | 'grey';
    underline?: boolean;
}

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
    ({ className, color = 'grey', underline = false, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(s.textButton, s[color], underline && s.underline, className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

TextButton.displayName = 'TextButton';

export { TextButton };
