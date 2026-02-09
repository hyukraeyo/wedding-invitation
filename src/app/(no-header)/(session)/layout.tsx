import { getSession } from '@/lib/auth/getSession';
import HeaderProviders from '@/app/(with-header)/HeaderProviders';

export default async function SessionLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();

    return (
        <HeaderProviders session={session}>
            {children}
        </HeaderProviders>
    );
}
