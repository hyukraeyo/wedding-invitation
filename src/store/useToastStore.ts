import { create } from 'zustand';

export interface ToastData {
  id: string;
  message: string;
  title?: string | undefined;
  variant?: 'default' | 'destructive' | 'success' | 'info' | undefined;
  duration?: number | undefined;
  icon?: React.ReactNode | undefined;
}

interface ToastState {
  toasts: ToastData[];
  addToast: (message: string, options?: Omit<ToastData, 'id' | 'message'> | undefined) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, options) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, ...options }],
    }));

    const duration = options?.duration ?? 3000;
    if (duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
