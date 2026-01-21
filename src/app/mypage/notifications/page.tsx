import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { APPROVAL_REQUEST_SUMMARY_SELECT } from '@/lib/approval-request-summary';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import NotificationsClient from './NotificationsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: '알림 | 바나나웨딩',
    description: '바나나웨딩의 소식을 확인하세요.',
};

export default async function NotificationsPage() {
    const session = await auth();
    const user = session?.user ?? null;

    if (!user) {
        redirect('/login');
    }

    const supabase = await createSupabaseServerClient(session);

    // Fetch profile and notifications
    // User only: fetch their own requests that are rejected or approved
    const [profileRes, notificationsRes] = await Promise.all([
        supabase.from('profiles').select('is_admin, full_name, phone').eq('id', user.id).single(),
        supabase.from('approval_requests')
            .select(APPROVAL_REQUEST_SUMMARY_SELECT)
            .eq('user_id', user.id)
            .in('status', ['rejected', 'approved'])
            .order('created_at', { ascending: false })
    ]);

    const profileData = profileRes.data;
    const notifications = (notificationsRes.data ?? []) as unknown as ApprovalRequestSummary[];

    return (
        <NotificationsClient
            userId={user.id}
            profile={profileData}
            isAdmin={!!profileData?.is_admin}
            notifications={notifications}
        />
    );
}
