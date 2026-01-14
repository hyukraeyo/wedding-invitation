import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 네이버 OAuth 설정
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_PROFILE_URL = 'https://openapi.naver.com/v1/nid/me';

// Supabase Admin 클라이언트
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

interface NaverTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    error?: string;
    error_description?: string;
}

interface NaverProfileResponse {
    resultcode: string;
    message: string;
    response: {
        id: string;
        nickname?: string;
        name?: string;
        email?: string;
        profile_image?: string;
        mobile?: string;
        mobile_e164?: string;
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 에러 처리
    if (error) {
        console.error('Naver OAuth error:', error, searchParams.get('error_description'));
        return NextResponse.redirect(`${redirectUrl}/login?error=naver_auth_failed`);
    }

    if (!code) {
        return NextResponse.redirect(`${redirectUrl}/login?error=no_code`);
    }

    // State 검증 (CSRF 방지)
    const cookies = request.headers.get('cookie') || '';
    const stateCookie = cookies.split(';').find(c => c.trim().startsWith('naver_oauth_state='));
    const savedState = stateCookie?.split('=')[1];

    if (state !== savedState) {
        console.error('State mismatch:', { received: state, saved: savedState });
        return NextResponse.redirect(`${redirectUrl}/login?error=invalid_state`);
    }

    try {
        // 1. Access Token 요청
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: NAVER_CLIENT_ID,
            client_secret: NAVER_CLIENT_SECRET,
            code,
            state: state || '',
        });

        const tokenResponse = await fetch(`${NAVER_TOKEN_URL}?${tokenParams}`, {
            method: 'GET',
        });

        const tokenData: NaverTokenResponse = await tokenResponse.json();

        if (tokenData.error) {
            console.error('Naver token error:', tokenData.error, tokenData.error_description);
            return NextResponse.redirect(`${redirectUrl}/login?error=token_failed`);
        }

        // 2. 사용자 프로필 요청
        const profileResponse = await fetch(NAVER_PROFILE_URL, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const profileData: NaverProfileResponse = await profileResponse.json();

        if (profileData.resultcode !== '00') {
            console.error('Naver profile error:', profileData.message);
            return NextResponse.redirect(`${redirectUrl}/login?error=profile_failed`);
        }

        const naverUser = profileData.response;
        const userEmail = naverUser.email || `naver_${naverUser.id}@naver.local`;

        // 3. Supabase에서 기존 사용자 확인
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(
            (u) => u.email === userEmail || u.user_metadata?.naver_id === naverUser.id
        );

        let userId: string;

        if (existingUser) {
            // 기존 사용자 로그인
            userId = existingUser.id;

            // 매직링크 없이 세션 생성 (Admin API 사용)
            const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'magiclink',
                email: userEmail,
                options: {
                    redirectTo: redirectUrl,
                },
            });

            if (sessionError) {
                console.error('Session generation error:', sessionError);
                // 폴백: 사용자 정보만 업데이트하고 리다이렉트
                await supabaseAdmin.auth.admin.updateUserById(userId, {
                    user_metadata: {
                        ...existingUser.user_metadata,
                        naver_id: naverUser.id,
                        full_name: naverUser.name || naverUser.nickname,
                        avatar_url: naverUser.profile_image,
                        phone: naverUser.mobile,
                    },
                });
            }
        } else {
            // 새 사용자 생성
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: userEmail,
                email_confirm: true, // 이메일 확인 건너뛰기
                user_metadata: {
                    naver_id: naverUser.id,
                    full_name: naverUser.name || naverUser.nickname,
                    avatar_url: naverUser.profile_image,
                    phone: naverUser.mobile,
                    provider: 'naver',
                },
            });

            if (createError) {
                console.error('User creation error:', createError);
                return NextResponse.redirect(`${redirectUrl}/login?error=user_creation_failed`);
            }

            userId = newUser.user!.id;

            // 프로필 테이블에도 추가
            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                full_name: naverUser.name || naverUser.nickname,
                phone: naverUser.mobile?.replace(/-/g, ''),
                avatar_url: naverUser.profile_image,
                is_profile_complete: !!(naverUser.name && naverUser.mobile),
            });
        }

        // 4. 세션 토큰 생성 및 리다이렉트
        // Admin API로 직접 세션 생성
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userEmail,
        });

        if (signInError || !signInData?.properties?.hashed_token) {
            console.error('Sign in link error:', signInError);
            // 폴백: 그냥 빌더로 이동 (클라이언트에서 세션 확인 필요)
            return NextResponse.redirect(`${redirectUrl}/builder?naver_login=success&user_id=${userId}`);
        }

        // 토큰으로 리다이렉트 (Supabase가 자동으로 세션 생성)
        const response = NextResponse.redirect(
            `${redirectUrl}/api/auth/naver/session?token=${signInData.properties.hashed_token}&email=${encodeURIComponent(userEmail)}`
        );

        // State 쿠키 삭제
        response.cookies.delete('naver_oauth_state');

        return response;
    } catch (error) {
        console.error('Naver OAuth callback error:', error);
        return NextResponse.redirect(`${redirectUrl}/login?error=server_error`);
    }
}
