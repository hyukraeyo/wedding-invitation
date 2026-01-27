'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/Sonner';
import { useViewportHeight } from '@/hooks/use-viewport-height';

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
        <SessionProvider session={sessionValue}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
            </QueryClientProvider>
        </SessionProvider>
    );
}
