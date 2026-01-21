import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Session } from 'next-auth';

/**
 * 🍌 마이페이지 레이아웃 (서버 컴포넌트)
 * 레이아웃에서의 await도 네비게이션을 블로킹할 수 있습니다.
 * 뼈대(Header)는 즉시 렌더링하고, 데이터가 필요한 사이드바 영역은 내부에서 처리하도록 최적화합니다.
 */
export default async function MyPageLayoutServer({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    // 레이아웃 자체의 블로킹을 최소화하기 위해, 
    // 실제 데이터 패칭이 필요한 MyPageLayout을 별도의 비동기 로직으로 분리하거나 
    // 즉시 렌더링 가능한 구조로 유지합니다.
    return (
        <Suspense fallback={<div className="min-h-screen pt-14 bg-[#f8f9fa]" />}>
            <MyPageLayoutFetcher session={session}>
                {children}
            </MyPageLayoutFetcher>
        </Suspense>
    );
}

async function MyPageLayoutFetcher({ session, children }: { session: Session | null, children: React.ReactNode }) {
    const supabase = await createSupabaseServerClient(session);
    const userId = session?.user?.id;

    if (!userId) return null;

    // 1. 필요한 모든 데이터를 병렬로 패칭 (관리자 권한 확인과 동시에 요청 개수 조회)
    const [profileRes, invitationCountRes, requestCountRes] = await Promise.all([
        supabase.from('profiles').select('full_name, phone, is_admin').eq('id', userId).single(),
        supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('approval_requests').select('*', { count: 'exact', head: true }).in('status', ['pending', 'rejected', 'approved'])
    ]);

    const profile = profileRes.data;
    const isAdmin = !!profile?.is_admin;
    const invitationCount = invitationCountRes.count || 0;

    // 관리자가 아닐 경우 requestCount는 0으로 처리 (보안 정책에 의해 이미 필터링되지만 로직상 명시)
    const requestCount = isAdmin ? (requestCountRes.count || 0) : 0;

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
