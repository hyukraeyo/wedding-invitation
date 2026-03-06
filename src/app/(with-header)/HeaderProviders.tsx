'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface HeaderProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function HeaderProviders({ children, session }: HeaderProvidersProps) {
  return (
    <SessionProvider session={session ?? null} refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
