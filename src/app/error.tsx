'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            문제가 발생했습니다
          </h1>
          <p className="text-muted-foreground">
            죄송합니다. 예상치 못한 오류가 발생했습니다.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg text-left text-sm">
          <p className="font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
