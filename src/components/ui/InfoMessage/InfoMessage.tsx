import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './InfoMessage.module.scss';

interface InfoMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const InfoMessage = ({ children, className }: InfoMessageProps) => {
  return (
    <div className={cn(styles.container, className)} role="status" aria-live="polite">
      <Info className={styles.icon} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
