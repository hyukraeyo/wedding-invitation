import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import MyPageClient from './MyPageClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { InvitationSummaryRow } from '@/lib/invitation-summary';
import { APPROVAL_REQUEST_SUMMARY_SELECT } from '@/lib/approval-request-summary';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import MyPageLoading from './loading';

export const dynamic = 'force-dynamic';

/**
 * 🍌 마이페이지 (서버 컴포넌트)
 * Next.js 16 최적화: 최상단 await를 제거하고 Suspense를 사용하여 즉각적인 페이지 전환을 보장합니다.
 */
export default async function MyPage() {
    const session = await auth();
    const user = session?.user ?? null;

    if (!user) {
        redirect('/login');
    }

    return (
        <Suspense fallback={<MyPageLoading />}>
            <MyPageDataFetcher userId={user.id} session={session} />
        </Suspense>
    );
}

/**
 * 데이터를 실제로 패칭하는 내부 컴포넌트
 * 이 컴포넌트가 로딩되는 동안 MyPageLoading(스켈레톤)이 즉시 표시됩니다.
 */
async function MyPageDataFetcher({ userId, session }: { userId: string, session: any }) {
    const supabase = await createSupabaseServerClient(session);

    // 1. 기본 프로필 및 개수 패칭
    const [profileRes, countRes] = await Promise.all([
        supabase.from('profiles').select('is_admin, full_name, phone').eq('id', userId).single(),
        supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    ]);

    const profileData = profileRes.data;
    const isAdmin = profileData?.is_admin || false;
    const invitationCount = countRes.count || 0;

    // 2. 초대장 목록 패칭
    const invitationsRes = await supabase
        .from('invitations')
        .select(INVITATION_SUMMARY_SELECT)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    const invitationRows = (invitationsRes.data ?? []) as unknown as InvitationSummaryRow[];
    const invitations = invitationRows.map(toInvitationSummary);

    // 3. (옵션) 반려된 요청 패칭
    const rejectedRes = await supabase
        .from('approval_requests')
        .select(APPROVAL_REQUEST_SUMMARY_SELECT)
        .eq('user_id', userId)
        .eq('status', 'rejected')
        .order('created_at', { ascending: false });

    const rejectedRequests = (rejectedRes.data ?? []) as unknown as ApprovalRequestSummary[];

    return (
        <MyPageClient
            userId={userId}
            isAdmin={isAdmin}
            profile={profileData}
            initialInvitations={invitations}
            initialAdminInvitations={[]} // 기본값
            initialApprovalRequests={[]} // 기본값
            initialRejectedRequests={rejectedRequests}
        />
    );
}
