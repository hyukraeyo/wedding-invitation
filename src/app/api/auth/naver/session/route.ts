import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!email) {
        return NextResponse.redirect(`${redirectUrl}/login?error=no_email`);
    }

    try {
        // OTP 방식으로 세션 생성을 위한 매직링크 생성
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: decodeURIComponent(email),
            options: {
                redirectTo: `${redirectUrl}/login`,
            },
        });

        if (error || !data?.properties?.action_link) {
            console.error('Magic link generation error:', error);
            return NextResponse.redirect(`${redirectUrl}/login?error=session_failed`);
        }

        // 매직링크로 리다이렉트 (Supabase가 자동으로 세션 설정)
        return NextResponse.redirect(data.properties.action_link);
    } catch (error) {
        console.error('Session creation error:', error);
        return NextResponse.redirect(`${redirectUrl}/login?error=server_error`);
    }
}
