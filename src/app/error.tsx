'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: '24px',
    fontFamily: 'Pretendard, -apple-system, sans-serif'
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center'
  };

  const iconBgStyle: React.CSSProperties = {
    backgroundColor: '#fff5f5',
    padding: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 8px 0'
  };

  const descStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#666',
    margin: 0,
    lineHeight: '1.5'
  };

  const errorBoxStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'left',
    fontSize: '13px'
  };

  const codeStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    color: '#888',
    margin: 0,
    wordBreak: 'break-all'
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: '#FBC02D',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'opacity 0.2s ease'
  };

  const outlineButtonStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    color: '#1a1a1a',
    border: '1px solid #e1e1e1',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconWrapperStyle}>
          <div style={iconBgStyle}>
            <AlertTriangle size={48} color="#ff4d4f" />
          </div>
        </div>

        <div>
          <h1 style={titleStyle}>문제가 발생했습니다</h1>
          <p style={descStyle}>잠시 후 다시 시도해 주세요.</p>
        </div>

        <div style={errorBoxStyle}>
          <p style={codeStyle}>{error.message || '알 수 없는 오류'}</p>
          {error.digest && <p style={{ ...codeStyle, marginTop: '8px', fontSize: '11px' }}>ID: {error.digest}</p>}
        </div>

        <div style={buttonGroupStyle}>
          <button style={primaryButtonStyle} onClick={() => reset()}>
            <RefreshCw size={18} />
            다시 시도
          </button>
          <button style={outlineButtonStyle} onClick={() => window.location.href = '/'}>
            <Home size={18} />
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
