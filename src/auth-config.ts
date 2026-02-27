import 'server-only';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import { isTossAuthReferrer } from '@/lib/toss';

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

const GUEST_EMAIL_DOMAIN = 'guest.local';
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const authConfig = {
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceRoleKey,
  }),
  session: { strategy: 'jwt' },
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
        const data =
          (profile as { response?: Record<string, string | undefined> }).response ?? profile;
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
        const account =
          (
            profile as {
              kakao_account?: {
                email?: string;
                phone_number?: string;
                profile?: { nickname?: string; profile_image_url?: string };
              };
            }
          ).kakao_account ?? {};
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
    Credentials({
      id: 'guest',
      name: 'Guest',
      credentials: {
        guestId: { label: 'Guest ID', type: 'text' },
      },
      async authorize(credentials) {
        const guestId = typeof credentials?.guestId === 'string' ? credentials.guestId.trim() : '';

        if (!UUID_V4_REGEX.test(guestId)) {
          console.warn('[GUEST_AUTH_INVALID_INPUT] guestId is missing or invalid');
          return null;
        }

        const guestEmail = `guest+${guestId}@${GUEST_EMAIL_DOMAIN}`;

        const { data: existingUser } = await nextAuthClient
          .from('users')
          .select('*')
          .eq('id', guestId)
          .maybeSingle();

        if (existingUser) {
          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name ?? '게스트 사용자',
            image: existingUser.image ?? null,
          };
        }

        const { data: newUser, error } = await nextAuthClient
          .from('users')
          .insert({
            id: guestId,
            email: guestEmail,
            name: '게스트 사용자',
            emailVerified: new Date().toISOString(),
          })
          .select()
          .single();

        if (error || !newUser) {
          console.error('[GUEST_AUTH_CREATE_USER_FAILED]', error);
          return null;
        }

        return {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name ?? '게스트 사용자',
          image: newUser.image ?? null,
        };
      },
    }),
    Credentials({
      id: 'toss',
      name: 'Toss',
      credentials: {
        authorizationCode: { label: 'Code', type: 'text' },
        referrer: { label: 'Referrer', type: 'text' },
      },
      async authorize(credentials) {
        const authorizationCode =
          typeof credentials?.authorizationCode === 'string'
            ? credentials.authorizationCode.trim()
            : '';
        const rawReferrer =
          typeof credentials?.referrer === 'string' ? credentials.referrer.trim().toUpperCase() : '';
        const referrer = isTossAuthReferrer(rawReferrer) ? rawReferrer : '';

        if (!authorizationCode || !referrer) {
          console.warn('[TOSS_AUTH_INVALID_INPUT] authorizationCode/referrer missing or invalid');
          return null;
        }

        try {
          const { decryptTossData, getTossAccessToken, getTossUserInfo } = await import(
            '@/lib/tossServer'
          );

          // 1. 토큰 교환
          const { accessToken } = await getTossAccessToken(authorizationCode, referrer);

          // 2. 사용자 정보 조회
          const userInfo = await getTossUserInfo(accessToken);

          // 3. 사용자 식별자 및 기본 정보 설정
          // 토스는 CI 등을 암호화해서 주므로, 복호화가 필요함.
          // 복호화 키가 없으면 식별자로 userKey를 사용.
          const userKey = String(userInfo.userKey);
          let name = '토스 사용자';
          let email = `${userKey}@toss.user`;

          try {
            if (userInfo.name) name = decryptTossData(userInfo.name);
            if (userInfo.email) email = userInfo.email;
          } catch (e) {
            console.warn('Toss data decryption failed, using defaults', e);
          }

          // 4. DB 사용자 연동 (기존 이메일 체크)
          const { data: existingUser } = await nextAuthClient
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (existingUser) {
            return {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name ?? name,
              image: existingUser.image ?? null,
            };
          }

          // 5. 신규 사용자 생성
          const { data: newUser, error } = await nextAuthClient
            .from('users')
            .insert({
              email,
              name,
              emailVerified: new Date().toISOString(),
            })
            .select()
            .single();

          if (error || !newUser) {
            console.error('[TOSS_AUTH_CREATE_USER_FAILED]', error);
            return null;
          }

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            image: newUser.image ?? null,
          };
        } catch (error) {
          console.error('[TOSS_AUTH_ERROR]', {
            error,
            referrer,
          });
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith('/builder') || nextUrl.pathname.startsWith('/mypage');

      console.log(
        `[AUTH_CHECK] path=${nextUrl.pathname} isLoggedIn=${isLoggedIn} userId=${auth?.user?.id}`
      );

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Triggers redirect to pages.signIn
      }
      return true;
    },
    async signIn({ user, account, profile }) {
      const provider = account?.provider;
      console.log(`[SIGN_IN] provider=${provider} userId=${user?.id} email=${user?.email}`);

      // Admin Credentials Check
      if (provider === 'credentials') {
        const isAdmin = !!(user.email && adminEmails.includes(user.email.toLowerCase()));

        try {
          await publicClient.from('profiles').upsert({
            id: user.id,
            full_name: user.name ?? (isAdmin ? 'Admin' : '토스 사용자'),
            is_admin: isAdmin,
          });
        } catch (error) {
          console.error('Error saving profile during credentials sign in:', error);
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
              profile?: { nickname?: string; profile_image_url?: string };
            };
            phone_number?: string;
            mobile?: string;
          };
          const kakaoAccount = p.kakao_account || {};

          // Try extraction from multiple possible paths
          phone = kakaoAccount.phone_number || p.phone_number || p.mobile || null;

          if (phone) {
            phone = phone.startsWith('+82 ')
              ? '0' + phone.slice(4).replace(/-/g, '')
              : phone.replace(/\D/g, '');
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

        // Toss/Guest: Skip profile completion in Toss Sandbox environment to avoid redirect issues
        if (provider === 'toss' || provider === 'guest') {
          profilePayload.is_profile_complete = true;
        }

        await publicClient.from('profiles').upsert(profilePayload);
      } catch (error) {
        console.error('Error saving profile during sign in:', error);
        // Don't block sign in even if profile save fails, let the client handle missing profile
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
