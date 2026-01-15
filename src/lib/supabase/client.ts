import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let cachedClient: SupabaseClient | null = null;
let cachedToken: string | null = null;
let clientToken: string | null = null;
let tokenExpiresAt = 0;
let tokenRequest: Promise<string> | null = null;

const decodeExpiry = (token: string) => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return 0;
        const decoded = JSON.parse(atob(payload));
        return typeof decoded.exp === 'number' ? decoded.exp * 1000 : 0;
    } catch {
        return 0;
    }
};

const fetchSupabaseToken = async () => {
    const response = await fetch('/api/supabase/token', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch Supabase token');
    }
    const data = (await response.json()) as { token: string };
    return data.token;
};

export async function getBrowserSupabaseClient() {
    const now = Date.now();
    const isTokenValid = cachedToken && tokenExpiresAt > now + 30_000;

    if (!isTokenValid) {
        if (!tokenRequest) {
            tokenRequest = fetchSupabaseToken().finally(() => {
                tokenRequest = null;
            });
        }
        const token = await tokenRequest;
        cachedToken = token;
        tokenExpiresAt = decodeExpiry(token);
    }

    if (!cachedClient || !cachedToken || clientToken !== cachedToken) {
        cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${cachedToken}` } },
        });
        clientToken = cachedToken;
    }

    return cachedClient;
}
