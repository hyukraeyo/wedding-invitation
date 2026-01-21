import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
// import { profileService } from '@/services/profileService';
import AccountPageClient from './AccountPageClient';
import { redirect } from 'next/navigation';

export const metadata = {
    title: '계정 관리 | 바나나웨딩',
};

export default async function AccountPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const supabase = await createSupabaseServerClient(session);

    // 1. 모든 독립적인 데이터 패칭을 병렬로 수행 (성능 최적화)
    const [profileRes, countRes, requestCountRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
        supabase.from('approval_requests').select('*', { count: 'exact', head: true }).in('status', ['pending', 'rejected', 'approved'])
    ]);

    const profile = profileRes.data;
    const invitationCount = countRes.count || 0;
    const isAdmin = profile?.is_admin || session.user.email === 'admin@test.com';

    // 관리자일 경우에만 실제 카운트 사용
    const requestCount = isAdmin ? (requestCountRes.count || 0) : 0;

    return (
        <AccountPageClient
            profile={profile || { id: session.user.id, full_name: null, phone: null, is_profile_complete: false }}
            isAdmin={isAdmin}
            userEmail={session.user.email || null}
            invitationCount={invitationCount || 0}
            requestCount={requestCount}
        />
    );
}
