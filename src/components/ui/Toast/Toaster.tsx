'use client';

import * as React from 'react';
import { useToastStore } from '@/store/useToastStore';
import { clsx } from 'clsx';
import s from './Toast.module.scss';

export const Toaster = () => {
    const toasts = useToastStore((state) => state.toasts);

    return (
        <div className={s.toaster}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={clsx(s.toast, toast.variant && s[toast.variant])}
                >
                    {toast.icon && <span className={s.icon}>{toast.icon}</span>}
                    <div className={s.content}>
                        {toast.title && <div className={s.title}>{toast.title}</div>}
                        <div className={s.message}>{toast.message}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
