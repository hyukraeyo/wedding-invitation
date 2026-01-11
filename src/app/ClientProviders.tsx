'use client';

import { ToastProvider } from '@/components/common/Toast';
import { TDSMobileProvider } from '@toss/tds-mobile';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <TDSMobileProvider
            userAgent={{
                isAndroid: false,
                isIOS: false,
                colorPreference: 'light',
                fontScale: 100,
                fontA11y: undefined,
            }}
        >
            <ToastProvider>
                {children}
            </ToastProvider>
        </TDSMobileProvider>
    );
}
