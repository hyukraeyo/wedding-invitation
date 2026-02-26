/**
 * 토스 앱인토스 환경 감지 유틸리티
 *
 * 토스 미니앱(앱인토스) 안에서 실행 중인지를 판별합니다.
 * 일반 웹 환경과 토스 웹뷰 환경에서 다른 UI를 제공하기 위해 사용됩니다.
 *
 * @example
 * ```tsx
 * import { isTossEnvironment } from '@/lib/toss';
 *
 * if (isTossEnvironment()) {
 *   // TDS 컴포넌트 사용
 * } else {
 *   // 기존 웹 UI 사용
 * }
 * ```
 */

/**
 * 현재 환경이 토스 앱인토스 웹뷰인지 판별합니다.
 *
 * 토스 웹뷰에서는 User-Agent에 'TOSS_WEBVIEW' 또는 'AppsInToss'가 포함되며,
 * window.__granite__ 글로벌 객체가 주입됩니다.
 */
export function isTossEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent;

  // 토스 WebView UA 식별자 체크
  if (ua.includes('TOSS_WEBVIEW') || ua.includes('AppsInToss')) {
    return true;
  }

  // granite SDK가 주입된 환경인지 체크
  if ('__granite__' in window) {
    return true;
  }

  return false;
}

/**
 * 서버/클라이언트 양쪽에서 안전하게 사용할 수 있는 환경 상수
 */
export const TOSS_APP_NAME = 'banana-wedding';
export const TOSS_DISPLAY_NAME = '바나나 웨딩';
export const TOSS_PRIMARY_COLOR = '#FBC02D';
