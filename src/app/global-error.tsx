'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { errorFallbackStyles } from './ErrorFallbackStyles';

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
        <div style={errorFallbackStyles.container}>
          <div style={errorFallbackStyles.card}>
            <div style={errorFallbackStyles.iconWrapper}>
              <div style={errorFallbackStyles.iconBg}>
                <AlertTriangle size={48} color="var(--color-error)" />
              </div>
            </div>

            <div>
              <h1 style={errorFallbackStyles.title}>치명적인 오류 발생</h1>
              <p style={errorFallbackStyles.description}>
                앱을 로드하는 중 심각한 문제가 발생했어요.
              </p>
            </div>

            <div style={errorFallbackStyles.errorBox}>
              <p style={errorFallbackStyles.code}>{error.message || 'Fatal Error'}</p>
            </div>

            <div style={errorFallbackStyles.buttonGroup}>
              <button style={errorFallbackStyles.primaryButton} onClick={() => reset()}>
                <RefreshCw size={18} />앱 다시 시작
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
