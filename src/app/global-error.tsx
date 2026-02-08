'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './error.module.scss';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <div className={styles.iconBg}>
                <AlertTriangle size={48} color="var(--color-error)" />
              </div>
            </div>

            <div>
              <h1 className={styles.title}>치명적인 오류 발생</h1>
              <p className={styles.desc}>앱을 로드하는 중 심각한 문제가 발생했어요.</p>
            </div>

            <div className={styles.errorBox}>
              <p className={styles.code}>{error.message || 'Fatal Error'}</p>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.primaryButton} onClick={() => reset()}>
                <RefreshCw size={18} />앱 다시 시작
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
