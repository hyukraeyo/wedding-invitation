import { create } from 'zustand';

interface HeaderState {
    onSave: (() => void) | null;
    isLoading: boolean;
    notificationCount: number;
    title: string | null;
    showBack: boolean;
    onBack: (() => void) | null;
    progress: number | null;
    setIsLoading: (loading: boolean) => void;
    setNotificationCount: (count: number) => void;
    registerSaveAction: (action: (() => void) | null) => void;
    setHeader: (config: { title?: string | null; showBack?: boolean; onBack?: (() => void) | null; progress?: number | null }) => void;
    resetHeader: () => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    onSave: null,
    isLoading: false,
    notificationCount: 0,
    title: null,
    showBack: false,
    onBack: null,
    progress: null,
    setIsLoading: (loading) => set({ isLoading: loading }),
    setNotificationCount: (count) => set({ notificationCount: count }),
    registerSaveAction: (action) => set({ onSave: action }),
    setHeader: (config) => set((state) => ({ ...state, ...config })),
    resetHeader: () => set({ title: null, showBack: false, onBack: null, onSave: null, progress: null }),
}));
