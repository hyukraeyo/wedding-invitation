import { create } from 'zustand';

export interface ToastData {
    id: string;
    message: string;
    variant?: 'default' | 'destructive' | 'success';
    duration?: number;
}

interface ToastState {
    toasts: ToastData[];
    addToast: (message: string, options?: Omit<ToastData, 'id' | 'message'>) => void;
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
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
