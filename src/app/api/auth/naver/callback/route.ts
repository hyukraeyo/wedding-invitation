import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';

// 네이버 OAuth 설정
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_PROFILE_URL = 'https://openapi.naver.com/v1/nid/me';


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

const reportAuthError = (message: string, context?: Record<string, unknown>, error?: unknown) => {
    if (error) {
        console.error(message, error);
    } else {
        console.error(message);
    }

    Sentry.withScope((scope) => {
        if (context) {
            scope.setContext('naver_oauth', context);
        }
        if (error instanceof Error) {
            Sentry.captureException(error);
            return;
        }
        Sentry.captureMessage(message);
    });
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !supabaseAdmin) {
        reportAuthError('Naver OAuth server misconfiguration', {
            hasClientId: !!NAVER_CLIENT_ID,
            hasClientSecret: !!NAVER_CLIENT_SECRET,
            hasAdminClient: !!supabaseAdmin,
        });
        return NextResponse.redirect(`${redirectUrl}/login?error=server_misconfig`);
    }

    const adminClient = supabaseAdmin;

    const redirectWithStateCleanup = (url: string) => {
        const response = NextResponse.redirect(url);
        response.cookies.delete('naver_oauth_state');
        return response;
    };

    // 에러 처리
    if (error) {
        reportAuthError('Naver OAuth error', {
            error,
            description: searchParams.get('error_description'),
        });
        return redirectWithStateCleanup(`${redirectUrl}/login?error=naver_auth_failed`);
    }

    if (!code) {
        return redirectWithStateCleanup(`${redirectUrl}/login?error=no_code`);
    }

    // State 검증 (CSRF 방지)
    const savedState = request.cookies.get('naver_oauth_state')?.value;

    if (!state || !savedState || state !== savedState) {
        reportAuthError('Naver OAuth state mismatch', { received: state, saved: savedState });
        return redirectWithStateCleanup(`${redirectUrl}/login?error=invalid_state`);
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

        if (!tokenResponse.ok || tokenData.error) {
            reportAuthError('Naver token error', {
                error: tokenData.error,
                description: tokenData.error_description,
                status: tokenResponse.status,
            });
            return redirectWithStateCleanup(`${redirectUrl}/login?error=token_failed`);
        }

        // 2. 사용자 프로필 요청
        const profileResponse = await fetch(NAVER_PROFILE_URL, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const profileData: NaverProfileResponse = await profileResponse.json();

        if (!profileResponse.ok || profileData.resultcode !== '00') {
            reportAuthError('Naver profile error', {
                message: profileData.message,
                status: profileResponse.status,
            });
            return redirectWithStateCleanup(`${redirectUrl}/login?error=profile_failed`);
        }

        const naverUser = profileData.response;
        if (!naverUser?.id) {
            reportAuthError('Naver profile missing user id');
            return redirectWithStateCleanup(`${redirectUrl}/login?error=profile_incomplete`);
        }

        const normalizedEmail = naverUser.email?.trim().toLowerCase();
        const fallbackEmail = `naver_${naverUser.id}@naver.local`;
        const candidateEmails = [normalizedEmail, fallbackEmail].filter(Boolean) as string[];

        const { data: profileByNaver, error: profileByNaverError } = await adminClient
            .from('profiles')
            .select('id')
            .eq('naver_id', naverUser.id)
            .maybeSingle();

        if (profileByNaverError && profileByNaverError.code !== 'PGRST116') {
            reportAuthError('Profile lookup by naver_id failed', { code: profileByNaverError.code });
        }

        let existingUser: User | null = null;
        if (profileByNaver?.id) {
            const { data: userById, error: userByIdError } = await adminClient.auth.admin.getUserById(profileByNaver.id);
            if (userByIdError) {
                reportAuthError('User lookup by id failed', { userId: profileByNaver.id }, userByIdError);
            } else {
                existingUser = userById.user ?? null;
            }
        }

        const findUserByEmail = async (emails: string[]) => {
            if (!emails.length) return null;
            let page = 1;
            const perPage = 1000;
            while (true) {
                const { data, error: listError } = await adminClient.auth.admin.listUsers({ page, perPage });
                if (listError) {
                    reportAuthError('User lookup by email failed', { page }, listError);
                    return null;
                }

                const match = data?.users?.find((user) => user.email && emails.includes(user.email));
                if (match) return match;
                if (!data?.users || data.users.length < perPage) break;
                page += 1;
            }

            return null;
        };

        if (!existingUser) {
            existingUser = await findUserByEmail(candidateEmails);
        }

        let userId: string;
        const fullName = naverUser.name || naverUser.nickname || null;
        const phone = naverUser.mobile ? naverUser.mobile.replace(/-/g, '') : null;
        const avatarUrl = naverUser.profile_image || null;

        const userMetadata = {
            naver_id: naverUser.id,
            provider: 'naver',
            ...(normalizedEmail ? { naver_email: normalizedEmail } : {}),
            ...(fullName ? { full_name: fullName } : {}),
            ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
            ...(phone ? { phone } : {}),
        };

        if (existingUser) {
            userId = existingUser.id;

            const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
                user_metadata: {
                    ...existingUser.user_metadata,
                    ...userMetadata,
                },
            });
            if (updateError) {
                reportAuthError('User update error', { userId }, updateError);
                return redirectWithStateCleanup(`${redirectUrl}/login?error=user_update_failed`);
            }
        } else {
            const userEmail = normalizedEmail || fallbackEmail;
            const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
                email: userEmail,
                email_confirm: true,
                user_metadata: userMetadata,
            });

            if (createError) {
                reportAuthError('User creation error', { email: userEmail }, createError);
                return redirectWithStateCleanup(`${redirectUrl}/login?error=user_creation_failed`);
            }

            userId = newUser.user!.id;
        }

        const profilePayload = {
            id: userId,
            naver_id: naverUser.id,
            ...(fullName ? { full_name: fullName } : {}),
            ...(phone ? { phone } : {}),
            ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
            ...(fullName && phone ? { is_profile_complete: true } : {}),
        };

        const { error: profileError } = await adminClient.from('profiles').upsert(profilePayload);
        if (profileError) {
            reportAuthError('Profile upsert error', { userId }, profileError);
            return redirectWithStateCleanup(`${redirectUrl}/login?error=profile_upsert_failed`);
        }

        const signInEmail = normalizedEmail || fallbackEmail;
        const { data: signInData, error: signInError } = await adminClient.auth.admin.generateLink({
            type: 'magiclink',
            email: signInEmail,
            options: {
                redirectTo: `${redirectUrl}/login`,
            },
        });

        if (signInError || !signInData?.properties?.action_link) {
            reportAuthError('Sign in link error', { email: signInEmail }, signInError);
            return redirectWithStateCleanup(`${redirectUrl}/login?error=session_failed`);
        }

        return redirectWithStateCleanup(signInData.properties.action_link);
    } catch (error) {
        reportAuthError('Naver OAuth callback error', undefined, error);
        return redirectWithStateCleanup(`${redirectUrl}/login?error=server_error`);
    }
}
