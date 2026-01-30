"use client";

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { Badge } from '@/components/ui/Badge';
import React from 'react';
import { usePathname } from 'next/navigation';
import {
    FileText,
    ClipboardList,
    HelpCircle,
    User,
    LogOut,
    Banana,
    Bell,
} from 'lucide-react';
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
    const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
    const [isCustomerServiceModalOpen, setIsCustomerServiceModalOpen] = React.useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const handleCustomerServiceConfirm = () => {
        // 카카오톡 고객센터로 이동
        window.open('http://pf.kakao.com/_KaiAX/chat', '_blank', 'noopener,noreferrer');
        setIsCustomerServiceModalOpen(false);
    };

    return (
        <>
            <aside className={clsx(styles.sidebar, "view-transition-sidebar")}>
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
                    <ViewTransitionLink
                        href="/mypage"
                        className={clsx(styles.menuItem, pathname === '/mypage' && styles.active)}
                    >
                        <FileText size={20} className={styles.menuIcon} />
                        {MENU_TITLES.DASHBOARD}
                        {invitationCount > 0 && (
                            <Badge color="elephant" variant="weak" size="small" style={{ marginLeft: 'auto' }}>{invitationCount}</Badge>
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
                                <Badge color="red" variant="weak" size="small" style={{ marginLeft: 'auto' }}>{requestCount}</Badge>
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
                            <Badge color="red" variant="weak" size="small" style={{ marginLeft: 'auto' }}>{notificationCount}</Badge>
                        )}
                    </ViewTransitionLink>

                    <Button
                        variant="weak"
                        className={styles.menuItem}
                        onClick={() => setIsEventModalOpen(true)}
                        style={{ justifyContent: 'flex-start', height: 'auto', padding: '0.75rem 1rem' }}
                    >
                        <span style={{ marginRight: '0.75rem', width: '20px', display: 'flex', justifyContent: 'center' }}>🎉</span>
                        {MENU_TITLES.EVENTS}
                    </Button>

                    <Button
                        variant="weak"
                        className={styles.menuItem}
                        onClick={() => setIsCustomerServiceModalOpen(true)}
                        style={{ justifyContent: 'flex-start', height: 'auto', padding: '0.75rem 1rem' }}
                    >
                        <HelpCircle size={20} className={styles.menuIcon} />
                        {MENU_TITLES.CUSTOMER_SERVICE}
                    </Button>

                    <Button
                        variant="weak"
                        className={styles.menuItem}
                        onClick={handleLogout}
                        style={{ justifyContent: 'flex-start', height: 'auto', padding: '0.75rem 1rem' }}
                    >
                        <LogOut size={20} className={styles.menuIcon} />
                        {MENU_TITLES.LOGOUT}
                    </Button>
                </nav>
            </aside>

            <Modal open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header title="🎁 오픈 이벤트 준비 중!" />
                    <Modal.Body>
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
                    </Modal.Body>
                    <Modal.Footer className={styles.footer}>
                        <Button className={styles.fullWidth} variant="fill" size="large" onClick={() => setIsEventModalOpen(false)}>
                            확인
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Modal open={isCustomerServiceModalOpen} onOpenChange={setIsCustomerServiceModalOpen}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header title={MENU_TITLES.CUSTOMER_SERVICE} />
                    <Modal.Body>
                        <div className={styles.description}>
                            카카오톡 채널로 연결됩니다. 문의사항을 남겨주시면 빠르게 답변 드리겠습니다.
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={styles.footer}>
                        <Button className={styles.flex1} variant="weak" size="large" onClick={() => setIsCustomerServiceModalOpen(false)}>
                            닫기
                        </Button>
                        <Button className={styles.flex1} variant="fill" size="large" onClick={handleCustomerServiceConfirm}>
                            확인
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}
