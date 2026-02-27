import 'server-only';
import { createDecipheriv } from 'node:crypto';
import type { TossAuthReferrer } from '@/lib/toss';

const TOSS_API_BASE_URL = 'https://apps-in-toss-api.toss.im/api-partner';
const TOSS_API_TIMEOUT_MS = 10_000;

interface TossFailResponse {
  resultType: 'FAIL';
  error?: {
    errorCode?: string;
    reason?: string;
  };
}

interface TossTokenSuccessResponse {
  resultType: 'SUCCESS';
  success: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    tokenType: 'Bearer';
  };
}

interface TossUserSuccessResponse {
  resultType: 'SUCCESS';
  success: {
    userKey: number;
    scope: string;
    name?: string;
    phone?: string;
    birthday?: string;
    ci?: string;
    gender?: string;
    email?: string | null;
  };
}

type TossTokenResponse = TossTokenSuccessResponse | TossFailResponse;
type TossUserResponse = TossUserSuccessResponse | TossFailResponse;

async function parseTossJson<T>(response: Response, context: string): Promise<T> {
  const rawBody = await response.text();

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new Error(`[${context}] Unexpected JSON response (status=${response.status})`);
  }
}

function buildTossApiError(
  context: string,
  response: Response,
  failReason?: string,
  failCode?: string
): Error {
  const reasonText = failReason ?? 'Unknown reason';
  const codeText = failCode ? ` code=${failCode}` : '';
  return new Error(`[${context}] status=${response.status}${codeText} reason=${reasonText}`);
}

async function requestTossApi(context: string, path: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(`${TOSS_API_BASE_URL}${path}`, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(TOSS_API_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
      throw new Error(`[${context}] Request timed out after ${TOSS_API_TIMEOUT_MS}ms`);
    }
    throw error;
  }
}

export async function getTossAccessToken(authorizationCode: string, referrer: TossAuthReferrer) {
  const response = await requestTossApi(
    'TOSS_TOKEN_EXCHANGE',
    '/v1/apps-in-toss/user/oauth2/generate-token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ authorizationCode, referrer }),
    }
  );

  const data = await parseTossJson<TossTokenResponse>(response, 'TOSS_TOKEN_EXCHANGE');

  if (!response.ok || data.resultType === 'FAIL') {
    const failData = data as TossFailResponse;
    throw buildTossApiError(
      'TOSS_TOKEN_EXCHANGE',
      response,
      failData.error?.reason,
      failData.error?.errorCode
    );
  }

  if (typeof data.success?.accessToken !== 'string' || !data.success.accessToken) {
    throw new Error('[TOSS_TOKEN_EXCHANGE] Missing access token in success payload');
  }

  return data.success;
}

export async function getTossUserInfo(accessToken: string) {
  const response = await requestTossApi('TOSS_USER_INFO', '/v1/apps-in-toss/user/oauth2/login-me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const data = await parseTossJson<TossUserResponse>(response, 'TOSS_USER_INFO');

  if (!response.ok || data.resultType === 'FAIL') {
    const failData = data as TossFailResponse;
    throw buildTossApiError(
      'TOSS_USER_INFO',
      response,
      failData.error?.reason,
      failData.error?.errorCode
    );
  }

  if (typeof data.success?.userKey !== 'number') {
    throw new Error('[TOSS_USER_INFO] Missing userKey in success payload');
  }

  return data.success;
}

export function decryptTossData(encryptedData: string): string {
  const secretKey = process.env.TOSS_SECRET_KEY;
  const aad = process.env.TOSS_AAD || 'TOSS';

  if (!secretKey) throw new Error('TOSS_SECRET_KEY is missing');

  const keyBuffer = Buffer.from(secretKey, 'base64');
  if (keyBuffer.length !== 32) {
    throw new Error('TOSS_SECRET_KEY must be a 32-byte base64-encoded key');
  }

  const dataBuffer = Buffer.from(encryptedData, 'base64');
  if (dataBuffer.length < 28) {
    throw new Error('Invalid encrypted payload length');
  }

  const iv = dataBuffer.subarray(0, 12);
  const authTag = dataBuffer.subarray(dataBuffer.length - 16);
  const ciphertext = dataBuffer.subarray(12, dataBuffer.length - 16);

  const decipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(aad, 'utf8'));

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}
