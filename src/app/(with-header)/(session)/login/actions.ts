'use server';

import { getSession } from '@/lib/auth/getSession';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface ProfileSummary {
  full_name: string | null;
  phone: string | null;
  is_profile_complete?: boolean | null;
}

export interface ProfileState {
  profile: ProfileSummary | null;
  isComplete: boolean;
}

export async function getProfileForSession(): Promise<ProfileState | null> {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) return null;

  const supabase = await createSupabaseServerClient(session);
  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone, is_profile_complete')
    .eq('id', userId)
    .single();

  const profile = data
    ? {
        full_name: data.full_name,
        phone: data.phone,
        is_profile_complete: data.is_profile_complete,
      }
    : null;
  return {
    profile,
    isComplete: !!(profile?.is_profile_complete || (profile?.full_name && profile?.phone)),
  };
}
