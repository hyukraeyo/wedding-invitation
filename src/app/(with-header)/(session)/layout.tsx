import type { Metadata } from 'next';
import { getSession } from '@/lib/auth/getSession';
import HeaderProviders from '../HeaderProviders';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function SessionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // session 조회는 layout에서 필요 없다면 지울 수도 있지만 남겨둡니다 (안전)
  return <>{children}</>;
}
