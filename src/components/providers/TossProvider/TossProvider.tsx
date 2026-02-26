'use client';

import { type ReactNode, lazy, Suspense, useEffect } from 'react';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';

/**
 * TDSMobileAITProvider를 lazy-load 합니다.
 * 토스 환경이 아닌 경우에는 TDS 패키지를 로드하지 않아
 * 일반 웹 환경의 번들 크기에 영향을 주지 않습니다.
 *
 * @note TDS는 로컬 브라우저에서 동작하지 않으므로,
 * 샌드박스 앱을 통한 테스트가 필요합니다.
 */
const TDSMobileAITProvider = lazy(() =>
  import('@toss/tds-mobile-ait').then((mod) => ({
    default: mod.TDSMobileAITProvider,
  }))
);

interface TossProviderProps {
  children: ReactNode;
}

/**
 * 토스 앱인토스 환경에서만 TDS Provider를 래핑하는 조건부 Provider.
 *
 * - 토스 환경: TDSMobileAITProvider로 감싸서 TDS 컴포넌트가 동작하도록 함
 * - 토스 환경: header-height를 0으로 설정 (토스 내비게이션 바가 대체)
 * - 토스 환경: data-toss 속성 추가 (CSS에서 토스 환경 감지용)
 * - 일반 웹: 기존 UI를 그대로 사용 (TDS 패키지 로드 안 함)
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

  if (!isToss) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <TDSMobileAITProvider>{children}</TDSMobileAITProvider>
    </Suspense>
  );
}

TossProvider.displayName = 'TossProvider';
