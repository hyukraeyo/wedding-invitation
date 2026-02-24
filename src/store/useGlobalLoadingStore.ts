import { create } from 'zustand';

interface GlobalLoadingState {
  isLoading: boolean;
  message?: string | undefined;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  isLoading: false,
  message: undefined,
  startLoading: (message) => set({ isLoading: true, message }),
  stopLoading: () => set({ isLoading: false, message: undefined }),
}));
