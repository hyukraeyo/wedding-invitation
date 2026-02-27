type TossWindow = Window & {
  __granite__?: unknown;
  __granite?: unknown;
  __GRANITE_NATIVE_EMITTER?: unknown;
};

type TossFrameworkModule = typeof import('@apps-in-toss/web-framework');

export type TossOperationalEnvironment = 'toss' | 'sandbox';
export type TossAuthReferrer = 'DEFAULT' | 'SANDBOX';

const TOSS_UA_IDENTIFIERS = ['TOSS_WEBVIEW', 'APPSINTOSS'];
const TOSS_ROOT_DATA_KEY = 'data-toss';

let tossFrameworkPromise: Promise<TossFrameworkModule> | null = null;
let tossOperationalEnvironmentPromise: Promise<TossOperationalEnvironment | null> | null = null;

function hasTossUserAgentHint(userAgent: string): boolean {
  const normalizedUa = userAgent.toUpperCase();
  return TOSS_UA_IDENTIFIERS.some((identifier) => normalizedUa.includes(identifier));
}

function hasTossBridgeHint(win: TossWindow): boolean {
  return '__granite__' in win || '__granite' in win || '__GRANITE_NATIVE_EMITTER' in win;
}

function hasTossDocumentHint(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(TOSS_ROOT_DATA_KEY) === 'true';
}

/**
 * 현재 환경이 토스 앱인토스 웹뷰인지 판별합니다.
 *
 * 1) 문서 루트 data 속성
 * 2) User-Agent 힌트
 * 3) granite bridge 글로벌 객체
 *
 * 순서로 판별합니다.
 */
export function isTossEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  if (hasTossDocumentHint()) return true;
  if (hasTossUserAgentHint(navigator.userAgent)) return true;
  return hasTossBridgeHint(window as TossWindow);
}

/**
 * 토스 SDK 모듈을 지연 로드합니다.
 * 여러 컴포넌트에서 호출되어도 1회 로드만 수행합니다.
 */
export async function loadTossWebFramework(): Promise<TossFrameworkModule> {
  if (!tossFrameworkPromise) {
    tossFrameworkPromise = import('@apps-in-toss/web-framework');
  }
  return tossFrameworkPromise;
}

export function isTossAuthReferrer(value: string): value is TossAuthReferrer {
  return value === 'DEFAULT' || value === 'SANDBOX';
}

/**
 * 공식 브릿지 API(getOperationalEnvironment) 우선으로 환경을 확인하고,
 * 실패 시 힌트 기반 감지로 fallback 합니다.
 */
export async function getTossOperationalEnvironment(): Promise<TossOperationalEnvironment | null> {
  if (typeof window === 'undefined') return null;

  if (!tossOperationalEnvironmentPromise) {
    tossOperationalEnvironmentPromise = (async () => {
      try {
        const { getOperationalEnvironment } = await loadTossWebFramework();
        const environment = getOperationalEnvironment();
        if (environment === 'toss' || environment === 'sandbox') {
          return environment;
        }
      } catch {
        // no-op: 공식 브릿지 감지가 불가능한 일반 웹 환경에서는 fallback 감지를 사용합니다.
      }

      return isTossEnvironment() ? 'toss' : null;
    })();
  }

  return tossOperationalEnvironmentPromise;
}

/**
 * 서버/클라이언트 양쪽에서 안전하게 사용할 수 있는 환경 상수
 */
export const TOSS_APP_NAME = 'bananawedding';
export const TOSS_DISPLAY_NAME = '바나나웨딩';
export const TOSS_PRIMARY_COLOR = '#FBC02D';
