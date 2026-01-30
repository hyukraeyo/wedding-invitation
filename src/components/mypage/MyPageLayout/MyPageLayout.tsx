"use client";

import React from 'react';
import { MyPageSidebar } from '@/components/mypage/MyPageSidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { useHeaderStore } from '@/store/useHeaderStore';
import { usePathname } from 'next/navigation';
import { MENU_TITLES } from '@/constants/navigation';
import styles from './MyPageLayout.module.scss';
import { Flex, Box } from '@/components/ui';

interface ProfileSummary {
    full_name: string | null;
    phone: string | null;
    email?: string | null;
}

interface MyPageLayoutProps {
    children: React.ReactNode;
    profile: ProfileSummary | null;
    isAdmin: boolean;
    invitationCount?: number;
    requestCount?: number;
    notificationCount?: number;
}

/**
 * 🍌 경로별 타이틀 매핑
 */
const ROUTE_TITLES: Record<string, string> = {
    // '/mypage': MENU_TITLES.DASHBOARD, // Dashboard will handle its own header for toggle actions
    '/mypage/account': MENU_TITLES.ACCOUNT,
    '/mypage/notifications': MENU_TITLES.NOTIFICATIONS,
    '/mypage/requests': MENU_TITLES.REQUESTS,
};

export function MyPageLayout({
    children,
    profile,
    isAdmin,
    invitationCount = 0,
    requestCount = 0,
    notificationCount = 0,
}: MyPageLayoutProps) {
    const pathname = usePathname();
    const setNotificationCount = useHeaderStore(state => state.setNotificationCount);

    // 현재 경로에 맞는 타이틀 가져오기 (기본값은 빈 문자열)
    const currentTitle = ROUTE_TITLES[pathname] || '';

    // Sync notification count with global header store
    React.useEffect(() => {
        setNotificationCount(notificationCount);
    }, [notificationCount, setNotificationCount]);

    return (
        <Flex direction="column" className={styles.pageContainer}>
            <Flex className={styles.layout}>
                <MyPageSidebar
                    profile={profile}
                    isAdmin={isAdmin}
                    invitationCount={invitationCount}
                    requestCount={requestCount}
                    notificationCount={notificationCount}
                />
                <Box as="main" className={styles.mainContent}>
                    {/* 공통 헤더: 레이아웃에서 통합 관리 */}
                    {currentTitle && (
                        <Box className={styles.pageHeader}>
                            <MyPageHeader title={currentTitle} />
                        </Box>
                    )}

                    <Box className={styles.childrenWrapper}>
                        {children}
                    </Box>
                </Box>
            </Flex>
            <MobileNav
                isAdmin={isAdmin}
                invitationCount={invitationCount}
                requestCount={requestCount}
                notificationCount={notificationCount}
            />
        </Flex>
    );
}
