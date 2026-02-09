'use client';

import React from 'react';
import styles from './SectionLoader.module.scss';

export interface SectionLoaderProps {
  /** 로딩 메시지 (기본: '로딩 중...') */
  message?: string;
  /** 컴포넌트 높이 (기본: 200px) */
  height?: number | string;
}

/**
 * 빌더 섹션 콘텐츠 로딩 시 표시되는 공통 로더
 * - 스피너 애니메이션과 선택적 메시지 표시
 * - dynamic import의 loading fallback으로 사용
 */
export const SectionLoader = React.memo(function SectionLoader({
  message,
  height = 200,
}: SectionLoaderProps) {
  return (
    <div
      className={styles.container}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className={styles.spinner} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
});

SectionLoader.displayName = 'SectionLoader';
