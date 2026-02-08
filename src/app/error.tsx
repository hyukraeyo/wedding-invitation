'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import styles from './error.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBg}>
            <AlertTriangle size={48} color="var(--color-error)" />
          </div>
        </div>

        <div>
          <h1 className={styles.title}>문제가 발생했어요</h1>
          <p className={styles.desc}>잠시 후 다시 시도해 주세요.</p>
        </div>

        <div className={styles.errorBox}>
          <p className={styles.code}>{error.message || '알 수 없는 오류'}</p>
          {error.digest && (
            <p className={styles.code} style={{ marginTop: '8px', fontSize: '11px' }}>
              ID: {error.digest}
            </p>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton} onClick={() => reset()}>
            <RefreshCw size={18} />
            다시 시도
          </button>
          <button className={styles.outlineButton} onClick={() => (window.location.href = '/')}>
            <Home size={18} />
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
