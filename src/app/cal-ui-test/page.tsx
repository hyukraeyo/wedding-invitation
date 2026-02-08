'use client';

import React from 'react';
import { DateTimeSelector } from '@/components/ui/DateTimeSelector';
import styles from './page.module.scss';

export default function CalUiTestPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>일정 선택</h1>
        <DateTimeSelector />
      </div>
    </div>
  );
}
