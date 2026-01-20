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

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    const isAdmin = profile?.is_admin || session.user.email === 'admin@test.com';

    // Fetch invitation count for the sidebar badge
    const { count: invitationCount } = await supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

    // Fetch request count for the sidebar badge (if admin)
    let requestCount = 0;
    if (isAdmin) {
        const { count } = await supabase
            .from('approval_requests')
            .select('*', { count: 'exact', head: true })
            .in('status', ['pending', 'rejected', 'approved']);
        requestCount = count || 0;
    }

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
