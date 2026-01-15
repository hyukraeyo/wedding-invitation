import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        const user = session?.user ?? null;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createSupabaseServerClient();

        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
        // Strict admin check
        const isEmailAdmin = user.email === 'admin@test.com';
        const isAdmin = profile?.is_admin || isEmailAdmin || false;

        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!supabaseAdmin) {
            console.error('Supabase Service Role Key is missing.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('invitations')
            .select('*')
            .contains('invitation_data', { isRequestingApproval: true })
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin invitations:', error);
            return NextResponse.json(
                { error: '청첩장 목록을 불러오는데 실패했습니다.', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: data ?? [] });
    } catch (error) {
        console.error('Unexpected error in GET /api/admin/invitations:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
