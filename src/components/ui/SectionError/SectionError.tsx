'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './SectionError.module.scss';

export interface SectionErrorProps {
  /** 에러 메시지 */
  message?: string;
  /** 재시도 버튼 클릭 핸들러 */
  onRetry?: () => void;
  /** 컴포넌트 높이 */
  height?: number | string;
}

/**
 * 빌더나 마이페이지 등 섹션 단위에서 에러 발생 시 표시되는 공통 UI
 */
export const SectionError = React.memo(function SectionError({
  message = '데이터를 불러오는 중 오류가 발생했습니다.',
  onRetry,
  height = 200,
}: SectionErrorProps) {
  return (
    <div
      className={styles.container}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <AlertCircle className={styles.icon} size={32} />
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className={styles.retryButton}>
          <RefreshCw size={14} className={styles.retryIcon} />
          다시 시도
        </Button>
      )}
    </div>
  );
});

SectionError.displayName = 'SectionError';
