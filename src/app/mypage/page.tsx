import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';
import { APPROVAL_REQUEST_SUMMARY_SELECT } from '@/lib/approval-request-summary';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import type { InvitationSummaryRecord, InvitationSummaryRow } from '@/lib/invitation-summary';
import type { Profile } from '@/services/profileService';
import MyPageClient from './MyPageClient';

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
    const supabase = await createSupabaseServerClient(session);

    let profile: Pick<Profile, 'full_name' | 'phone' | 'is_admin'> | null = null;
    let isAdmin = false;
    let invitations: InvitationSummaryRecord[] = [];
    let approvalRequests: ApprovalRequestSummary[] = [];

    if (user) {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone, is_admin')
            .eq('id', user.id)
            .single();

        profile = profileData ?? null;
        const isEmailAdmin = user.email?.includes('admin') || user.email?.startsWith('admin');
        isAdmin = profile?.is_admin || isEmailAdmin || false;

        if (isAdmin) {
            const db = supabaseAdmin || supabase;
            const [invitationsResult, approvalRequestsResult] = await Promise.all([
                db.from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .contains('invitation_data', { isRequestingApproval: true })
                    .order('updated_at', { ascending: false }),
                db.from('approval_requests')
                    .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                    .order('created_at', { ascending: false }),
            ]);

            const invitationRows = (invitationsResult.data ?? []) as unknown as InvitationSummaryRow[];
            invitations = invitationRows.map(toInvitationSummary);
            approvalRequests = (approvalRequestsResult.data ?? []) as unknown as ApprovalRequestSummary[];
        } else {
            const { data } = await supabase
                .from('invitations')
                .select(INVITATION_SUMMARY_SELECT)
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });
            const invitationRows = (data ?? []) as unknown as InvitationSummaryRow[];
            invitations = invitationRows.map(toInvitationSummary);
        }
    }

    return (
        <MyPageClient
            userId={user?.id ?? null}
            isAdmin={isAdmin}
            profile={profile ? { full_name: profile.full_name, phone: profile.phone } : null}
            initialInvitations={invitations}
            initialApprovalRequests={approvalRequests}
        />
    );
}
