'use server';

import { getSession } from '@/lib/auth/getSession';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getProfileCounts() {
  const session = await getSession();
  if (!session?.user?.id)
    return { isAdmin: false, invitationCount: 0, requestCount: 0, notificationCount: 0 };

  const supabase = await createSupabaseServerClient(session);

  const [profileRes, invitationCountRes, requestCountRes] = await Promise.all([
    supabase.from('profiles').select('is_admin').eq('id', session.user.id).single(),
    supabase
      .from('invitations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id),
    supabase
      .from('approval_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  const isAdmin = !!profileRes.data?.is_admin;
  return {
    isAdmin,
    invitationCount: invitationCountRes.count || 0,
    requestCount: isAdmin ? requestCountRes.count || 0 : 0,
  };
}
