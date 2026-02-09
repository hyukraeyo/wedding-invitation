'use client';

import * as React from 'react';
import { LucideIcon, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Placeholder.module.scss';

export interface PlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  text?: string;
  hasAspectRatio?: boolean;
}

export const Placeholder = React.forwardRef<HTMLDivElement, PlaceholderProps>(
  (
    {
      icon: Icon = ImageIcon,
      text = '이미지를 등록해 주세요',
      hasAspectRatio = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(styles.placeholder, hasAspectRatio && styles.aspectRatio, className)}
        {...props}
      >
        <div className={styles.icon} aria-hidden="true">
          <Icon />
        </div>
        {text && <div className={styles.text}>{text}</div>}
      </div>
    );
  }
);

Placeholder.displayName = 'Placeholder';
