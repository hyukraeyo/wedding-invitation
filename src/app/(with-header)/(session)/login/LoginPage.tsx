"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heading } from '@/components/ui';
import { BananaLoader } from '@/components/ui/Loader';
import { signIn, signOut } from 'next-auth/react';
import type { User } from 'next-auth';
import styles from './LoginPage.module.scss';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { getProfileForSession, type ProfileState, type ProfileSummary } from './actions';

const ProfileCompletionModal = dynamic(
    () => import('@/components/auth/ProfileCompletionModal').then(mod => mod.ProfileCompletionModal),
    { ssr: false }
);

/**
 * LoginPage: ?뚯뀥 濡쒓렇???꾩슜 ?섏씠吏
 */
interface LoginPageProps {
    initialProfileState?: ProfileState | null;
    initialUser: User | null;
}

export default function LoginPage({ initialProfileState, initialUser }: LoginPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = useMemo(() => {
        return searchParams.get('callbackUrl') || searchParams.get('returnTo') || '/builder';
    }, [searchParams]);
    const user = initialUser;
    const userId = user?.id;

    const [profile, setProfile] = useState<ProfileSummary | null>(
        initialProfileState?.profile ?? null
    );
    const [isProfileComplete, setIsProfileComplete] = useState(
        !!initialProfileState?.isComplete
    );
    const profileFetchRef = useRef(false);

    const { toast } = useToast();
    const [loadingProvider, setLoadingProvider] = useState<'kakao' | 'naver' | null>(null);

    useEffect(() => {
        if (!userId || profile || profileFetchRef.current) return;
        profileFetchRef.current = true;
        getProfileForSession()
            .then((data) => {
                setProfile(data?.profile ?? null);
                setIsProfileComplete(!!data?.isComplete);
            })
            .finally(() => {
                profileFetchRef.current = false;
            });
    }, [userId, profile]);

    const shouldRedirect = !!user && isProfileComplete;

    useEffect(() => {
        if (shouldRedirect) {
            router.replace(callbackUrl);
        }
    }, [shouldRedirect, router, callbackUrl]);

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

    const shouldShowProfileModal = !!userId && !isProfileComplete;

    if (user && isProfileComplete) return null;

    if (shouldShowProfileModal) {
        return (
            <div className={styles.profileCompletionOverlay}>
                <ProfileCompletionModal
                    isOpen={true}
                    userId={userId!}
                    defaultName={profile?.full_name ?? user?.name ?? ''}
                    onComplete={async () => {
                        const refreshed = await getProfileForSession();
                        setProfile(refreshed?.profile ?? null);
                        setIsProfileComplete(!!refreshed?.isComplete);
                        router.replace(callbackUrl);
                    }}
                    onLogout={async () => {
                        await signOut({ callbackUrl: '/' });
                        router.push('/');
                    }}
                />
            </div>
        );
    }

    return (
        <>
            {/* Full Screen Loading Animation */}
            {loadingProvider ? <BananaLoader /> : null}

            <div className={styles.overlay}>
                <div className={styles.modal}>
                    {/* Header */}
                    <div className={styles.header}>
                        <Heading as="h1" size="7" weight="bold" className={styles.title}>
                            諛붾굹?섏썾???쒖옉?섍린 ?뜉
                        </Heading>
                        <p className={styles.subtitle}>
                            ?좏넻湲고븳 ?녿뒗 ?곕━留뚯쓽 ?밸퀎???쒖옉,<br />諛붾굹?섏썾?⑷낵 ?④퍡 ?쎄퀬 鍮좊Ⅴ寃?留뚮뱾?대낫?몄슂.
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
                            <span>移댁뭅?ㅻ줈 ?쒖옉?섍린</span>
                        </button>

                        <button
                            className={`${styles.socialButton} ${styles.naver}`}
                            onClick={() => handleOAuthLogin('naver')}
                            disabled={!!loadingProvider}
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
                                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                            </svg>
                            <span>?ㅼ씠踰꾨줈 ?쒖옉?섍린</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p>
                            怨꾩냽 吏꾪뻾?⑥쑝濡쒖뜥 洹?섎뒗 ?뱀궗??
                            <Link href="/privacy" target="_blank" className={styles.link}>
                                媛쒖씤?뺣낫 泥섎━諛⑹묠
                            </Link>
                            諛<br />?댁슜?쎄????숈쓽?섍쾶 ?⑸땲??
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className={styles.backToHomeWrapper}>
                        <Link
                            href="/"
                            className={styles.backToHomeLink}
                        >
                            ???덉쑝濡??뚯븘媛湲?
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
