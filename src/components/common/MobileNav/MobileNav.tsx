'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  Bell,
  User,
  Menu,
  HelpCircle,
  LogOut,
  Sparkles,
  Save,
  Eye,
  X,
} from 'lucide-react';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { MENU_TITLES } from '@/constants/navigation';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { signOut } from 'next-auth/react';
import styles from './MobileNav.module.scss';
import { clsx } from 'clsx';
import { useCanUseDom } from '@/hooks/useCanUseDom';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export interface MobileNavProps {
  isAdmin?: boolean;
  invitationCount?: number;
  requestCount?: number;
  notificationCount?: number;
  onSave?: () => void;
  isSaving?: boolean;
  onPreviewToggle?: () => void;
  isPreviewOpen?: boolean;
}

export function MobileNav({
  isAdmin = false,
  invitationCount = 0,
  requestCount = 0,
  notificationCount = 0,
  onSave,
  isSaving = false,
  onPreviewToggle,
  isPreviewOpen = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const canUseDOM = useCanUseDom();
  const { isVisible } = useScrollDirection();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleCustomerService = () => {
    window.open('http://pf.kakao.com/_KaiAX/chat', '_blank', 'noopener,noreferrer');
    setIsMoreOpen(false);
  };

  const handleDrawerNavClick = () => {
    setIsMoreOpen(false);
  };

  if (isPreviewOpen) {
    return null;
  }

  const navContent = (
    <>
      {!isPreviewOpen && (
        <nav className={clsx(styles.mobileNav, !isVisible && !isMoreOpen && styles.navHidden)}>
          <ViewTransitionLink
            href="/mypage"
            className={clsx(styles.navItem, pathname === '/mypage' && styles.active)}
          >
            <User className={styles.icon} />
            {invitationCount > 0 && <span className={styles.badge}>{invitationCount}</span>}
          </ViewTransitionLink>

          {isAdmin && (
            <ViewTransitionLink
              href="/mypage/requests"
              className={clsx(styles.navItem, pathname === '/mypage/requests' && styles.active)}
            >
              <ClipboardList className={styles.icon} />
              {requestCount > 0 && <span className={styles.badge}>{requestCount}</span>}
            </ViewTransitionLink>
          )}

          <ViewTransitionLink
            href="/mypage/notifications"
            className={clsx(styles.navItem, pathname === '/mypage/notifications' && styles.active)}
          >
            <Bell className={styles.icon} />
            {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
          </ViewTransitionLink>

          {onSave && (
            <IconButton
              className={clsx(styles.navItem, isSaving && styles.disabled)}
              onClick={onSave}
              disabled={isSaving || false}
              iconSize={24}
              aria-label="저장하기"
              name="save"
            >
              <Save className={styles.icon} />
            </IconButton>
          )}

          {onPreviewToggle ? (
            <IconButton
              className={clsx(
                styles.navItem,
                styles.previewButton,
                isPreviewOpen && styles.previewOpen
              )}
              onClick={onPreviewToggle}
              aria-label={isPreviewOpen ? 'Close preview' : 'Open preview'}
              iconSize={24}
              name="preview"
            >
              <span className={styles.iconSwap}>
                <Eye className={styles.iconEye} />
                <X className={styles.iconClose} />
              </span>
            </IconButton>
          ) : (
            <Dialog open={isMoreOpen} onOpenChange={setIsMoreOpen}>
              <Dialog.Trigger asChild>
                <IconButton
                  className={clsx(styles.navItem, isMoreOpen && styles.active)}
                  aria-label="메뉴 열기"
                  iconSize={24}
                  name="menu"
                >
                  <Menu className={styles.icon} />
                </IconButton>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header title="전체 메뉴" />
                <Dialog.Body className={styles.drawerPadding}>
                  <div className={styles.drawerMenu}>
                    <ViewTransitionLink
                      href="/mypage/account"
                      className={styles.drawerItem}
                      onClick={handleDrawerNavClick}
                    >
                      <User size={20} className={styles.drawerIcon} />
                      <span>계정</span>
                    </ViewTransitionLink>
                    <Dialog>
                      <Dialog.Trigger asChild>
                        <Button variant="ghost" className={styles.drawerItem}>
                          <Sparkles size={20} className={styles.drawerIcon} />
                          <span>{MENU_TITLES.EVENTS}</span>
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header title="설날 이벤트 준비중" />
                        <Dialog.Body className={styles.centerBody}>
                          <div className={styles.eventIcon}>🎁</div>
                          <p className={styles.eventTitle}>
                            다양한 혜택을 준비한 이벤트가
                            <br />
                            준비 중이에요
                          </p>
                          <p className={styles.eventDesc}>곧 찾아올 할인 혜택에 기대해주세요. 😊</p>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.Close asChild>
                            <Button
                              className={styles.fullWidth}
                              size="lg"
                              onClick={() => setIsMoreOpen(false)}
                            >
                              확인
                            </Button>
                          </Dialog.Close>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog>
                    <Button
                      variant="ghost"
                      className={styles.drawerItem}
                      onClick={handleCustomerService}
                    >
                      <HelpCircle size={20} className={styles.drawerIcon} />
                      <span>{MENU_TITLES.CUSTOMER_SERVICE}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={clsx(styles.drawerItem, styles.logoutButton)}
                      onClick={handleLogout}
                    >
                      <LogOut size={20} className={styles.drawerIcon} />
                      <span>{MENU_TITLES.LOGOUT}</span>
                    </Button>
                  </div>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog>
          )}
        </nav>
      )}

      {onPreviewToggle && (
        <IconButton
          className={clsx(
            styles.floatingPreview,
            !isVisible && !isPreviewOpen && styles.fabVisible
          )}
          onClick={onPreviewToggle}
          aria-label="Open preview"
          iconSize={24}
          name="floating-preview"
        >
          <Eye className={styles.icon} />
        </IconButton>
      )}

    </>
  );

  if (!canUseDOM) {
    return navContent;
  }

  return createPortal(navContent, document.body);
}
