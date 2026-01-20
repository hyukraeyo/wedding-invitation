"use client";

import React, { useEffect, useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, LogIn, Save, Banana } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useRouter, usePathname } from 'next/navigation';
import { IconButton } from '@/components/ui/IconButton';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useShallow } from 'zustand/react/shallow';
import styles from './Header.module.scss';

// Lazy load Button to avoid preload warning (Button is only used inside modal)
const Button = lazy(() => import('@/components/ui/Button').then(mod => ({ default: mod.Button })));

interface HeaderProps {
    onSave?: () => void;
    onLogin?: () => void;
    isLoading?: boolean;
}

export default function Header({ onSave, onLogin, isLoading }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isMyPage = pathname?.startsWith('/mypage');
    const { user } = useAuth();
    const { reset, isUploading } = useInvitationStore(useShallow((state) => ({
        reset: state.reset,
        isUploading: state.isUploading,
    })));
    const [showResetDialog, setShowResetDialog] = useState(false);
    const isVisible = true; // Always visible as per user request
    const { toast } = useToast();

    useEffect(() => {
        router.prefetch('/login');
    }, [router]);


    const handleCreateNew = () => {
        const state = useInvitationStore.getState();

        // 마이페이지에서는 바로 초기화하고 빌더로 이동
        if (isMyPage) {
            reset();
            router.push('/builder');
            return;
        }

        const hasActualContent =
            state.groom.firstName !== '' ||
            state.bride.firstName !== '' ||
            state.location !== '' ||
            state.imageUrl !== null ||
            state.gallery.length > 0;

        if (hasActualContent) {
            setShowResetDialog(true);
        } else {
            reset();
            router.push('/builder');
        }
    };

    const confirmReset = () => {
        reset();
        router.push('/builder');
        setShowResetDialog(false);
    };

    const handleSave = () => {
        if (isUploading) {
            toast({
                variant: 'destructive',
                title: '이미지 업로드 중',
                description: '이미지가 완전히 업로드될 때까지 잠시만 기다려주세요.'
            });
            return;
        }
        onSave?.();
    };

    return (
        <header className={cn(styles.header, !isVisible && styles.hidden)}>
            {/* Logo */}
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

            {/* Actions */}
            <div className={styles.actions}>
                {onSave && user ? (
                    <IconButton
                        icon={Save}
                        onClick={handleSave}
                        loading={isLoading || isUploading}
                        size="md"
                        variant="ghost"
                        className={styles.saveButton}
                        aria-label="저장하기"
                    />
                ) : null}

                {user ? (
                    <>
                        {isMyPage && (
                            <IconButton
                                icon={Plus}
                                size="md"
                                variant="ghost"
                                onClick={handleCreateNew}
                                aria-label="새 청첩장 만들기"
                            />
                        )}
                        <Link href="/mypage">
                            <div className={styles.profileIcon} aria-label="마이페이지">
                                <Banana size={20} strokeWidth={2.5} />
                            </div>
                        </Link>
                    </>
                ) : (
                    onLogin ? (
                        <IconButton
                            icon={LogIn}
                            size="md"
                            variant="ghost"
                            onClick={onLogin}
                            aria-label="로그인"
                        />
                    ) : null
                )}
            </div>

            <ResponsiveModal
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title="새 청첩장 만들기"
                description={
                    <>
                        작성 중인 내용이 있습니다. 정말 새 청첩장을 만드시겠습니까?
                        <br />
                        (작성된 내용은 초기화됩니다.)
                    </>
                }
            >
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
