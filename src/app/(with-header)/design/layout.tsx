import { redirect } from 'next/navigation';

export default function DesignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isEnabled =
    process.env.ENABLE_DEV_PAGES === 'true' ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_PAGES === 'true';

  if (!isEnabled) {
    redirect('/');
  }

  return children;
}
