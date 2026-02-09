import * as React from 'react';
import styles from './RequiredSectionTitle.module.scss';

interface RequiredSectionTitleProps {
  title: string;
  isComplete: boolean;
}

export default function RequiredSectionTitle({ title, isComplete }: RequiredSectionTitleProps) {
  void isComplete;

  return (
    <span className={styles.wrapper}>
      <span className={styles.RequiredTitle}>{title}</span>
    </span>
  );
}
