import { Suspense } from 'react';
import { getSession } from '@/lib/auth/getSession';
import { getHeaderNotificationCount } from '@/lib/header/getHeaderNotificationCount';
import Header from '@/components/common/Header';
import { CustomScrollbar } from '@/components/common/CustomScrollbar';
import { HeaderDataProvider } from '@/components/common/Header/HeaderDataProvider';

export default async function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  const initialNotificationCount = await getHeaderNotificationCount(session);

  return (
    <>
      <HeaderDataProvider
        user={session?.user ?? null}
        authLoading={false}
        initialNotificationCount={initialNotificationCount}
      >
        <Suspense fallback={null}>
          <CustomScrollbar />
        </Suspense>
        <Header />
        {children}
      </HeaderDataProvider>
    </>
  );
}
