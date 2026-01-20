"use client";

import React from 'react';
import Header from '@/components/common/Header';
import { MyPageSidebar } from '@/components/mypage/MyPageSidebar';
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
}

export function MyPageLayout({
    children,
    profile,
    isAdmin,
    invitationCount = 0,
    requestCount = 0,
}: MyPageLayoutProps) {
    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.layout}>
                <MyPageSidebar
                    profile={profile}
                    isAdmin={isAdmin}
                    invitationCount={invitationCount}
                    requestCount={requestCount}
                />
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
