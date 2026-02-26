'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import type { User } from 'next-auth';

import { Heading } from '@/components/ui';
import { BananaLoader } from '@/components/ui/Loader';
import { useToast } from '@/hooks/use-toast';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';
import styles from './LoginPage.module.scss';
import { getProfileForSession, type ProfileState, type ProfileSummary } from './actions';

const ProfileCompletionModal = dynamic(
  () =>
    import('@/components/auth/ProfileCompletionModal').then((mod) => mod.ProfileCompletionModal),
  { ssr: false }
);

/**
 * LoginPage: 소셜 로그인 전용 페이지
 */
interface LoginPageProps {
  initialProfileState?: ProfileState | null;
  initialUser: User | null;
}

export default function LoginPage({ initialProfileState, initialUser }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isToss = useTossEnvironment();
  const callbackUrl = useMemo(() => {
    return searchParams.get('callbackUrl') || searchParams.get('returnTo') || '/';
  }, [searchParams]);
  const user = initialUser;
  const userId = user?.id;

  const [profile, setProfile] = useState<ProfileSummary | null>(
    initialProfileState?.profile ?? null
  );
  const [isProfileComplete, setIsProfileComplete] = useState(!!initialProfileState?.isComplete);
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

  const handleOAuthLogin = useCallback(
    async (provider: 'kakao' | 'naver') => {
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
    },
    [toast, callbackUrl]
  );

  const [isTossLoading, setIsTossLoading] = useState(false);

  const handleTossLogin = useCallback(async () => {
    if (isTossLoading) return;
    setIsTossLoading(true);
    try {
      const { appLogin } = await import('@apps-in-toss/web-framework');
      const { authorizationCode, referrer } = await appLogin();

      const result = await signIn('toss', {
        authorizationCode,
        referrer,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: '토스 로그인 실패',
          description: '잠시 후 다시 시도해 주세요.',
          variant: 'destructive',
        });
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Toss login error:', error);
      // 에러 무시 (사용자가 직접 버튼 누를 수 있게 함)
    } finally {
      setIsTossLoading(false);
    }
  }, [callbackUrl, router, toast, isTossLoading]);

  // 토스 환경 진입 시 자동 로그인 시도
  useEffect(() => {
    if (isToss && !userId && !isTossLoading) {
      handleTossLogin();
    }
  }, [isToss, userId, handleTossLogin, isTossLoading]);

  if (user && isProfileComplete) return null;

  const shouldShowProfileModal = !!userId && !isProfileComplete;

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

  // 토스 환경: 카카오/네이버 로그인 대신 안내 메시지 표시 (프로덕션 환경에서만)
  // 비게임 검수 가이드: "토스 로그인이 아닌 자사 로그인이나 기타 로그인 방식은 제공하지 않아요"
  if (isToss && process.env.NODE_ENV === 'production') {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.srOnly}>
            <Heading as="h1" size="7" weight="bold">
              바나나웨딩
            </Heading>
          </div>
          <div className={styles.socialButtons}>
            <p
              style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '15px',
                lineHeight: '1.6',
                padding: '20px 0',
                wordBreak: 'keep-all',
              }}
            >
              {isTossLoading
                ? '토스 앱에서 로그인 중입니다...'
                : '토스 앱에서 자동으로 로그인돼요.'}
              <br />
              잠시만 기다려주세요.
            </p>
            {!isTossLoading && (
              <button
                type="button"
                onClick={handleTossLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3182F6',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '600',
                  marginTop: '10px',
                }}
              >
                토스로 로그인하기
              </button>
            )}
          </div>
        </div>
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
          <div className={styles.srOnly}>
            <Heading as="h1" size="7" weight="bold">
              바나나웨딩 시작하기
            </Heading>
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

            <button
              className={`${styles.socialButton} ${styles.naver}`}
              onClick={() => handleOAuthLogin('naver')}
              disabled={!!loadingProvider}
              type="button"
            >
              <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
              </svg>
              <span>네이버로 시작하기</span>
            </button>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p>
              계속 진행함으로써 귀하께서는{' '}
              <Link href="/privacy" target="_blank" className={styles.link}>
                개인정보 처리방침
              </Link>{' '}
              및{' '}
              <Link href="/terms" target="_blank" className={styles.link}>
                이용약관
              </Link>
              에 동의하게 돼요.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
