'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Menu, FileText, ClipboardList, HelpCircle, User, LogOut, Bell } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { MENU_TITLES } from '@/constants/navigation';
import { IconButton } from '@/components/ui';
import { getProfileCounts } from '@/app/actions/profile';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import styles from './ProfileMenu.module.scss';

interface ProfileMenuProps {
  notificationCount: number;
  className?: string;
}

export function ProfileMenu({ notificationCount, className }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({ isAdmin: false, invitationCount: 0, requestCount: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      getProfileCounts().then(setCounts).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Close menu on route change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleCustomerServiceConfirm = () => {
    window.open('http://pf.kakao.com/_KaiAX/chat', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <IconButton
        iconSize={24}
        className={className}
        variant="ghost"
        aria-label="마이페이지 메뉴 열기"
        name="profile-menu-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Menu size={20} strokeWidth={2.5} />
        {notificationCount > 0 && <span className={styles.notificationBadge} />}
      </IconButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={styles.dropdownMenu}
          >
            <nav className={styles.menuList}>
              <Link
                href="/mypage"
                className={clsx(styles.menuItem, pathname === '/mypage' && styles.active)}
              >
                <FileText size={20} className={styles.menuIcon} />
                {MENU_TITLES.DASHBOARD}
                {counts.invitationCount > 0 && (
                  <Badge
                    color="secondary"
                    variant="soft"
                    size="xs"
                    radius="full"
                    style={{ marginLeft: 'auto' }}
                  >
                    {counts.invitationCount}
                  </Badge>
                )}
              </Link>

              {counts.isAdmin && (
                <Link
                  href="/mypage/requests"
                  className={clsx(
                    styles.menuItem,
                    pathname === '/mypage/requests' && styles.active
                  )}
                >
                  <ClipboardList size={20} className={styles.menuIcon} />
                  {MENU_TITLES.REQUESTS}
                  {counts.requestCount > 0 && (
                    <Badge
                      color="danger"
                      variant="soft"
                      size="xs"
                      radius="full"
                      style={{ marginLeft: 'auto' }}
                    >
                      {counts.requestCount}
                    </Badge>
                  )}
                </Link>
              )}

              <Link
                href="/mypage/account"
                className={clsx(styles.menuItem, pathname === '/mypage/account' && styles.active)}
              >
                <User size={20} className={styles.menuIcon} />
                {MENU_TITLES.ACCOUNT}
              </Link>

              <Link
                href="/mypage/notifications"
                className={clsx(
                  styles.menuItem,
                  pathname === '/mypage/notifications' && styles.active
                )}
              >
                <Bell size={20} className={styles.menuIcon} />
                {MENU_TITLES.NOTIFICATIONS}
                {notificationCount > 0 && (
                  <Badge
                    color="danger"
                    variant="soft"
                    size="xs"
                    radius="full"
                    style={{ marginLeft: 'auto' }}
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Link>

              <div className={styles.divider} />

              <Dialog>
                <Dialog.Trigger asChild>
                  <Button
                    variant="ghost"
                    className={styles.menuItem}
                    style={{
                      justifyContent: 'flex-start',
                      height: 'auto',
                      padding: '0.75rem 1rem',
                    }}
                  >
                    <span
                      style={{
                        marginRight: '0.75rem',
                        width: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      🎉
                    </span>
                    {MENU_TITLES.EVENTS}
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header title="🎁 오픈 이벤트 준비 중!" />
                  <Dialog.Body>
                    <div className={styles.eventModalContent}>
                      <div className={styles.eventIconWrapper}>
                        <span style={{ fontSize: '3rem' }}>🎁</span>
                      </div>
                      <p className={styles.eventMainText}>
                        다양한 혜택을 담은 이벤트를
                        <br />
                        열심히 준비하고 있어요!
                      </p>
                      <p className={styles.eventSubText}>
                        곧 찾아올 특별한 소식을 기대해주세요.
                        <br />
                        (커밍 쑨- ✨)
                      </p>
                    </div>
                  </Dialog.Body>
                  <Dialog.Footer className={styles.footer}>
                    <Dialog.Close asChild>
                      <Button className={styles.fullWidth} size="lg">
                        확인
                      </Button>
                    </Dialog.Close>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>

              <Dialog>
                <Dialog.Trigger asChild>
                  <Button
                    variant="ghost"
                    className={styles.menuItem}
                    style={{
                      justifyContent: 'flex-start',
                      height: 'auto',
                      padding: '0.75rem 1rem',
                    }}
                  >
                    <HelpCircle size={20} className={styles.menuIcon} />
                    {MENU_TITLES.CUSTOMER_SERVICE}
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header title={MENU_TITLES.CUSTOMER_SERVICE} />
                  <Dialog.Body>
                    <div className={styles.description}>
                      카카오톡 채널로 연결돼요. 문의사항을 남겨주시면 빠르게 답변 드릴게요.
                    </div>
                  </Dialog.Body>
                  <Dialog.Footer className={styles.footer}>
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="lg">
                        닫기
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Button size="lg" onClick={handleCustomerServiceConfirm}>
                        확인
                      </Button>
                    </Dialog.Close>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>

              <div className={styles.divider} />

              <Button
                variant="ghost"
                className={styles.menuItem}
                onClick={handleLogout}
                style={{
                  justifyContent: 'flex-start',
                  height: 'auto',
                  padding: '0.75rem 1rem',
                  color: 'var(--color-error)',
                }}
              >
                <LogOut size={20} className={styles.menuIcon} />
                {MENU_TITLES.LOGOUT}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
