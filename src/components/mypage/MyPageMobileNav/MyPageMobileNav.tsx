"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ClipboardList, Bell, User, Menu, HelpCircle, LogOut, Sparkles } from 'lucide-react';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { MENU_TITLES } from '@/constants/navigation';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { signOut } from 'next-auth/react';
import styles from './MyPageMobileNav.module.scss';
import { clsx } from 'clsx';

interface MyPageMobileNavProps {
    isAdmin: boolean;
    invitationCount?: number;
    requestCount?: number;
    notificationCount?: number;
}

export function MyPageMobileNav({
    isAdmin,
    invitationCount = 0,
    requestCount = 0,
    notificationCount = 0,
}: MyPageMobileNavProps) {
    const pathname = usePathname();
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

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

    return (
        <>
            <nav className={styles.mobileNav}>
                <ViewTransitionLink
                    href="/mypage"
                    className={clsx(styles.navItem, pathname === '/mypage' && styles.active)}
                >
                    <User className={styles.icon} />
                    <span>마이페이지</span>
                    {invitationCount > 0 && <span className={styles.badge}>{invitationCount}</span>}
                </ViewTransitionLink>

                {isAdmin && (
                    <ViewTransitionLink
                        href="/mypage/requests"
                        className={clsx(styles.navItem, pathname === '/mypage/requests' && styles.active)}
                    >
                        <ClipboardList className={styles.icon} />
                        <span>관리</span>
                        {requestCount > 0 && <span className={styles.badge}>{requestCount}</span>}
                    </ViewTransitionLink>
                )}

                <ViewTransitionLink
                    href="/mypage/notifications"
                    className={clsx(styles.navItem, pathname === '/mypage/notifications' && styles.active)}
                >
                    <Bell className={styles.icon} />
                    <span>알림</span>
                    {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
                </ViewTransitionLink>

                <button
                    className={clsx(styles.navItem, isMoreOpen && styles.active)}
                    onClick={() => setIsMoreOpen(true)}
                >
                    <Menu className={styles.icon} />
                    <span>전체</span>
                </button>
            </nav>

            {/* "More" Drawer for Mobile */}
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

            {/* Event Modal for Mobile (Cascading from "More") */}
            <ResponsiveModal
                open={isEventModalOpen}
                onOpenChange={setIsEventModalOpen}
                title="🎁 오픈 이벤트 준비 중!"
                confirmText="확인"
                showCancel={false}
                onConfirm={() => setIsEventModalOpen(false)}
            >
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎁</div>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        다양한 혜택을 담은 이벤트를<br />열심히 준비하고 있어요!
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        곧 찾아올 특별한 소식을 기대해주세요. ✨
                    </p>
                </div>
            </ResponsiveModal>
        </>
    );
}
