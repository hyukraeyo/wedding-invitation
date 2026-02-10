'use client';

import * as React from 'react';
import { IconButton } from '@/components/ui/IconButton';
import styles from './NotificationToggleButton.module.scss';

type NotificationToggleButtonProps = Omit<
  React.ComponentProps<typeof IconButton>,
  'variant' | 'name'
>;

export function NotificationToggleButton({
  className,
  children,
  ...props
}: NotificationToggleButtonProps) {
  return (
    <IconButton
      variant="unstyled"
      name=""
      className={className ? `${styles.button} ${className}` : styles.button}
      {...props}
    >
      {children}
    </IconButton>
  );
}
