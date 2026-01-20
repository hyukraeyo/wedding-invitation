"use client";

import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FileText,
    ClipboardList,
    HelpCircle,
    User,
    LogOut,
    Banana,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
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
    userEmail?: string | null;
}

export function MyPageSidebar({
    profile,
    isAdmin,
    invitationCount = 0,
    requestCount = 0,
    // userEmail,
}: MyPageSidebarProps) {
    const pathname = usePathname();
    const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.profileSection}>
                    <div className={styles.avatar}>
                        <Banana size={24} />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {profile?.full_name || '이름 없음'}
                        </div>
                    </div>
                </div>

                <nav className={styles.menuList}>
                    <Link
                        href="/mypage"
                        className={clsx(styles.menuItem, pathname === '/mypage' && styles.active)}
                    >
                        <FileText size={20} className={styles.menuIcon} />
                        모바일 청첩장
                        {invitationCount > 0 && (
                            <span className={styles.menuBadge}>{invitationCount}</span>
                        )}
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/mypage/requests"
                            className={clsx(styles.menuItem, pathname === '/mypage/requests' && styles.active)}
                        >
                            <ClipboardList size={20} className={styles.menuIcon} />
                            신청 관리
                            {requestCount > 0 && (
                                <span className={clsx(styles.menuBadge, styles.badgeAlert)}>{requestCount}</span>
                            )}
                        </Link>
                    )}

                    <Link
                        href="/mypage/account"
                        className={clsx(styles.menuItem, pathname === '/mypage/account' && styles.active)}
                    >
                        <User size={20} className={styles.menuIcon} />
                        내 계정관리
                    </Link>

                    <button
                        className={styles.menuItem}
                        onClick={() => setIsEventModalOpen(true)}
                    >
                        <span style={{ marginRight: '0.75rem', width: '20px', display: 'flex', justifyContent: 'center' }}>🎉</span>
                        이벤트
                    </button>

                    <Link
                        href="http://pf.kakao.com/_KaiAX/chat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.menuItem}
                    >
                        <HelpCircle size={20} className={styles.menuIcon} />
                        고객센터
                    </Link>

                    <button className={styles.menuItem} onClick={handleLogout}>
                        <LogOut size={20} className={styles.menuIcon} />
                        로그아웃
                    </button>
                </nav>
            </aside>

            <ResponsiveModal
                open={isEventModalOpen}
                onOpenChange={setIsEventModalOpen}
                title="🎁 오픈 이벤트 준비 중!"
                description=""
                confirmText="확인"
                showCancel={false}
                onConfirm={() => setIsEventModalOpen(false)}
            >
                <div className={styles.eventModalContent}>
                    <div className={styles.eventIconWrapper}>
                        <span style={{ fontSize: '3rem' }}>🎁</span>
                    </div>
                    <p className={styles.eventMainText}>
                        다양한 혜택을 담은 이벤트를<br />
                        열심히 준비하고 있어요!
                    </p>
                    <p className={styles.eventSubText}>
                        곧 찾아올 특별한 소식을 기대해주세요.<br />
                        (커밍 쑨- ✨)
                    </p>
                </div>
            </ResponsiveModal>
        </>
    );
}
