import { cache } from 'react';
import type { Session } from 'next-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const getHeaderNotificationCount = cache(async (session: Session | null) => {
    const userId = session?.user?.id;
    if (!userId) return 0;

    const supabase = await createSupabaseServerClient(session);
    const { count } = await supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .or('invitation_data->>hasNewRejection.eq.true,invitation_data->>hasNewApproval.eq.true');

    return count || 0;
});
