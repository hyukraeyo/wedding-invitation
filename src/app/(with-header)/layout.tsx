import { Suspense } from 'react';
import { getSession } from '@/lib/auth/getSession';
import { getHeaderNotificationCount } from '@/lib/header/getHeaderNotificationCount';
import Header from '@/components/common/Header';
import { CustomScrollbar } from '@/components/common/CustomScrollbar';
import { HeaderDataProvider } from '@/components/common/Header/HeaderDataProvider';
import { detectRequestEnvironment } from '@/lib/requestEnvironment';
import { headers } from 'next/headers';
import HeaderProviders from './HeaderProviders';

export default async function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const headerList = await headers();
  const { isToss } = detectRequestEnvironment(headerList.get('user-agent') || '');

  const initialNotificationCount = await getHeaderNotificationCount(session);

  return (
    <>
      <HeaderProviders session={session}>
        <HeaderDataProvider
          user={session?.user ?? null}
          authLoading={false}
          initialNotificationCount={initialNotificationCount}
        >
          {!isToss ? (
            <Suspense fallback={null}>
              <CustomScrollbar />
            </Suspense>
          ) : null}
          <Header initialIsToss={isToss} />
          {children}
        </HeaderDataProvider>
      </HeaderProviders>
    </>
  );
}
