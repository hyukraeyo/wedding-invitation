'use client';

import { Toaster } from '@/components/ui/Sonner';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
