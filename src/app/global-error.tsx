'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-6 rounded-full">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              치명적인 오류 발생
            </h1>
            <p className="text-muted-foreground">
              애플리케이션에서 심각한 오류가 발생했습니다.
              <br />
              개발팀에 문제를 보고하고 있습니다.
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
            <Button onClick={reset} variant="default" size="lg">
              <Home className="mr-2 h-5 w-5" />
              다시 시도
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
