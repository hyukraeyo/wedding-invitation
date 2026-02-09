'use client';

import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { Badge } from '@/components/ui/Badge';
import { usePathname } from 'next/navigation';
import { FileText, ClipboardList, HelpCircle, User, LogOut, Banana, Bell } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { MENU_TITLES } from '@/constants/navigation';
import styles from './MyPageSidebar.module.scss';
import { clsx } from 'clsx';

interface ProfileSummary {
  full_name: string | null;
  phone: string | null;
  email?: string | null;
}

interface MyPageSidebarProps {
  profile: ProfileSummary | null;
  isAdmin: boolean;
  invitationCount?: number;
  requestCount?: number;
  notificationCount?: number;
  userEmail?: string | null;
}

export function MyPageSidebar({
  profile,
  isAdmin,
  invitationCount = 0,
  requestCount = 0,
  notificationCount = 0,
  // userEmail,
}: MyPageSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleCustomerServiceConfirm = () => {
    // 카카오톡 고객센터로 이동
    window.open('http://pf.kakao.com/_KaiAX/chat', '_blank', 'noopener,noreferrer');
  };

  return (
    <aside className={clsx(styles.sidebar, 'view-transition-sidebar')}>
      <nav className={styles.menuList}>
        <ViewTransitionLink
          href="/mypage"
          className={clsx(styles.menuItem, pathname === '/mypage' && styles.active)}
        >
          <FileText size={20} className={styles.menuIcon} />
          {MENU_TITLES.DASHBOARD}
          {invitationCount > 0 && (
            <Badge
              color="secondary"
              variant="soft"
              size="xs"
              radius="full"
              style={{ marginLeft: 'auto' }}
            >
              {invitationCount}
            </Badge>
          )}
        </ViewTransitionLink>

        {isAdmin && (
          <ViewTransitionLink
            href="/mypage/requests"
            className={clsx(styles.menuItem, pathname === '/mypage/requests' && styles.active)}
          >
            <ClipboardList size={20} className={styles.menuIcon} />
            {MENU_TITLES.REQUESTS}
            {requestCount > 0 && (
              <Badge
                color="danger"
                variant="soft"
                size="xs"
                radius="full"
                style={{ marginLeft: 'auto' }}
              >
                {requestCount}
              </Badge>
            )}
          </ViewTransitionLink>
        )}

        <ViewTransitionLink
          href="/mypage/account"
          className={clsx(styles.menuItem, pathname === '/mypage/account' && styles.active)}
        >
          <User size={20} className={styles.menuIcon} />
          {MENU_TITLES.ACCOUNT}
        </ViewTransitionLink>

        <ViewTransitionLink
          href="/mypage/notifications"
          className={clsx(styles.menuItem, pathname === '/mypage/notifications' && styles.active)}
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
        </ViewTransitionLink>

        <Dialog>
          <Dialog.Trigger asChild>
            <Button
              variant="ghost"
              className={styles.menuItem}
              style={{ justifyContent: 'flex-start', height: 'auto', padding: '0.75rem 1rem' }}
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
              style={{ justifyContent: 'flex-start', height: 'auto', padding: '0.75rem 1rem' }}
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

        <Button
          variant="ghost"
          className={styles.menuItem}
          onClick={handleLogout}
          style={{ justifyContent: 'flex-start', height: 'auto', padding: '0.75rem 1rem' }}
        >
          <LogOut size={20} className={styles.menuIcon} />
          {MENU_TITLES.LOGOUT}
        </Button>
      </nav>
    </aside>
  );
}
