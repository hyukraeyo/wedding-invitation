'use client';

import React from 'react';
import { toast } from 'sonner';

// Compatibility wrapper for components using the old Toast interface
export const useToast = () => {
    return {
        showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
            switch (type) {
                case 'success':
                    toast.success(message);
                    break;
                case 'error':
                    toast.error(message);
                    break;
                case 'warning':
                    toast.warning(message);
                    break;
                case 'info':
                    toast.info(message);
                    break;
                default:
                    toast(message);
            }
        },
        success: (message: string) => {
            toast.success(message);
        },
        error: (message: string) => {
            toast.error(message);
        },
        warning: (message: string) => {
            toast.warning(message);
        },
        info: (message: string) => {
            toast.info(message);
        }
    };
};

// Deprecated Provider - renders nothing or just children, since Toaster is handled globally
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};
