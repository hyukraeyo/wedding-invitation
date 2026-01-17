'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

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
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: '24px',
          fontFamily: 'Pretendard, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                backgroundColor: '#fff5f5',
                padding: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={48} color="#ff4d4f" />
              </div>
            </div>

            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>치명적인 오류 발생</h1>
              <p style={{
                fontSize: '15px',
                color: '#666',
                margin: 0,
                lineHeight: '1.5'
              }}>앱을 로드하는 중 심각한 문제가 발생했습니다.</p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '13px'
            }}>
              <p style={{
                fontFamily: 'monospace',
                color: '#888',
                margin: 0,
                wordBreak: 'break-all'
              }}>{error.message || 'Fatal Error'}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                style={{
                  backgroundColor: '#FBC02D',
                  color: '#000',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={18} />
                앱 다시 시작
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
