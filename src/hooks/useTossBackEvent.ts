'use client';

import { useEffect, useCallback } from 'react';
import { loadTossWebFramework } from '@/lib/toss';
import { useTossEnvironment } from './useTossEnvironment';

/**
 * 토스 앱인토스 환경에서 뒤로가기 버튼 이벤트를 처리하는 Hook.
 *
 * 토스 웹뷰 안에서는 `graniteEvent.addEventListener('backEvent')`로 처리하고,
 * 일반 웹에서는 `popstate` 이벤트로 fallback 합니다.
 *
 * 비게임 검수 필수 항목: 뒤로가기 버튼 동작 처리
 *
 * @param handler - 뒤로가기 시 실행할 콜백. true를 반환하면 기본 동작 허용, false면 차단.
 * @param enabled - 핸들러 활성화 여부 (기본: true)
 *
 * @example
 * ```tsx
 * // 폼 작성 중 뒤로가기 확인
 * useTossBackEvent(() => {
 *   const shouldLeave = window.confirm('작성 중인 내용이 저장되지 않아요. 나가시겠어요?');
 *   return shouldLeave;
 * }, isDirty);
 * ```
 */
export function useTossBackEvent(handler: () => boolean | void, enabled: boolean = true) {
  const isToss = useTossEnvironment();

  const stableHandler = useCallback(() => handler(), [handler]);

  useEffect(() => {
    if (!enabled) return;

    if (isToss) {
      // 토스 웹뷰 환경: granite SDK의 backEvent 사용
      let unsubscribe: (() => void) | undefined;

      void loadTossWebFramework()
        .then(({ graniteEvent }) => {
          unsubscribe = graniteEvent.addEventListener('backEvent', {
            onEvent: () => {
              stableHandler();
            },
            onError: (error: unknown) => {
              console.error('[TossBackEvent] 에러:', error);
            },
          });
        })
        .catch((err) => {
          console.warn('[TossBackEvent] granite SDK 로드 실패:', err);
        });

      return () => {
        unsubscribe?.();
      };
    } else {
      // 일반 웹 환경: popstate로 fallback
      const handlePopState = () => {
        const shouldLeave = stableHandler();
        if (shouldLeave === false) {
          // 뒤로가기 차단: history를 다시 push
          window.history.pushState(null, '', window.location.href);
        }
      };

      // 현재 위치를 히스토리에 push (뒤로가기 감지용)
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isToss, enabled, stableHandler]);
}
