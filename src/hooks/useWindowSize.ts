import { useSyncExternalStore } from 'react';

/**
 * Optimized hook to get the window width.
 * Uses useSyncExternalStore for efficient updates and SSR compatibility.
 */
export function useWindowSize() {
    return useSyncExternalStore(
        (callback) => {
            if (typeof window === 'undefined') return () => { };
            window.addEventListener('resize', callback);
            return () => window.removeEventListener('resize', callback);
        },
        () => window.innerWidth,
        () => 0 // Fallback for SSR
    );
}
