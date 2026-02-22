'use client';

import { useEffect, useRef } from 'react';
import { useHeaderData } from './HeaderDataProvider';

interface HeaderNotificationSyncProps {
  notificationCount: number;
}

export default function HeaderNotificationSync({ notificationCount }: HeaderNotificationSyncProps) {
  const { setNotificationCount } = useHeaderData();
  const lastNotificationRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastNotificationRef.current === notificationCount) return;
    lastNotificationRef.current = notificationCount;
    setNotificationCount(notificationCount);
  }, [notificationCount, setNotificationCount]);

  return null;
}
