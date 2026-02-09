import { getSession } from '@/lib/auth/getSession';
import { redirect } from 'next/navigation';

export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return children;
}
