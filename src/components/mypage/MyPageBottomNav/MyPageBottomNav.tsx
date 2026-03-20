'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, ClipboardList, User, Bell } from 'lucide-react';
import { MENU_TITLES } from '@/constants/navigation';
import { Badge } from '@/components/ui/Badge';
import { clsx } from 'clsx';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';
import styles from './MyPageBottomNav.module.scss';

interface MyPageBottomNavProps {
  isAdmin: boolean;
  invitationCount: number;
  requestCount: number;
  notificationCount: number;
}

export function MyPageBottomNav({
  isAdmin,
  invitationCount,
  requestCount,
  notificationCount,
}: MyPageBottomNavProps) {
  const isToss = useTossEnvironment();
  const pathname = usePathname();

  if (!isToss) return null;

  return (
    <nav className={styles.bottomNav}>
      <Link
        href="/mypage"
        className={clsx(styles.navItem, pathname === '/mypage' ? styles.active : '')}
      >
        <div className={styles.iconWrapper}>
          <FileText size={24} className={styles.icon} strokeWidth={pathname === '/mypage' ? 2.5 : 2} />
          {invitationCount > 0 && <span className={styles.dotBadge} />}
        </div>
        <span className={styles.label}>{MENU_TITLES.DASHBOARD}</span>
      </Link>

      {isAdmin && (
        <Link
          href="/mypage/requests"
          className={clsx(styles.navItem, pathname === '/mypage/requests' ? styles.active : '')}
        >
          <div className={styles.iconWrapper}>
            <ClipboardList size={24} className={styles.icon} strokeWidth={pathname === '/mypage/requests' ? 2.5 : 2} />
            {requestCount > 0 && (
              <Badge color="danger" variant="solid" size="xs" radius="full" className={styles.numberBadge}>
                {requestCount > 99 ? '99+' : requestCount}
              </Badge>
            )}
          </div>
          <span className={styles.label}>{MENU_TITLES.REQUESTS}</span>
        </Link>
      )}

      <Link
        href="/mypage/account"
        className={clsx(styles.navItem, pathname === '/mypage/account' ? styles.active : '')}
      >
        <div className={styles.iconWrapper}>
          <User size={24} className={styles.icon} strokeWidth={pathname === '/mypage/account' ? 2.5 : 2} />
        </div>
        <span className={styles.label}>{MENU_TITLES.ACCOUNT}</span>
      </Link>

      <Link
        href="/mypage/notifications"
        className={clsx(styles.navItem, pathname === '/mypage/notifications' ? styles.active : '')}
      >
        <div className={styles.iconWrapper}>
          <Bell size={24} className={styles.icon} strokeWidth={pathname === '/mypage/notifications' ? 2.5 : 2} />
          {notificationCount > 0 && (
            <Badge color="danger" variant="solid" size="xs" radius="full" className={styles.numberBadge}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
        </div>
        <span className={styles.label}>{MENU_TITLES.NOTIFICATIONS}</span>
      </Link>
    </nav>
  );
}
