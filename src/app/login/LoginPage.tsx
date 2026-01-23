"use client";

import React, { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import styles from './LoginPage.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
const ProfileCompletionModal = dynamic(
    () => import('@/components/auth/ProfileCompletionModal').then(mod => mod.ProfileCompletionModal),
    { ssr: false }
);
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { isTossApp } from '@/lib/utils';

/**
 * LoginPage: 소셜 로그인 전용 페이지
 */
export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('returnTo') || '/builder';
    const { user, profile, isProfileComplete, loading: authLoading, profileLoading, refreshProfile, signOut } = useAuth();
    const { toast } = useToast();
    const [loadingProvider, setLoadingProvider] = useState<'kakao' | 'naver' | null>(null);

    useEffect(() => {
        if (!authLoading && user && isProfileComplete) {
            if (isTossApp()) {
                window.location.replace(callbackUrl);
                return;
            }
            router.replace(callbackUrl);
        }
    }, [user, authLoading, isProfileComplete, router, callbackUrl]);

    const handleOAuthLogin = useCallback(async (provider: 'kakao' | 'naver') => {
        setLoadingProvider(provider);
        const result = await signIn(provider, { callbackUrl, redirect: false });
        if (result?.error) {
            toast({ variant: 'destructive', description: result.error });
            setLoadingProvider(null);
            return;
        }
        if (result?.url) {
            window.location.href = result.url;
        }
    }, [toast, callbackUrl]);

    // 로딩 중일 때는 빈 화면 대신 로딩 표시
    if (authLoading) {
        return <LoadingSpinner />;
    }

    // 이미 로그인하고 프로필도 완성했다면 리디렉션되므로 렌더링 안 함
    if (user && isProfileComplete) return null;



    // 로그인 상태이지만 프로필이 미완성인 경우 프로필 완성 모달 표시
    // profileLoading이 아닐 때만 표시 (로딩 중일 때는 깜빡임 방지)
    if (user?.id && !isProfileComplete && !profileLoading) {
        return (
            <div className={styles.profileCompletionOverlay}>
                <ProfileCompletionModal
                    isOpen={true}
                    userId={user.id}
                    defaultName={profile?.full_name ?? user.name ?? ''}
                    onComplete={async () => {
                        await refreshProfile();
                        router.replace(callbackUrl);
                    }}
                    onLogout={async () => {
                        await signOut();
                        router.push('/');
                    }}
                />
            </div>
        );
    }

    return (
        <>
            {/* Full Screen Loading Animation */}
            {loadingProvider ? <LoadingSpinner /> : null}

            <div className={styles.overlay}>
                <div className={styles.modal}>
                    {/* Header */}
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            바나나웨딩 시작하기 🍌
                        </h1>
                        <p className={styles.subtitle}>
                            유통기한 없는 우리만의 특별한 시작,<br />바나나웨딩과 함께 쉽고 빠르게 만들어보세요.
                        </p>
                    </div>

                    <div className={styles.socialButtons}>
                        <button
                            className={`${styles.socialButton} ${styles.kakao}`}
                            onClick={() => handleOAuthLogin('kakao')}

                            disabled={!!loadingProvider}
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" className={styles.icon}>
                                <path
                                    fill="currentColor"
                                    d="M12 3C6.477 3 2 6.916 2 11.75c0 3.06 1.77 5.794 4.545 7.425-.194.72-1.246 4.384-1.277 4.55-.045.244.09.239.376.157.172-.05 3.903-2.583 4.512-3.048.601.087 1.222.132 1.844.132 5.523 0 10-3.916 10-8.75S17.523 3 12 3z"
                                />
                            </svg>
                            <span>카카오로 시작하기</span>
                        </button>

                        <Button
                            className={`${styles.socialButton} ${styles.naver}`}
                            onClick={() => handleOAuthLogin('naver')}

                            disabled={!!loadingProvider}
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
                                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                            </svg>
                            <span>네이버로 시작하기</span>
                        </Button>
                    </div>

                    {/* Hidden Admin Login Trigger (Triple click on title to show admin login?) - For now, fully removed as requested */}

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p>
                            계속 진행함으로써 귀하는 당사의
                            <Link href="/privacy" target="_blank" className={styles.link}>
                                개인정보 처리방침
                            </Link>
                            및<br />이용약관에 동의하게 됩니다.
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className={styles.backToHomeWrapper}>
                        <Link
                            href="/"
                            className={styles.backToHomeLink}
                        >
                            ← 홈으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
