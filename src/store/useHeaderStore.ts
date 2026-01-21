import { create } from 'zustand';

interface HeaderState {
    onSave: (() => void) | null;
    isLoading: boolean;
    notificationCount: number;
    setIsLoading: (loading: boolean) => void;
    setNotificationCount: (count: number) => void;
    registerSaveAction: (action: (() => void) | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    onSave: null,
    isLoading: false,
    notificationCount: 0,
    setIsLoading: (loading) => set({ isLoading: loading }),
    setNotificationCount: (count) => set({ notificationCount: count }),
    registerSaveAction: (action) => set({ onSave: action }),
}));
