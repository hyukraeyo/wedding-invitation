'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { useViewportHeight } from '@/hooks/use-viewport-height';
import { WarningSuppressionProvider } from '@/components/providers/WarningSuppressionProvider';

import { TDSMobileProvider } from '@toss/tds-mobile';

interface ClientProvidersProps {
    children: React.ReactNode;
    session?: Session | null;
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
    useViewportHeight();

    // rerender-lazy-state-init: Expensive QueryClient initialization in function
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // client-swr-dedup: Enable automatic request deduplication
                staleTime: 60 * 1000, // 1 minute
                gcTime: 1000 * 60 * 60 * 24, // 24 hours
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    }));

    const sessionValue = session ?? null;

    return (
        <WarningSuppressionProvider>
            <SessionProvider session={sessionValue}>
                <QueryClientProvider client={queryClient}>
                    <div suppressHydrationWarning style={{ display: 'contents' }}>
                        <TDSMobileProvider
                            userAgent={{ isIOS: true, isAndroid: false, fontScale: 1, fontA11y: undefined }}
                            config={{}}
                        >
                            {children}
                        </TDSMobileProvider>
                    </div>
                </QueryClientProvider>
            </SessionProvider>
        </WarningSuppressionProvider>
    );
}

