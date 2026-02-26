import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const authEdgeConfig = {
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceRoleKey,
  }),
  // Keep middleware session parsing consistent with server auth config.
  // A mismatch here can cause transient unauthenticated redirects in WebView.
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [
    Credentials({
      id: 'edge-noop',
      name: 'Edge Noop',
      credentials: {},
      async authorize() {
        return null;
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

      if (isProtected) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
