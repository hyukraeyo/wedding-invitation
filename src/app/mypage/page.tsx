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
    let adminInvitations: InvitationSummaryRecord[] = [];
    let approvalRequests: ApprovalRequestSummary[] = [];
    let rejectedRequests: ApprovalRequestSummary[] = [];

    if (user) {
        // Start all independent fetches in parallel
        const profilePromise = supabase
            .from('profiles')
            .select('full_name, phone, is_admin')
            .eq('id', user.id)
            .single();

        const myInvitationsPromise = supabase
            .from('invitations')
            .select(INVITATION_SUMMARY_SELECT)
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        const rejectedRequestsPromise = supabase
            .from('approval_requests')
            .select(APPROVAL_REQUEST_SUMMARY_SELECT)
            .eq('user_id', user.id)
            .eq('status', 'rejected')
            .order('created_at', { ascending: false });

        // Await the basic data
        const [profileRes, myInvRes, rejReqRes] = await Promise.all([
            profilePromise,
            myInvitationsPromise,
            rejectedRequestsPromise,
        ]);

        profile = profileRes.data ?? null;
        isAdmin = !!profile?.is_admin;

        // Map initial data
        const myRows = (myInvRes.data ?? []) as unknown as InvitationSummaryRow[];
        invitations = myRows.map(toInvitationSummary);
        rejectedRequests = (rejReqRes.data ?? []) as unknown as ApprovalRequestSummary[];

        if (isAdmin) {
            // If admin, fetch specific admin queue data
            const db = supabaseAdmin || supabase;

            // Waterfall here is unavoidable because we need IDs from approval_requests first,
            // but we can at least make the requests fetch fast.
            const approvalRequestsRes = await db.from('approval_requests')
                .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                .in('status', ['pending', 'rejected', 'approved'])
                .order('created_at', { ascending: false });

            approvalRequests = (approvalRequestsRes.data ?? []) as unknown as ApprovalRequestSummary[];
            const requestIds = approvalRequests.map(r => r.invitation_id);

            if (requestIds.length > 0) {
                const adminQueueRes = await db.from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .in('id', requestIds)
                    .order('updated_at', { ascending: false });

                const adminRows = (adminQueueRes.data ?? []) as unknown as InvitationSummaryRow[];
                adminInvitations = adminRows.map(toInvitationSummary);
            }
        }
    }

    return (
        <MyPageClient
            userId={user?.id ?? null}
            isAdmin={isAdmin}
            profile={profile ? { full_name: profile.full_name, phone: profile.phone } : null}
            initialInvitations={invitations}
            initialAdminInvitations={adminInvitations}
            initialApprovalRequests={approvalRequests}
            initialRejectedRequests={rejectedRequests}
        />
    );
}
