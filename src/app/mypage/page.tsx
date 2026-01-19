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
        // Only use the database profile for admin status, not just email presence
        // (email check is only for the specific 'admin@test.com' if needed for initial setup)
        const isDefaultAdmin = user.email === 'admin@test.com';

        // 1. Start Profile Fetch
        const profilePromise = supabase
            .from('profiles')
            .select('full_name, phone, is_admin')
            .eq('id', user.id)
            .single();

        let adminQueueResult, myInvitationsResult, approvalRequestsResult, rejectedRequestsResult;

        if (isDefaultAdmin) {
            // Case A: Definitely Admin. Parallelize all admin queries + profile + rejected requests.
            const db = supabaseAdmin || supabase;
            const results = await Promise.all([
                profilePromise,
                db.from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .contains('invitation_data', { isRequestingApproval: true })
                    .order('updated_at', { ascending: false }),
                db.from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false }),
                db.from('approval_requests')
                    .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                    .in('status', ['pending', 'rejected', 'approved'])
                    .order('created_at', { ascending: false }),
                db.from('approval_requests')
                    .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                    .eq('user_id', user.id)
                    .eq('status', 'rejected')
                    .order('created_at', { ascending: false }),
            ]);

            profile = results[0].data ?? null;
            adminQueueResult = results[1];
            myInvitationsResult = results[2];
            approvalRequestsResult = results[3];
            rejectedRequestsResult = results[4];
            isAdmin = true;
        } else {
            // Case B: Probably User. Parallelize My Invitations + Profile + Rejected Requests.
            const results = await Promise.all([
                profilePromise,
                supabase
                    .from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false }),
                supabase
                    .from('approval_requests')
                    .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                    .eq('user_id', user.id)
                    .eq('status', 'rejected')
                    .order('created_at', { ascending: false }),
            ]);

            profile = results[0].data ?? null;
            myInvitationsResult = results[1];
            rejectedRequestsResult = results[2];

            // Check if actually admin via DB profile
            isAdmin = !!profile?.is_admin;

            if (isAdmin) {
                // Fetch missing admin data
                const db = supabaseAdmin || supabase;
                const extraResults = await Promise.all([
                    db.from('invitations')
                        .select(INVITATION_SUMMARY_SELECT)
                        .contains('invitation_data', { isRequestingApproval: true })
                        .order('updated_at', { ascending: false }),
                    db.from('approval_requests')
                        .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                        .in('status', ['pending', 'rejected', 'approved'])
                        .order('created_at', { ascending: false }),
                ]);
                adminQueueResult = extraResults[0];
                approvalRequestsResult = extraResults[1];
            }
        }

        if (isAdmin) {
            const adminRows = (adminQueueResult?.data ?? []) as unknown as InvitationSummaryRow[];
            const myRows = (myInvitationsResult?.data ?? []) as unknown as InvitationSummaryRow[];

            invitations = myRows.map(toInvitationSummary);
            adminInvitations = adminRows.map(toInvitationSummary);
            approvalRequests = (approvalRequestsResult?.data ?? []) as unknown as ApprovalRequestSummary[];
            rejectedRequests = (rejectedRequestsResult?.data ?? []) as unknown as ApprovalRequestSummary[];
        } else {
            const rows = (myInvitationsResult?.data ?? []) as unknown as InvitationSummaryRow[];
            invitations = rows.map(toInvitationSummary);
            rejectedRequests = (rejectedRequestsResult?.data ?? []) as unknown as ApprovalRequestSummary[];
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
