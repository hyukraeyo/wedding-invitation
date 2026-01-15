import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';
import { ApprovalRequestRecord } from '@/services/approvalRequestService';
import { Profile } from '@/services/profileService';
import MyPageClient from './MyPageClient';
import type { InvitationRecord } from './MyPageClient';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '마이페이지 | 바나나웨딩',
    description: '나만의 모바일 청첩장을 관리하고 승인 상태를 확인하세요. 바나나웨딩에서 제작한 소중한 청첩장 목록입니다.',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function MyPage() {
    const session = await auth();
    const user = session?.user ?? null;
    const supabase = await createSupabaseServerClient();

    let profile: Profile | null = null;
    let isAdmin = false;

    if (user) {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        profile = profileData ?? null;
        const isEmailAdmin = user.email?.includes('admin') || user.email?.startsWith('admin');
        isAdmin = profile?.is_admin || isEmailAdmin || false;
    }

    let invitations: InvitationRecord[] = [];
    let approvalRequests: ApprovalRequestRecord[] = [];

    if (user) {
        if (isAdmin && supabaseAdmin) {
            const { data } = await supabaseAdmin
                .from('invitations')
                .select('*')
                .contains('invitation_data', { isRequestingApproval: true })
                .order('updated_at', { ascending: false });
            invitations = (data ?? []) as InvitationRecord[];
        } else {
            const { data } = await supabase
                .from('invitations')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });
            invitations = (data ?? []) as InvitationRecord[];
        }
    }

    if (user && isAdmin) {
        const db = supabaseAdmin || supabase;
        const { data } = await db
            .from('approval_requests')
            .select('*')
            .order('created_at', { ascending: false });
        approvalRequests = (data ?? []) as ApprovalRequestRecord[];
    }

    return (
        <MyPageClient
            userId={user?.id ?? null}
            isAdmin={isAdmin}
            profile={profile}
            initialInvitations={invitations}
            initialApprovalRequests={approvalRequests}
        />
    );
}
