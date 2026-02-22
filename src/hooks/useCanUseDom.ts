'use client';

import { useSyncExternalStore } from 'react';

export function useCanUseDom(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
