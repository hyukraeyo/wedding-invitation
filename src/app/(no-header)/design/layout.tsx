import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '디자인 시스템 테스트',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DesignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isEnabled =
    process.env.ENABLE_DEV_PAGES === 'true' || process.env.NEXT_PUBLIC_ENABLE_DEV_PAGES === 'true';

  if (!isEnabled) {
    redirect('/');
  }

  return children;
}
