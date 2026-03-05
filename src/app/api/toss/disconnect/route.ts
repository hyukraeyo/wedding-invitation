import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * 토스 로그인 연결 끊기 콜백 API
 *
 * 사용자가 토스앱에서 로그인 연결을 해제하면,
 * 토스가 이 URL로 콜백을 보내요.
 *
 * referrer 값으로 해제 경로를 구분할 수 있어요:
 * - UNLINK: 사용자가 직접 연결 해제
 * - WITHDRAWAL_TERMS: 약관 철회로 인한 해제
 * - WITHDRAWAL_TOSS: 토스 탈퇴로 인한 해제
 *
 * 콘솔 등록 URL: https://banana-wedding.vercel.app/api/toss/disconnect
 */

interface TossDisconnectPayload {
  userKey: number;
  referrer: 'UNLINK' | 'WITHDRAWAL_TERMS' | 'WITHDRAWAL_TOSS';
}

// Basic Auth 검증
function verifyBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return false;

  const expectedAuth = process.env.TOSS_DISCONNECT_BASIC_AUTH;
  if (!expectedAuth) {
    console.warn('[TOSS_DISCONNECT] TOSS_DISCONNECT_BASIC_AUTH not configured');
    return false;
  }

  const receivedCredentials = authHeader.slice(6); // "Basic " 이후
  return receivedCredentials === expectedAuth;
}

export async function GET(request: NextRequest) {
  return handleDisconnect(request);
}

export async function POST(request: NextRequest) {
  return handleDisconnect(request);
}

async function handleDisconnect(request: NextRequest): Promise<NextResponse> {
  // Basic Auth 검증
  if (!verifyBasicAuth(request)) {
    console.warn('[TOSS_DISCONNECT] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let payload: TossDisconnectPayload;

    if (request.method === 'GET') {
      const userKey = request.nextUrl.searchParams.get('userKey');
      const referrer = request.nextUrl.searchParams.get('referrer');

      if (!userKey || !referrer) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      payload = {
        userKey: Number(userKey),
        referrer: referrer as TossDisconnectPayload['referrer'],
      };
    } else {
      payload = (await request.json()) as TossDisconnectPayload;
    }

    console.log('[TOSS_DISCONNECT] Received callback:', {
      userKey: payload.userKey,
      referrer: payload.referrer,
    });

    if (!payload.userKey) {
      return NextResponse.json({ error: 'Invalid userKey' }, { status: 400 });
    }

    const publicClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: 'public' },
    });

    const nextAuthClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: 'next_auth' },
    });

    const tossEmail = `${payload.userKey}@toss.user`;

    // next_auth.users에서 토스 사용자 찾기
    const { data: user } = await nextAuthClient
      .from('users')
      .select('id')
      .eq('email', tossEmail)
      .maybeSingle();

    if (!user) {
      console.log('[TOSS_DISCONNECT] User not found for userKey:', payload.userKey);
      return NextResponse.json({ result: 'ok', message: 'User not found' });
    }

    // 세션 삭제 (로그아웃 처리)
    await nextAuthClient.from('sessions').delete().eq('userId', user.id);

    // 프로필에 연결 해제 표시
    await publicClient
      .from('profiles')
      .update({
        toss_disconnected_at: new Date().toISOString(),
        toss_disconnect_referrer: payload.referrer,
      })
      .eq('id', user.id);

    console.log('[TOSS_DISCONNECT] Successfully processed for user:', user.id);

    return NextResponse.json({ result: 'ok' });
  } catch (error) {
    console.error('[TOSS_DISCONNECT] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
