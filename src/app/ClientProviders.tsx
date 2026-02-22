'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useViewportHeight } from '@/hooks/use-viewport-height';
import { WarningSuppressionProvider } from '@/components/providers/WarningSuppressionProvider';
import { Toaster } from '@/components/ui/Toast';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  useViewportHeight();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <WarningSuppressionProvider>
      <QueryClientProvider client={queryClient}>
        <div suppressHydrationWarning style={{ display: 'contents' }}>
          {children}
          <Toaster />
        </div>
      </QueryClientProvider>
    </WarningSuppressionProvider>
  );
}
