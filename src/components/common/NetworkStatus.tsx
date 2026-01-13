'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { WifiOff, RefreshCw } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('인터넷 연결되었습니다');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('인터넷 연결이 끊겼습니다. 오프라인 모드로 작동합니다.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2">
      {!isOnline ? (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">오프라인 모드</span>
        </div>
      ) : null}
    </div>
  );
}

export function ServiceWorkerUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
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
          <RefreshCw className="h-4 w-4" />
          업데이트
        </button>
      </div>
    </div>
  );
}
