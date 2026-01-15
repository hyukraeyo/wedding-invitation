import { createClient } from '@supabase/supabase-js';
import { auth } from '@/auth';
import { createSupabaseJwt } from '@/lib/supabase/jwt';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createSupabaseServerClient() {
  const session = await auth();
  const userId = session?.user?.id;
  const token = userId ? await createSupabaseJwt(userId) : null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
  });
}
