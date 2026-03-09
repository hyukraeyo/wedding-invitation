'use client';

import { type ReactNode, useEffect } from 'react';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';

interface TossProviderProps {
  children: ReactNode;
}

/**
 * 토스 앱인토스 환경 보정 Provider.
 *
 * - 토스 환경: header-height를 0으로 설정 (토스 내비게이션 바가 대체)
 * - 토스 환경: data-toss 속성 추가 (CSS에서 토스 환경 감지용)
 * - TDSMobileAITProvider는 런타임 안정성 이슈로 현재 비활성화
 *
 * @example
 * ```tsx
 * // ClientProviders.tsx
 * <TossProvider>
 *   {children}
 * </TossProvider>
 * ```
 */
export function TossProvider({ children }: TossProviderProps) {
  const isToss = useTossEnvironment();

  // 토스 환경에서 CSS 변수 및 data 속성 조정
  useEffect(() => {
    if (!isToss) return;

    const root = document.documentElement;

    // 토스 내비게이션 바가 Header를 대체하므로 header-height를 0으로 설정
    root.style.setProperty('--header-height', '0px');

    // CSS에서 토스 환경을 감지할 수 있도록 data 속성 추가
    root.setAttribute('data-toss', 'true');

    return () => {
      root.style.removeProperty('--header-height');
      root.removeAttribute('data-toss');
    };
  }, [isToss]);

  return <>{children}</>;
}

TossProvider.displayName = 'TossProvider';
