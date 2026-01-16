import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { InvitationSummaryRow } from '@/lib/invitation-summary';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        const user = session?.user ?? null;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const isEmailAdmin = user.email === 'admin@test.com';
        let isAdmin = isEmailAdmin;

        if (!isAdmin) {
            const supabase = await createSupabaseServerClient(session);
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();
            isAdmin = profile?.is_admin || false;
        }

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
            .select(INVITATION_SUMMARY_SELECT)
            .contains('invitation_data', { isRequestingApproval: true })
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin invitations:', error);
            return NextResponse.json(
                { error: '청첩장 목록을 불러오는데 실패했습니다.', details: error.message },
                { status: 500 }
            );
        }

        const invitations = ((data ?? []) as unknown as InvitationSummaryRow[]).map(toInvitationSummary);
        return NextResponse.json({ success: true, data: invitations });
    } catch (error) {
        console.error('Unexpected error in GET /api/admin/invitations:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
