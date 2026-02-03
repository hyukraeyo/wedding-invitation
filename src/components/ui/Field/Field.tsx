'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './Field.module.scss';
import { Label } from '../Label';

export interface FieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string | boolean | undefined;
  disabled?: boolean | undefined;
}

const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(s.root, error && s.hasError, disabled && s.disabled, className)}
        {...props}
      />
    );
  }
);
FieldRoot.displayName = 'Field.Root';

export type FieldLabelProps = React.ComponentPropsWithoutRef<typeof Label>;

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    return <Label ref={ref} className={clsx(s.label, className)} {...props} />;
  }
);
FieldLabel.displayName = 'Field.Label';

export interface FieldHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean | undefined;
}

const FieldHelperText = React.forwardRef<HTMLParagraphElement, FieldHelperTextProps>(
  ({ className, error, ...props }, ref) => {
    if (!props.children) return null;
    return (
      <p
        ref={ref}
        className={clsx(s.helperText, error && s.error, className)}
        {...props}
      />
    );
  }
);
FieldHelperText.displayName = 'Field.HelperText';

export interface FieldCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  current: number;
  max: number;
}

const FieldCounter = React.forwardRef<HTMLSpanElement, FieldCounterProps>(
  ({ className, current, max, ...props }, ref) => {
    return (
      <span ref={ref} className={clsx(s.counter, className)} {...props}>
        {current} / {max}
      </span>
    );
  }
);
FieldCounter.displayName = 'Field.Counter';

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  HelperText: FieldHelperText,
  Counter: FieldCounter,
  Footer: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx(s.footer, className)}>{children}</div>
  ),
});
