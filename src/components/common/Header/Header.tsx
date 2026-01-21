"use client";

import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Save, Banana, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from 'next-auth';
import { IconButton } from '@/components/ui/IconButton';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
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
    onSave?: (() => void) | null;
    isLoading: boolean;
    isUploading: boolean;
    notificationCount: number;
    onLogin: () => void;
    onSaveAction: () => void;
}

const HeaderActions = React.memo(({
    user,
    onSave,
    isLoading,
    isUploading,
    notificationCount,
    onLogin,
    onSaveAction
}: HeaderActionsProps) => (
    <div className={styles.actions}>
        {onSave && user ? (
            <IconButton
                icon={Save}
                onClick={onSaveAction}
                loading={isLoading || isUploading}
                size="sm"
                iconSize={20}
                strokeWidth={2.5}
                variant="ghost"
                className={styles.actionButton}
                aria-label="저장하기"
            />
        ) : null}

        {user ? (
            <>

                <Link href="/mypage/notifications" className={styles.notificationLink}>
                    <IconButton
                        icon={Bell}
                        size="sm"
                        iconSize={20}
                        strokeWidth={2.5}
                        variant="ghost"
                        className={styles.actionButton}
                        aria-label="알림"
                    >
                        {notificationCount > 0 && (
                            <span className={styles.notificationBadge} />
                        )}
                    </IconButton>
                </Link>
                <Link href="/mypage" className={styles.profileLink}>
                    <IconButton
                        icon={Banana}
                        size="sm"
                        iconSize={20}
                        strokeWidth={2.5}
                        variant="solid"
                        className={styles.profileButton}
                        aria-label="마이페이지"
                    />
                </Link>
            </>
        ) : (
            <IconButton
                icon={LogIn}
                size="sm"
                iconSize={20}
                strokeWidth={2.5}
                variant="ghost"
                onClick={onLogin}
                className={styles.actionButton}
                aria-label="로그인"
            />
        )}
    </div>
));
HeaderActions.displayName = 'HeaderActions';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    // 메인 페이지('/')에서는 헤더를 숨깁니다.
    const isVisible = pathname !== '/';
    const { user } = useAuth();

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
        router.push('/login');
    }, [router]);

    return (
        <header className={cn(styles.header, !isVisible && styles.hidden, "view-transition-header")}>
            <Logo />

            <HeaderActions
                user={user}
                onSave={onSave}
                isLoading={isLoading}
                isUploading={isUploading}
                notificationCount={notificationCount}
                onLogin={handleLogin}
                onSaveAction={handleSaveAction}
            />

            <ResponsiveModal
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title="새 청첩장 만들기"
                description={null}
            >
                <div style={{ textAlign: 'center', wordBreak: 'keep-all', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    작성 중인 내용이 있습니다. 정말 새 청첩장을 만드시겠습니까?
                    <br />
                    (작성된 내용은 초기화됩니다.)
                </div>
                <Suspense fallback={<div className={styles.suspenseFallback} />}>
                    <div className={styles.resetDialogContent}>
                        <Button
                            variant="destructive"
                            className={styles.confirmButton}
                            onClick={confirmReset}
                        >
                            초기화 및 만들기
                        </Button>
                        <Button
                            variant="ghost"
                            className={styles.cancelButton}
                            onClick={() => setShowResetDialog(false)}
                        >
                            취소
                        </Button>
                    </div>
                </Suspense>
            </ResponsiveModal>
        </header>
    );
}
