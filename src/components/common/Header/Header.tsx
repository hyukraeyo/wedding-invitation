"use client";

import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Save, Banana, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { User } from 'next-auth';
import { IconButton } from '@/components/ui/IconButton';
import { Top } from '@/components/ui/Top';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useShallow } from 'zustand/react/shallow';
import styles from './Header.module.scss';

import { useHeaderStore } from '@/store/useHeaderStore';

// Lazy load Button to avoid preload warning
const Button = lazy(() => import('@/components/ui/Button').then(mod => ({ default: mod.Button })));

const Logo = React.memo(() => (
    <div className={styles.logoWrapper}>
        <Link href="/" className={styles.logoLink}>
            <Image
                src="/logo.png"
                alt="Logo"
                width={44}
                height={44}
                className={styles.logoImage}
                quality={100}
                priority
            />
        </Link>
    </div>
));
Logo.displayName = 'Logo';

interface HeaderActionsProps {
    user: User | null;
    authLoading: boolean;
    isLoading: boolean;
    isUploading: boolean;
    notificationCount: number;
    onLogin: () => void;
    onSaveAction: () => void;
    showSave: boolean;
}

const HeaderActions = React.memo(({
    user,
    authLoading,
    isLoading,
    isUploading,
    notificationCount,
    onLogin,
    onSaveAction,
    showSave
}: HeaderActionsProps) => (
    <div className={styles.actions}>
        {authLoading ? (
            <div className={styles.actionPlaceholder} />
        ) : (
            <>
                {showSave && user ? (
                    <IconButton
                        onClick={onSaveAction}
                        disabled={isLoading || isUploading}
                        iconSize={20}
                        variant="clear"
                        className={styles.actionButton}
                        aria-label="저장하기"
                        name=""
                    >
                        <Save size={20} strokeWidth={2.5} />
                    </IconButton>
                ) : null}

                {user ? (
                    <>
                        <Link href="/mypage/notifications" className={styles.notificationLink}>
                            <IconButton
                                iconSize={20}
                                variant="clear"
                                className={styles.actionButton}
                                aria-label="알림"
                                name=""
                            >
                                <Bell size={20} strokeWidth={2.5} />
                                {notificationCount > 0 && (
                                    <span className={styles.notificationBadge} />
                                )}
                            </IconButton>
                        </Link>
                        <Link href="/mypage" className={styles.profileLink}>
                            <IconButton
                                iconSize={20}
                                variant="fill"
                                className={styles.profileButton}
                                aria-label="마이페이지"
                                name=""
                            >
                                <Banana size={20} strokeWidth={2.5} />
                            </IconButton>
                        </Link>
                    </>
                ) : (
                    <IconButton
                        iconSize={20}
                        variant="clear"
                        onClick={onLogin}
                        className={styles.actionButton}
                        aria-label="로그인"
                        name=""
                    >
                        <LogIn size={20} strokeWidth={2.5} />
                    </IconButton>
                )}
            </>
        )}
    </div>
));
HeaderActions.displayName = 'HeaderActions';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // 메인 페이지('/')와 초대장 보기('/v/'), 미리보기('/preview'), 셋업('/builder/setup', '/setup')에서는 헤더를 숨깁니다.
    const isVisible = pathname !== '/' &&
        !pathname.startsWith('/v/') &&
        pathname !== '/preview' &&
        pathname !== '/builder/setup' &&
        !pathname.startsWith('/setup') &&
        !pathname.startsWith('/design-system') &&
        !pathname.startsWith('/tds');
    const { user, loading: authLoading } = useAuth();

    // Store states
    const { reset, isUploading } = useInvitationStore(useShallow((state) => ({
        reset: state.reset,
        isUploading: state.isUploading,
    })));

    const { onSave, isLoading, notificationCount } = useHeaderStore();

    const [showResetDialog, setShowResetDialog] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        router.prefetch('/login');
    }, [router]);

    const confirmReset = useCallback(() => {
        reset();
        router.push('/builder');
        setShowResetDialog(false);
    }, [reset, router]);

    const handleSaveAction = useCallback(() => {
        if (isUploading) {
            toast({
                variant: 'destructive',
                title: '이미지 업로드 중',
                description: '이미지가 완전히 업로드될 때까지 잠시만 기다려주세요.'
            });
            return;
        }
        onSave?.();
    }, [isUploading, onSave, toast]);

    const handleLogin = useCallback(() => {
        const search = searchParams.toString();
        const returnTo = `${pathname}${search ? `?${search}` : ''}`;
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }, [router, pathname, searchParams]);

    if (!isVisible) return null;

    return (
        <>
            <Top
                className={cn(styles.header, "view-transition-header")}
                title={<Logo />}
                right={
                    <HeaderActions
                        user={user}
                        authLoading={authLoading}
                        isLoading={isLoading}
                        isUploading={isUploading}
                        notificationCount={notificationCount}
                        onLogin={handleLogin}
                        onSaveAction={handleSaveAction}
                        showSave={!!onSave || pathname.startsWith('/builder')}
                    />
                }
            />
            <Modal open={showResetDialog} onOpenChange={setShowResetDialog}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header title="새 청첩장 만들기" />
                    <Modal.Body className={styles.centerBody}>
                        작성 중인 내용이 있습니다. 정말 새 청첩장을 만드시겠습니까?
                        <br />
                        (작성된 내용은 초기화됩니다.)
                    </Modal.Body>
                    <Modal.Footer>
                        <Suspense fallback={<div className={styles.suspenseFallback} />}>
                            <div className={styles.resetDialogContent}>
                                <Button
                                    color="danger"
                                    variant="fill"
                                    className={styles.confirmButton}
                                    onClick={confirmReset}
                                >
                                    초기화 및 만들기
                                </Button>
                                <Button
                                    variant="weak"
                                    className={styles.cancelButton}
                                    onClick={() => setShowResetDialog(false)}
                                >
                                    취소
                                </Button>
                            </div>
                        </Suspense>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}
