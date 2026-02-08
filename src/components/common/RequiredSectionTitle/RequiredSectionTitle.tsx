import * as React from 'react';
import { Badge } from '@/components/ui/Badge';
import styles from './RequiredSectionTitle.module.scss';

interface RequiredSectionTitleProps {
  title: string;
  isComplete: boolean;
}

export default function RequiredSectionTitle({ title, isComplete }: RequiredSectionTitleProps) {
  return (
    <span className={styles.wrapper}>
      <span className={styles.RequiredTitle}>{title}</span>
      {!isComplete ? (
        <Badge size="xs" variant="soft" color="red">
          필수
        </Badge>
      ) : null}
    </span>
  );
}
