'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './EditorForm.module.scss';

const EditorLoading = React.memo(function EditorLoading() {
  return (
    <div className={styles.loadingContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.skeletonItem}>
          <div className={styles.skeletonLeft}>
            <Skeleton className={styles.skeletonIcon ?? ''} />
            <div className={styles.skeletonText}>
              <Skeleton className={styles.skeletonTitle ?? ''} />
              <Skeleton className={styles.skeletonSubtitle ?? ''} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

EditorLoading.displayName = 'EditorLoading';

export { EditorLoading };
