type TossWindow = Window & {
  __granite__?: {
    app?: {
      scheme?: string;
    };
  };
  __granite?: {
    app?: {
      scheme?: string;
    };
  };
  __GRANITE_NATIVE_EMITTER?: {
    on?: unknown;
  };
  __CONSTANT_HANDLER_MAP?: Record<string, unknown>;
  ReactNativeWebView?: {
    postMessage?: unknown;
  };
};

type TossFrameworkModule = typeof import('@apps-in-toss/web-framework');

export type TossOperationalEnvironment = 'toss' | 'sandbox';
export type TossAuthReferrer = 'DEFAULT' | 'SANDBOX';

const TOSS_UA_IDENTIFIERS = ['TOSS_WEBVIEW', 'APPSINTOSS'];
const TOSS_ROOT_DATA_KEY = 'data-toss';
const TOSS_OPERATIONAL_ENVIRONMENT_KEY = 'getOperationalEnvironment';

let tossFrameworkPromise: Promise<TossFrameworkModule> | null = null;
let tossOperationalEnvironmentPromise: Promise<TossOperationalEnvironment | null> | null = null;

function hasTossUserAgentHint(userAgent: string): boolean {
  const normalizedUa = userAgent.toUpperCase();
  return TOSS_UA_IDENTIFIERS.some((identifier) => normalizedUa.includes(identifier));
}

function hasTossBridgeHint(win: TossWindow): boolean {
  const graniteApp = win.__granite__?.app ?? win.__granite?.app;
  if (graniteApp?.scheme === 'intoss') {
    return true;
  }

  const hasReactNativeWebView = typeof win.ReactNativeWebView?.postMessage === 'function';
  if (!hasReactNativeWebView) {
    return false;
  }

  const constantHandlerMap = win.__CONSTANT_HANDLER_MAP;
  if (!constantHandlerMap) {
    return false;
  }

  return TOSS_OPERATIONAL_ENVIRONMENT_KEY in constantHandlerMap;
}

function hasTossDocumentHint(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(TOSS_ROOT_DATA_KEY) === 'true';
}

function hasTossRuntimeHint(win: TossWindow, userAgent: string): boolean {
  if (hasTossDocumentHint()) return true;
  if (hasTossUserAgentHint(userAgent)) return true;
  return hasTossBridgeHint(win);
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

  return hasTossRuntimeHint(window as TossWindow, navigator.userAgent);
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
  const win = window as TossWindow;
  const runtimeHint = hasTossRuntimeHint(win, navigator.userAgent);

  if (!runtimeHint) {
    return null;
  }

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

      return hasTossRuntimeHint(win, navigator.userAgent) ? 'toss' : null;
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
