import type { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let cachedClient: SupabaseClient | null = null;
let cachedToken: string | null = null;
let clientToken: string | null = null;
let tokenExpiresAt = 0;
let tokenRequest: Promise<string | null> | null = null;
let supabaseModulePromise: Promise<typeof import('@supabase/supabase-js')> | null = null;

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

const fetchSupabaseToken = async (): Promise<string | null> => {
    try {
        const response = await fetch('/api/supabase/token', { method: 'GET' });
        if (response.status === 401) {
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch Supabase token');
        }
        const data = (await response.json()) as { token: string };
        return data.token;
    } catch (error) {
        console.warn('Error fetching Supabase token:', error);
        return null;
    }
};

export async function getBrowserSupabaseClient() {
    const now = Date.now();
    // Valid if we have a token that isn't expired, OR if we ostensibly have no token (anon) but the check hasn't "expired" (to prevent spamming)
    // Actually, simply checking expiresAt is enough if we set it for anon too.
    const isTokenValid = tokenExpiresAt > now + 30_000;

    if (!isTokenValid) {
        if (!tokenRequest) {
            tokenRequest = fetchSupabaseToken().catch(() => null).finally(() => {
                tokenRequest = null;
            });
        }
        const token = await tokenRequest;
        cachedToken = token;

        if (token) {
            tokenExpiresAt = decodeExpiry(token);
        } else {
            // If no token (anon), check again in 2 minutes
            tokenExpiresAt = Date.now() + 120_000;
        }
    }

    // Initialize or Re-initialize if token changed
    if (!cachedClient || clientToken !== cachedToken) {
        if (!supabaseModulePromise) {
            supabaseModulePromise = import('@supabase/supabase-js');
        }
        const { createClient } = await supabaseModulePromise;

        const options: SupabaseClientOptions<'public'> = {
            auth: { persistSession: false, autoRefreshToken: false },
        };

        if (cachedToken) {
            options.global = { headers: { Authorization: `Bearer ${cachedToken}` } };
        }

        cachedClient = createClient(supabaseUrl, supabaseAnonKey, options);
        clientToken = cachedToken;
    }

    return cachedClient;
}
