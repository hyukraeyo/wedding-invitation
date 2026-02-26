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
export const TOSS_APP_NAME = 'bananawedding';
export const TOSS_DISPLAY_NAME = '바나나웨딩';
export const TOSS_PRIMARY_COLOR = '#FBC02D';

/**
 * 서버 전용: 토스 API 연동 유틸리티
 */
const TOSS_API_BASE_URL = 'https://apps-in-toss-api.toss.im/api-partner';

interface TossTokenResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    tokenType: 'Bearer';
  };
  error?: {
    errorCode: string;
    reason: string;
  };
}

interface TossUserResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    userKey: number;
    scope: string;
    name?: string; // Encrypted
    phone?: string; // Encrypted
    birthday?: string; // Encrypted
    ci?: string; // Encrypted
    gender?: string; // Encrypted
    email?: string | null;
  };
}

/**
 * 인가 코드를 토스 엑세스 토큰으로 교환합니다.
 */
export async function getTossAccessToken(authorizationCode: string, referrer: string) {
  const response = await fetch(`${TOSS_API_BASE_URL}/v1/apps-in-toss/user/oauth2/generate-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode, referrer }),
  });

  const data = (await response.json()) as TossTokenResponse;
  if (data.resultType === 'FAIL') {
    throw new Error(`Toss Token Exchange Failed: ${data.error?.reason}`);
  }
  return data.success!;
}

/**
 * 엑세스 토큰으로 토스 사용자 정보를 조회합니다.
 */
export async function getTossUserInfo(accessToken: string) {
  const response = await fetch(`${TOSS_API_BASE_URL}/v1/apps-in-toss/user/oauth2/login-me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as TossUserResponse;
  if (data.resultType === 'FAIL') {
    throw new Error('Toss User Info Fetch Failed');
  }
  return data.success!;
}

/**
 * 토스에서 받은 암호화된 개인정보를 복호화합니다.
 * 알고리즘: AES-256-GCM
 */
export function decryptTossData(encryptedData: string): string {
  const crypto = require('crypto');
  const secretKey = process.env.TOSS_SECRET_KEY; // Base64 encoded key
  const aad = process.env.TOSS_AAD || 'TOSS'; // 보통 'TOSS'

  if (!secretKey) throw new Error('TOSS_SECRET_KEY is missing');

  const keyBuffer = Buffer.from(secretKey, 'base64');
  const dataBuffer = Buffer.from(encryptedData, 'base64');

  // 데이터 구조: [IV(12 bytes)][Ciphertext][AuthTag(16 bytes)]
  const iv = dataBuffer.subarray(0, 12);
  const authTag = dataBuffer.subarray(dataBuffer.length - 16);
  const ciphertext = dataBuffer.subarray(12, dataBuffer.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(aad));

  let decrypted = decipher.update(ciphertext, 'binary', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
