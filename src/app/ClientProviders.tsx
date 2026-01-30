'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { useViewportHeight } from '@/hooks/use-viewport-height';
import { WarningSuppressionProvider } from '@/components/providers/WarningSuppressionProvider';
import { Toaster } from '@/components/ui/Toast';

interface ClientProvidersProps {
    children: React.ReactNode;
    session?: Session | null;
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
    useViewportHeight();

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
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
                        {children}
                        <Toaster />
                    </div>
                </QueryClientProvider>
            </SessionProvider>
        </WarningSuppressionProvider>
    );
}
