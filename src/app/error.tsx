'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { errorFallbackStyles } from './ErrorFallbackStyles';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div style={errorFallbackStyles.container}>
      <div style={errorFallbackStyles.card}>
        <div style={errorFallbackStyles.iconWrapper}>
          <div style={errorFallbackStyles.iconBg}>
            <AlertTriangle size={48} color="var(--color-error)" />
          </div>
        </div>

        <div>
          <h1 style={errorFallbackStyles.title}>문제가 발생했어요</h1>
          <p style={errorFallbackStyles.description}>잠시 후 다시 시도해 주세요.</p>
        </div>

        <div style={errorFallbackStyles.errorBox}>
          <p style={errorFallbackStyles.code}>{error.message || '알 수 없는 오류'}</p>
          {error.digest && (
            <p style={{ ...errorFallbackStyles.code, ...errorFallbackStyles.digest }}>
              ID: {error.digest}
            </p>
          )}
        </div>

        <div style={errorFallbackStyles.buttonGroup}>
          <button style={errorFallbackStyles.primaryButton} onClick={() => reset()}>
            <RefreshCw size={18} />
            다시 시도
          </button>
          <button
            style={errorFallbackStyles.outlineButton}
            onClick={() => (window.location.href = '/')}
          >
            <Home size={18} />
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
