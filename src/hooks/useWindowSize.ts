import { useSyncExternalStore } from 'react';
import { getWindowWidthSnapshot, subscribeWindowWidth } from '@/lib/client-subscriptions';

/**
 * Optimized hook to get the window width.
 * Uses useSyncExternalStore for efficient updates and SSR compatibility.
 */
export function useWindowSize() {
    return useSyncExternalStore(
        subscribeWindowWidth,
        getWindowWidthSnapshot,
        () => 0 // Fallback for SSR
    );
}
