"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { ClipboardList, Bell, User, Menu, HelpCircle, LogOut, Sparkles, Save, Eye, X } from 'lucide-react';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { MENU_TITLES } from '@/constants/navigation';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { signOut } from 'next-auth/react';
import styles from './MobileNav.module.scss';
import { clsx } from 'clsx';
import { useCanUseDom } from '@/hooks/useCanUseDom';

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
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const canUseDOM = useCanUseDom();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const handleCustomerService = () => {
        window.open('http://pf.kakao.com/_KaiAX/chat', '_blank', 'noopener,noreferrer');
        setIsMoreOpen(false);
    };

    const handleEventClick = () => {
        setIsMoreOpen(false);
        setIsEventModalOpen(true);
    };

    const handleDrawerNavClick = () => {
        setIsMoreOpen(false);
    };

    const isPreviewMode = Boolean(onPreviewToggle) && isPreviewOpen;

    const navContent = (
        <>
            <nav className={clsx(
                styles.mobileNav,
                isPreviewMode && styles.previewMode,
                onPreviewToggle && styles.hasPreviewAction
            )}>
                <ViewTransitionLink
                    href="/mypage"
                    className={clsx(
                        styles.navItem,
                        pathname === '/mypage' && styles.active,
                        isPreviewMode && styles.navItemHidden
                    )}
                >
                    <User className={styles.icon} />
                    {invitationCount > 0 && <span className={styles.badge}>{invitationCount}</span>}
                </ViewTransitionLink>

                {isAdmin && (
                    <ViewTransitionLink
                        href="/mypage/requests"
                        className={clsx(
                            styles.navItem,
                            pathname === '/mypage/requests' && styles.active,
                            isPreviewMode && styles.navItemHidden
                        )}
                    >
                        <ClipboardList className={styles.icon} />
                        {requestCount > 0 && <span className={styles.badge}>{requestCount}</span>}
                    </ViewTransitionLink>
                )}

                <ViewTransitionLink
                    href="/mypage/notifications"
                    className={clsx(
                        styles.navItem,
                        pathname === '/mypage/notifications' && styles.active,
                        isPreviewMode && styles.navItemHidden
                    )}
                >
                    <Bell className={styles.icon} />
                    {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
                </ViewTransitionLink>

                {onSave && (
                    <button
                        className={clsx(
                            styles.navItem,
                            isSaving && styles.disabled,
                            isPreviewMode && styles.navItemHidden
                        )}
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        <Save className={styles.icon} />
                    </button>
                )}

                {onPreviewToggle ? (
                    <button
                        className={clsx(styles.navItem, styles.previewButton, isPreviewOpen && styles.previewOpen)}
                        onClick={onPreviewToggle}
                        aria-label={isPreviewOpen ? 'Close preview' : 'Open preview'}
                    >
                        <span className={styles.iconSwap}>
                            <Eye className={styles.iconEye} />
                            <X className={styles.iconClose} />
                        </span>
                    </button>
                ) : (
                    <button
                        className={clsx(styles.navItem, isMoreOpen && styles.active, isPreviewMode && styles.navItemHidden)}
                        onClick={() => setIsMoreOpen(true)}
                    >
                        <Menu className={styles.icon} />
                    </button>
                )}
            </nav>
            {!onPreviewToggle && (
                <>
                    <ResponsiveModal
                        open={isMoreOpen}
                        onOpenChange={setIsMoreOpen}
                        title="전체 메뉴"
                        showCancel={false}
                    >
                        <div className={styles.drawerContent}>
                            <div className={styles.drawerMenu}>
                                <ViewTransitionLink
                                    href="/mypage/account"
                                    className={styles.drawerItem}
                                    onClick={handleDrawerNavClick}
                                >
                                    <User size={20} className={styles.drawerIcon} />
                                    <span>계정</span>
                                </ViewTransitionLink>
                                <button className={styles.drawerItem} onClick={handleEventClick}>
                                    <Sparkles size={20} className={styles.drawerIcon} />
                                    <span>{MENU_TITLES.EVENTS}</span>
                                </button>
                                <button className={styles.drawerItem} onClick={handleCustomerService}>
                                    <HelpCircle size={20} className={styles.drawerIcon} />
                                    <span>{MENU_TITLES.CUSTOMER_SERVICE}</span>
                                </button>
                                <button className={clsx(styles.drawerItem, styles.logoutButton)} onClick={handleLogout}>
                                    <LogOut size={20} className={styles.drawerIcon} />
                                    <span>{MENU_TITLES.LOGOUT}</span>
                                </button>
                            </div>
                        </div>
                    </ResponsiveModal>

                    <ResponsiveModal
                        open={isEventModalOpen}
                        onOpenChange={setIsEventModalOpen}
                        title="설날 이벤트 준비중"
                        confirmText="확인"
                        showCancel={false}
                        onConfirm={() => setIsEventModalOpen(false)}
                    >
                        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎁</div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                다양한 혜택을 준비한 이벤트가
                                <br />
                                준비중입니다
                            </p>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                곧 찾아올 할인 혜택에 기대해주세요. 😊
                            </p>
                        </div>
                    </ResponsiveModal>
                </>
            )}
        </>
    );

    if (!canUseDOM) {
        return navContent;
    }

    return createPortal(navContent, document.body);
}
