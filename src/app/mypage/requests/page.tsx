import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { APPROVAL_REQUEST_SUMMARY_SELECT } from '@/lib/approval-request-summary';
import { INVITATION_SUMMARY_SELECT, toInvitationSummary } from '@/lib/invitation-summary';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import type { InvitationSummaryRow } from '@/lib/invitation-summary';
import RequestsPageClient from './RequestsPageClient';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
    const session = await auth();
    const user = session?.user ?? null;

    if (!user) {
        redirect('/login');
    }

    const supabase = await createSupabaseServerClient(session);

    // 1. Start basic checks in parallel
    const profilePromise = supabase
        .from('profiles')
        .select('is_admin, full_name, phone')
        .eq('id', user.id)
        .single();

    const countPromise = supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    // 2. Await basic checks
    const [profileRes, countRes] = await Promise.all([profilePromise, countPromise]);
    const profileData = profileRes.data;
    const isAdmin = profileData?.is_admin || false;
    const invitationCount = countRes.count || 0;

    if (!isAdmin) {
        redirect('/mypage');
    }

    // 3. Fetch admin-specific data
    const db = supabaseAdmin || supabase;
    const approvalRequestsResult = await db.from('approval_requests')
        .select(APPROVAL_REQUEST_SUMMARY_SELECT)
        .in('status', ['pending', 'rejected', 'approved'])
        .order('created_at', { ascending: false });

    const approvalRequests = (approvalRequestsResult.data ?? []) as unknown as ApprovalRequestSummary[];
    const requestIds = approvalRequests.map(r => r.invitation_id);

    let adminInvitations: ReturnType<typeof toInvitationSummary>[] = [];
    if (requestIds.length > 0) {
        const adminQueueResult = await db.from('invitations')
            .select(INVITATION_SUMMARY_SELECT)
            .in('id', requestIds)
            .order('updated_at', { ascending: false });

        const rows = (adminQueueResult.data ?? []) as unknown as InvitationSummaryRow[];
        adminInvitations = rows.map(toInvitationSummary);
    }

    return (
        <RequestsPageClient
            userId={user.id}
            initialApprovalRequests={approvalRequests}
            initialAdminInvitations={adminInvitations}
            profile={profileData}
            invitationCount={invitationCount || 0}
        />
    );
}
