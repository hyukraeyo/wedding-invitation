import { NextResponse } from 'next/server';

// 네이버 OAuth 설정
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get('redirect_uri') || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/naver/callback`;

    // CSRF 방지를 위한 state 생성
    const state = Math.random().toString(36).substring(2, 15);

    // 네이버 인증 URL 생성
    const authUrl = new URL(NAVER_AUTH_URL);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', NAVER_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);

    // state를 쿠키에 저장 (콜백에서 검증용)
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('naver_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10분
        path: '/',
    });

    return response;
}
