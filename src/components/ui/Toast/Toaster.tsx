'use client';

import * as React from 'react';
import { useToastStore } from '@/store/useToastStore';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast';
import s from './Toast.module.scss';

export const Toaster = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, message, variant, icon, duration, ...props }) => (
        <Toast
          key={id}
          variant={variant}
          onOpenChange={(open: boolean) => {
            if (!open) removeToast(id);
          }}
          {...(duration !== undefined ? { duration } : {})}
          {...props}
        >
          <div className={s.toastContent}>
            {icon && <div className={s.toastIcon}>{icon}</div>}
            <div className={s.grid}>
              {title && <ToastTitle>{title}</ToastTitle>}
              {message && <ToastDescription>{message}</ToastDescription>}
            </div>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};
