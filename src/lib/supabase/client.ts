import type { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const ANON_TOKEN_RETRY_MS = 120_000;
const TOKEN_EXPIRY_BUFFER_MS = 30_000;

interface BrowserSupabaseState {
    client: SupabaseClient | null;
    clientPromise: Promise<SupabaseClient> | null;
    token: string | null;
    tokenExpiresAt: number;
    tokenRequest: Promise<string | null> | null;
    supabaseModulePromise: Promise<typeof import('@supabase/supabase-js')> | null;
}

type BrowserGlobal = typeof globalThis & {
    __weddingBrowserSupabaseState__?: BrowserSupabaseState;
};

const decodeExpiry = (token: string): number => {
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

const getBrowserState = (): BrowserSupabaseState => {
    if (typeof window === 'undefined') {
        throw new Error('getBrowserSupabaseClient must be called in a browser context.');
    }

    const browserGlobal = globalThis as BrowserGlobal;
    if (!browserGlobal.__weddingBrowserSupabaseState__) {
        browserGlobal.__weddingBrowserSupabaseState__ = {
            client: null,
            clientPromise: null,
            token: null,
            tokenExpiresAt: 0,
            tokenRequest: null,
            supabaseModulePromise: null,
        };
    }

    return browserGlobal.__weddingBrowserSupabaseState__;
};

const getAccessToken = async (): Promise<string | null> => {
    const state = getBrowserState();
    const now = Date.now();
    const isTokenValid = state.tokenExpiresAt > now + TOKEN_EXPIRY_BUFFER_MS;

    if (isTokenValid) {
        return state.token;
    }

    if (!state.tokenRequest) {
        state.tokenRequest = fetchSupabaseToken().then((token) => {
            state.token = token;
            state.tokenExpiresAt = token ? decodeExpiry(token) : Date.now() + ANON_TOKEN_RETRY_MS;
            return token;
        }).catch(() => {
            state.token = null;
            state.tokenExpiresAt = Date.now() + ANON_TOKEN_RETRY_MS;
            return null;
        }).finally(() => {
            state.tokenRequest = null;
        });
    }

    return state.tokenRequest;
};

export async function getBrowserSupabaseClient(): Promise<SupabaseClient> {
    const state = getBrowserState();

    if (state.client) {
        return state.client;
    }

    if (!state.clientPromise) {
        state.clientPromise = (async () => {
            if (!state.supabaseModulePromise) {
                state.supabaseModulePromise = import('@supabase/supabase-js');
            }
            const { createClient } = await state.supabaseModulePromise;

            const options: SupabaseClientOptions<'public'> = {
                accessToken: getAccessToken,
                auth: { persistSession: false, autoRefreshToken: false },
            };

            const client = createClient(supabaseUrl, supabaseAnonKey, options);
            state.client = client;
            return client;
        })().catch((error: unknown) => {
            state.clientPromise = null;
            throw error;
        });
    }

    return state.clientPromise;
}
