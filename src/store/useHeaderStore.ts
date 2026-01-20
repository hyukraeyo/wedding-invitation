import { create } from 'zustand';

interface HeaderState {
    onSave: (() => void) | null;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    registerSaveAction: (action: (() => void) | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    onSave: null,
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    registerSaveAction: (action) => set({ onSave: action }),
}));
