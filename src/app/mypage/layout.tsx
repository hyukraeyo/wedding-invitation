import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { redirect } from 'next/navigation';

export default async function MyPageLayoutServer({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const supabase = await createSupabaseServerClient(session);

    // Fetch essential sidebar data in parallel
    const profilePromise = supabase
        .from('profiles')
        .select('full_name, phone, is_admin')
        .eq('id', session.user.id)
        .single();

    const invitationCountPromise = supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

    const [profileRes, invitationCountRes] = await Promise.all([
        profilePromise,
        invitationCountPromise,
    ]);

    const profile = profileRes.data;
    const isAdmin = !!profile?.is_admin;
    const invitationCount = invitationCountRes.count || 0;

    let requestCount = 0;
    if (isAdmin) {
        const { count } = await supabase
            .from('approval_requests')
            .select('*', { count: 'exact', head: true })
            .in('status', ['pending', 'rejected', 'approved']);
        requestCount = count || 0;
    }

    return (
        <MyPageLayout
            profile={profile ? { full_name: profile.full_name, phone: profile.phone } : null}
            isAdmin={isAdmin}
            invitationCount={invitationCount}
            requestCount={requestCount}
        >
            {children}
        </MyPageLayout>
    );
}
