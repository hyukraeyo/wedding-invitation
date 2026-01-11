'use client';

import { Toaster } from '@/components/ui/toaster';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
