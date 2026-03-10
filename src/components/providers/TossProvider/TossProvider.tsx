'use client';

import { type ReactNode, useEffect } from 'react';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';

interface TossProviderProps {
  children: ReactNode;
}

/**
 * 토스 앱인토스 환경 보정 Provider.
 *
 * - 토스 환경: data-toss 속성 추가 (CSS에서 토스 환경 감지용)
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

  useEffect(() => {
    const root = document.documentElement;

    if (isToss) {
      root.setAttribute('data-toss', 'true');
      return () => {
        root.removeAttribute('data-toss');
      };
    }

    root.removeAttribute('data-toss');
    return undefined;
  }, [isToss]);

  return <>{children}</>;
}

TossProvider.displayName = 'TossProvider';
