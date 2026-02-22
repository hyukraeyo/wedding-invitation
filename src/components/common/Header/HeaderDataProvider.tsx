'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { User } from 'next-auth';

interface HeaderDataContextValue {
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  user: User | null;
  authLoading: boolean;
}

const HeaderDataContext = createContext<HeaderDataContextValue | null>(null);

interface HeaderDataProviderProps {
  children: React.ReactNode;
  user: User | null;
  authLoading?: boolean;
  initialNotificationCount?: number;
}

export function HeaderDataProvider({
  children,
  user,
  authLoading = false,
  initialNotificationCount = 0,
}: HeaderDataProviderProps) {
  const [notificationCount, setNotificationCount] = useState(initialNotificationCount);

  const value = useMemo(
    () => ({
      notificationCount,
      setNotificationCount,
      user,
      authLoading,
    }),
    [notificationCount, user, authLoading]
  );

  return <HeaderDataContext.Provider value={value}>{children}</HeaderDataContext.Provider>;
}

export function useHeaderData() {
  const context = useContext(HeaderDataContext);
  if (!context) {
    return {
      notificationCount: 0,
      setNotificationCount: () => {},
      user: null,
      authLoading: false,
    };
  }
  return context;
}
