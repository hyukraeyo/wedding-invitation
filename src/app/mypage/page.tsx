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
            const [adminQueueResult, myInvitationsResult, approvalRequestsResult] = await Promise.all([
                // 1. Admin Queue (Requests)
                db.from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .contains('invitation_data', { isRequestingApproval: true })
                    .order('updated_at', { ascending: false }),
                // 2. Personal Invitations (Drafts included)
                db.from('invitations')
                    .select(INVITATION_SUMMARY_SELECT)
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false }),
                // 3. Approval Requests List
                db.from('approval_requests')
                    .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                    .order('created_at', { ascending: false }),
            ]);

            const adminRows = (adminQueueResult.data ?? []) as unknown as InvitationSummaryRow[];
            const myRows = (myInvitationsResult.data ?? []) as unknown as InvitationSummaryRow[];

            // Deduplicate
            const paramMap = new Map();
            adminRows.forEach(row => paramMap.set(row.id, row));
            myRows.forEach(row => paramMap.set(row.id, row));

            const mergedRows = Array.from(paramMap.values())
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

            invitations = mergedRows.map(toInvitationSummary);
            approvalRequests = (approvalRequestsResult.data ?? []) as unknown as ApprovalRequestSummary[];
        } else {
            const { data } = await supabase
                .from('invitations')
                .select(INVITATION_SUMMARY_SELECT)
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            const rows = (data ?? []) as unknown as InvitationSummaryRow[];
            invitations = rows.map(toInvitationSummary);
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
