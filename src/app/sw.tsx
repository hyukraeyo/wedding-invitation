'use client';

import { useEffect, useState } from 'react';
import styles from './sw.module.scss';

export default function ServiceWorkerRegistration() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {


            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed') {
                    setWaitingWorker(newWorker);
                  }
                });
              }
            });
          },
          () => {
            // Registration failed
          }
        );
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!waitingWorker) return null;

  return (
    <div className={styles.container}>
      <div className={styles.toast}>
        <div className={styles.content}>
          <p className={styles.title}>새 버전 사용 가능</p>
          <p className={styles.description}>업데이트를 적용하려면 클릭하세요</p>
        </div>
        <button
          onClick={handleUpdate}
          className={styles.updateButton}
        >
          업데이트
        </button>
      </div>
    </div>
  );
}

