'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/Sonner';

import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';

interface ClientProvidersProps {
    children: React.ReactNode;
    session?: Session | null;
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sessionValue = session ?? null;
    const isTossApp = typeof window !== 'undefined' && /TossApp/i.test(navigator.userAgent);

    const content = (
        <SessionProvider session={sessionValue}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
            </QueryClientProvider>
        </SessionProvider>
    );

    // Initial render (server & client) should be consistent
    if (!mounted) {
        return content;
    }

    if (isTossApp) {
        return (
            <TDSMobileAITProvider>
                {content}
            </TDSMobileAITProvider>
        );
    }

    return content;
}
