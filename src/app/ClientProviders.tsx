'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/Sonner';

export default function ClientProviders({ children, session }: { children: React.ReactNode, session?: any }) {
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

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
            </QueryClientProvider>
        </SessionProvider>
    );
}
