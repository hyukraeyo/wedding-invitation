"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FileText,
    ClipboardList,
    HelpCircle,
    User,
    LogOut,
    Banana
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
    userEmail,
}: MyPageSidebarProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profileSection}>
                <div className={styles.avatar}>
                    <Banana size={24} />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>
                        {profile?.full_name || '이름 없음'}
                        <Link href="/mypage/account" style={{
                            fontSize: '0.75rem',
                            color: '#3B82F6',
                            fontWeight: 500,
                            marginLeft: '0.5rem',
                            textDecoration: 'none'
                        }}>
                            프로필 설정
                        </Link>
                    </div>
                    {/* <div className={styles.userEmail}>
                        {profile?.phone || userEmail || '정보 없음'}
                    </div> */}
                </div>
            </div>

            <nav className={styles.menuList}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
                    내 보관함
                </div>

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

                {/* Coming Soon Items */}
                <button className={styles.menuItem} style={{ cursor: 'default', opacity: 0.6 }}>
                    <ClipboardList size={20} className={styles.menuIcon} />
                    웨딩영상
                </button>
                <button className={styles.menuItem} style={{ cursor: 'default', opacity: 0.6 }}>
                    <FileText size={20} className={styles.menuIcon} />
                    모바일 감사장
                </button>

                <div style={{ height: '1rem' }} />

                {isAdmin && (
                    <Link
                        href="/mypage/requests"
                        className={clsx(styles.menuItem, pathname === '/mypage/requests' && styles.active)}
                    >
                        <ClipboardList size={20} className={styles.menuIcon} />
                        신청 관리
                        {requestCount > 0 && (
                            <span className={styles.menuBadge}>{requestCount}</span>
                        )}
                    </Link>
                )}

                <button className={styles.menuItem} style={{ cursor: 'default' }}>
                    <span style={{ marginRight: '0.75rem', width: '20px', display: 'inline-block' }}>🎉</span>
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

                <Link
                    href="/mypage/account"
                    className={clsx(styles.menuItem, pathname === '/mypage/account' && styles.active)}
                >
                    <User size={20} className={styles.menuIcon} />
                    내 계정관리
                </Link>
            </nav>

            <div className={styles.logoutButtonWrapper}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    <LogOut size={18} />
                    로그아웃
                </button>
            </div>
        </aside>
    );
}
