"use client";

import React from 'react';
import { MyPageSidebar } from '@/components/mypage/MyPageSidebar';
import { useHeaderStore } from '@/store/useHeaderStore';
import styles from './MyPageLayout.module.scss';

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

export function MyPageLayout({
    children,
    profile,
    isAdmin,
    invitationCount = 0,
    requestCount = 0,
    notificationCount = 0,
}: MyPageLayoutProps) {
    const setNotificationCount = useHeaderStore(state => state.setNotificationCount);

    // Sync notification count with global header store
    React.useEffect(() => {
        setNotificationCount(notificationCount);
    }, [notificationCount, setNotificationCount]);
    return (
        <div className={styles.pageContainer}>
            <div className={styles.layout}>
                <MyPageSidebar
                    profile={profile}
                    isAdmin={isAdmin}
                    invitationCount={invitationCount}
                    requestCount={requestCount}
                    notificationCount={notificationCount}
                />
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
