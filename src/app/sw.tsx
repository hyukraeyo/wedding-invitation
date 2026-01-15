'use client';

import { useEffect, useState } from 'react';

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
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium">새 버전 사용 가능</p>
          <p className="text-sm text-muted-foreground">업데이트를 적용하려면 클릭하세요</p>
        </div>
        <button
          onClick={handleUpdate}
          className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
        >
          업데이트
        </button>
      </div>
    </div>
  );
}

