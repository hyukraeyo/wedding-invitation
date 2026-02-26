'use client';

import { useState, useEffect } from 'react';
import { isTossEnvironment } from '@/lib/toss';

/**
 * 토스 앱인토스 환경 여부를 감지하는 React Hook
 *
 * SSR에서는 항상 false를 반환하고,
 * 클라이언트에서 마운트 후 실제 환경을 감지합니다.
 *
 * @example
 * ```tsx
 * const isToss = useTossEnvironment();
 *
 * return isToss ? <TDSButton>버튼</TDSButton> : <Button>버튼</Button>;
 * ```
 */
export function useTossEnvironment(): boolean {
  const [isToss, setIsToss] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsToss(isTossEnvironment());
  }, []);

  return isToss;
}
