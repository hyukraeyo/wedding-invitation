'use client';

import React from 'react';
import { useToast as useShadcnToast } from '@/hooks/use-toast';
import { Check, X, AlertCircle, Info } from 'lucide-react';

// Compatibility wrapper for components using the old Toast interface
export const useToast = () => {
    const { toast } = useShadcnToast();

    return {
        showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
            const variant = type === 'error' ? 'destructive' : 'default';
            // You can customize title/description mapping here
            // For simple message toast, we use description
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        {type === 'success' && <Check size={16} className="text-green-500" />}
                        {type === 'error' && <X size={16} />}
                        {type === 'warning' && <AlertCircle size={16} className="text-yellow-500" />}
                        {type === 'info' && <Info size={16} className="text-blue-500" />}
                        <span>{message}</span>
                    </div>
                ),
                variant: variant
            });
        },
        success: (message: string) => {
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>{message}</span>
                    </div>
                ),
            });
        },
        error: (message: string) => {
            toast({
                variant: "destructive",
                description: (
                    <div className="flex items-center gap-2">
                        <X size={16} />
                        <span>{message}</span>
                    </div>
                ),
            });
        },
        warning: (message: string) => {
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-yellow-500" />
                        <span>{message}</span>
                    </div>
                ),
            });
        },
        info: (message: string) => {
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-500" />
                        <span>{message}</span>
                    </div>
                ),
            });
        }
    };
};

// Deprecated Provider - renders nothing or just children, since Toaster is handled globally
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};
