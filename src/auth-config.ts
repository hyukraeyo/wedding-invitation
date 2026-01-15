import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[CRITICAL] Missing Supabase environment variables');
}

const nextAuthClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'next_auth' },
});

const publicClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
});

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);


export const authConfig = {

    adapter: SupabaseAdapter({
        url: supabaseUrl,
        secret: supabaseServiceRoleKey,
    }),
    session: { strategy: 'database' },
    trustHost: true,
    providers: [
        Naver({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
            authorization: {
                url: 'https://nid.naver.com/oauth2.0/authorize',
                params: { scope: 'name email mobile' },
            },
            profile(profile) {
                const data = (profile as { response?: Record<string, string | undefined> }).response ?? profile;
                return {
                    id: String(data.id),
                    name: data.name ?? data.nickname ?? null,
                    email: data.email ?? null,
                    image: data.profile_image ?? null,
                };
            },
        }),
        Kakao({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
            authorization: {
                url: 'https://kauth.kakao.com/oauth/authorize',
                params: {
                    scope: 'profile_nickname account_email',
                },
            },
            profile(profile) {
                const account = (profile as { kakao_account?: { email?: string; phone_number?: string; profile?: { nickname?: string; profile_image_url?: string } } }).kakao_account ?? {};
                const profileData = account.profile ?? {};
                return {
                    id: String((profile as { id?: string | number }).id ?? ''),
                    name: profileData.nickname ?? null,
                    email: account.email ?? null,
                    image: profileData.profile_image_url ?? null,
                };
            },
        }),
        Credentials({
            name: 'Admin',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const rawEmail = typeof credentials?.email === 'string' ? credentials.email : '';
                const email = rawEmail.toLowerCase().trim();
                const password = typeof credentials?.password === 'string' ? credentials.password : '';
                const expectedPassword = process.env.ADMIN_PASSWORD ?? '';

                if (!email || !adminEmails.includes(email)) return null;
                if (!expectedPassword || password !== expectedPassword) return null;

                const { data: existingUser } = await nextAuthClient
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();

                if (existingUser) {
                    return {
                        id: existingUser.id,
                        email: existingUser.email,
                        name: existingUser.name ?? 'Admin',
                        image: existingUser.image ?? null,
                    };
                }

                const { data: newUser, error } = await nextAuthClient
                    .from('users')
                    .insert({
                        email,
                        name: 'Admin',
                        emailVerified: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (error || !newUser) return null;

                return {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name ?? 'Admin',
                    image: newUser.image ?? null,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const provider = account?.provider;

            // Admin Credentials Check
            if (provider === 'credentials') {
                if (!user.email || !adminEmails.length) return false;
                const isAdmin = adminEmails.includes(user.email.toLowerCase());
                if (!isAdmin) return false;

                try {
                    await publicClient.from('profiles').upsert({
                        id: user.id,
                        full_name: user.name ?? 'Admin',
                        is_admin: true,
                    });
                } catch (error) {
                    console.error('Error saving admin profile during sign in:', error);
                }

                return true;
            }


            // Social Login: Upsert Profile
            try {
                const isAdmin = !!(user.email && adminEmails.includes(user.email.toLowerCase()));
                let phone: string | null = null;
                const fullName = user.name ?? null;
                const avatarUrl = user.image ?? null;

                if (provider === 'naver') {
                    const p = profile as {
                        response?: { mobile?: string; name?: string; profile_image?: string };
                        mobile?: string;
                    };
                    const data = p.response || p;
                    if (data.mobile) phone = data.mobile.replace(/-/g, '');
                } else if (provider === 'kakao') {
                    // Kakao profile structure handling
                    const p = profile as {
                        kakao_account?: {
                            phone_number?: string;
                            profile?: { nickname?: string; profile_image_url?: string }
                        };
                        phone_number?: string;
                        mobile?: string;
                    };
                    const kakaoAccount = p.kakao_account || {};

                    // Try extraction from multiple possible paths
                    phone = (
                        kakaoAccount.phone_number ||
                        p.phone_number ||
                        p.mobile ||
                        null
                    );

                    if (phone) {
                        phone = phone.startsWith('+82 ') ? '0' + phone.slice(4).replace(/-/g, '') : phone.replace(/\D/g, '');
                        if (phone.startsWith('82')) phone = '0' + phone.slice(2);
                    }
                }

                const providerAccountId = account?.providerAccountId ?? null;

                const profilePayload: Record<string, string | boolean | null | undefined> = {
                    id: user.id,
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    is_admin: isAdmin,
                    ...(provider === 'naver' && providerAccountId ? { naver_id: providerAccountId } : {}),
                };

                // Only update phone and completion status if a new phone number is actually provided by the social login.
                // This prevents overwriting an existing, manually entered phone number with null.
                if (phone) {
                    profilePayload.phone = phone;
                    profilePayload.is_profile_complete = !!(fullName && phone);
                }

                await publicClient.from('profiles').upsert(profilePayload);
            } catch (error) {
                console.error('Error saving profile during sign in:', error);
                // Don't block sign in even if profile save fails, let the client handle missing profile
            }

            return true;
        },
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
