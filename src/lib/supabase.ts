import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client for browser usage (cookie-based for SSR parity)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
