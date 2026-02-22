'use client';

import { useEffect } from 'react';
import { suppressReact19Warnings } from '@/lib/suppressWarnings';

/**
 * React 19 관련 경고를 억제하는 Provider 컴포넌트
 * 앱 최상단에서 한 번만 실행됩니다.
 */
export function WarningSuppressionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    suppressReact19Warnings();
  }, []);

  return <>{children}</>;
}
