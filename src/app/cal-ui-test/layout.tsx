import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '캘린더 UI 테스트',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CalUiTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
