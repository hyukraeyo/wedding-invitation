'use client';

import * as React from 'react';
import styles from './NotificationToggleButton.module.scss';

type NotificationToggleButtonProps = React.ComponentProps<'button'>;

export function NotificationToggleButton({
  className,
  children,
  ...props
}: NotificationToggleButtonProps) {
  return (
    <button className={className ? `${styles.button} ${className}` : styles.button} {...props}>
      {children}
    </button>
  );
}
