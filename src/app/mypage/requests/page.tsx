import { auth } from '@/auth';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
    QueryClient,
    HydrationBoundary,
    dehydrate
} from '@tanstack/react-query';
import RequestsPageClient from './RequestsPageClient';
import { APPROVAL_REQUEST_SUMMARY_SELECT } from '@/lib/approval-request-summary';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: '신청 관리 | 바나나웨딩',
    description: '접수된 청첩장 신청 목록을 관리합니다.',
};

/**
 * 🍌 신청 관리 페이지 (서버 컴포넌트)
 * TanStack Query를 사용하여 프리페칭(Prefetching)을 수행하고,
 * 하이드레이션(Hydration)을 통해 클라이언트에 즉시 데이터를 전달합니다.
 */
export default async function RequestsPage() {
    const session = await auth();
    const user = session?.user ?? null;

    if (!user) {
        redirect('/login');
    }

    return <RequestsDataLayer session={session} userId={user.id} />;
}

async function RequestsDataLayer({ session, userId }: { session: Session | null, userId: string }) {
    const supabase = await createSupabaseServerClient(session);

    // 1. 프로필 및 권한 체크 (병렬 수행)
    const profileRes = await supabase
        .from('profiles')
        .select('is_admin, full_name, phone')
        .eq('id', userId)
        .single();

    const profileData = profileRes.data;
    const isAdmin = profileData?.is_admin || false;

    if (!isAdmin) {
        redirect('/mypage');
    }

    // 2. 초기 리미트 결정 (기기 환경에 따라)
    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);
    const initialLimit = isMobile ? 5 : 10;

    // 3. TanStack Query 프리페칭
    const queryClient = new QueryClient();
    const db = supabaseAdmin || supabase;

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['approval-requests'],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await db
                .from('approval_requests')
                .select(APPROVAL_REQUEST_SUMMARY_SELECT)
                .in('status', ['pending', 'rejected', 'approved'])
                .order('created_at', { ascending: false })
                .range(pageParam, pageParam + initialLimit - 1);

            return data ?? [];
        },
        initialPageParam: 0,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RequestsPageClient
                userId={userId}
                profile={profileData}
                initialLimit={initialLimit}
            />
        </HydrationBoundary>
    );
}
