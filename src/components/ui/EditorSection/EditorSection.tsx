'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './EditorSection.module.scss';

export interface EditorSectionProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
  isInvalid?: boolean;
}

const EditorSection = React.forwardRef<HTMLElement, EditorSectionProps>(
  ({ title, children, className, rightElement, isInvalid }, ref) => {
    return (
      <section ref={ref} className={clsx(s.Root, className, isInvalid && s.Invalid)}>
        {title && (
          <div className={s.Header}>
            <div className={s.Title}>{title}</div>
            {rightElement && <div className={s.RightElement}>{rightElement}</div>}
          </div>
        )}
        <div className={s.Content}>{children}</div>
      </section>
    );
  }
);

EditorSection.displayName = 'EditorSection';

export { EditorSection };
