import { useSyncExternalStore } from 'react';
import { getMediaQuerySnapshot, subscribeMediaQuery } from '@/lib/client-subscriptions';

export function useMediaQuery(query: string, initialValue: boolean = false) {
  const getServerSnapshot = () => {
    return initialValue;
  };

  // SSR safe implementation
  return useSyncExternalStore(
    (callback) => subscribeMediaQuery(query, callback),
    () => getMediaQuerySnapshot(query),
    getServerSnapshot
  );
}
