'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import type { User } from 'next-auth';

import { Heading } from '@/components/ui';
import { BananaLoader } from '@/components/ui/Loader';
import { loadTossWebFramework } from '@/lib/toss';
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
 *
 * - 토스 인앱 환경: 토스 로그인만 표시 (appLogin → signIn('toss'))
 * - 일반 웹 환경: 카카오/네이버 소셜 로그인 표시
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
  const autoLoginAttemptedRef = useRef(false);
  const tossLoginInFlightRef = useRef(false);

  const { toast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<'kakao' | 'naver' | null>(null);
  const [tossErrorMessage, setTossErrorMessage] = useState<string | null>(null);

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

  const getTossErrorMessage = useCallback((error: unknown): string => {
    if (!(error instanceof Error)) {
      return '토스 로그인 중 알 수 없는 오류가 발생했어요.';
    }

    const rawMessage = error.message.trim();
    const normalizedMessage = rawMessage.toLowerCase();

    if (rawMessage.includes('oauth2ClientId')) {
      return '토스 콘솔에서 로그인 연동 설정(oauth2ClientId)을 먼저 완료해 주세요.';
    }
    if (
      rawMessage.includes('Sandbox 앱에 로그인이 되어있는지 확인해주세요') ||
      (normalizedMessage.includes('sandbox') && normalizedMessage.includes('login'))
    ) {
      return '샌드박스 앱에 먼저 로그인한 뒤 다시 시도해 주세요.';
    }
    if (
      rawMessage.includes('지원하지 않는 앱 버전') ||
      normalizedMessage.includes('not supported')
    ) {
      return '토스 앱을 최신 버전으로 업데이트한 뒤 다시 시도해 주세요.';
    }
    if (normalizedMessage.includes('cancel') || rawMessage.includes('취소')) {
      return '토스 로그인이 취소되었어요.';
    }
    if (normalizedMessage.includes('network')) {
      return '네트워크 상태를 확인한 뒤 다시 시도해 주세요.';
    }
    return rawMessage || '토스 로그인 중 문제가 발생했어요.';
  }, []);

  const handleTossLogin = useCallback(async () => {
    if (tossLoginInFlightRef.current) return;
    tossLoginInFlightRef.current = true;
    setIsTossLoading(true);
    setTossErrorMessage(null);

    try {
      const { appLogin } = await loadTossWebFramework();
      const { authorizationCode, referrer } = await appLogin();
      const result = await signIn('toss', {
        authorizationCode,
        referrer,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        const message =
          result.error === 'CredentialsSignin'
            ? '토스 로그인 검증에 실패했어요. 잠시 후 다시 시도해 주세요.'
            : '토스 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.';

        setTossErrorMessage(message);
        toast({
          title: '토스 로그인 실패',
          description: message,
          variant: 'destructive',
        });
      } else {
        if (result?.url) {
          window.location.href = result.url;
          return;
        }

        router.replace(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      const message = getTossErrorMessage(error);

      setTossErrorMessage(message);
      toast({
        title: '토스 로그인 실패',
        description: message,
        variant: 'destructive',
      });
      console.error('[TOSS_LOGIN_CLIENT_ERROR]', error);
    } finally {
      tossLoginInFlightRef.current = false;
      setIsTossLoading(false);
    }
  }, [callbackUrl, getTossErrorMessage, router, toast]);

  // 토스 환경 진입 시 자동 로그인 시도
  useEffect(() => {
    if (!isToss || !!userId || isTossLoading || autoLoginAttemptedRef.current) {
      return;
    }

    autoLoginAttemptedRef.current = true;
    const timer = setTimeout(() => {
      void handleTossLogin();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isToss, userId, handleTossLogin, isTossLoading]);

  useEffect(() => {
    if (userId) {
      autoLoginAttemptedRef.current = false;
    }
  }, [userId]);

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

  // 토스 환경: 카카오/네이버 로그인 대신 토스 전용 로그인 UI 표시
  // 미니앱 검수 가이드: "토스 로그인이 아닌 자사 로그인이나 기타 로그인 방식은 제공하지 않아요"
  if (isToss) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.srOnly}>
            <Heading as="h1" size="7" weight="bold">
              바나나웨딩
            </Heading>
          </div>
          <div className={styles.socialButtons}>
            {isTossLoading ? (
              <>
                <div className={styles.tossLoaderWrapper}>
                  <BananaLoader />
                </div>
                <p className={styles.tossLoginNotice}>
                  토스 계정으로 로그인 중이에요.
                  <br />
                  잠시만 기다려주세요.
                </p>
              </>
            ) : (
              <>
                <p className={styles.tossLoginNotice}>토스 계정으로 간편하게 시작하세요.</p>
                <button type="button" onClick={handleTossLogin} className={styles.tossLoginButton}>
                  <svg viewBox="0 0 24 24" className={styles.tossIcon} fill="none">
                    <path
                      d="M2 7.5h5.2v1.3H4.8V12h2.1v1.3H4.8v3.2H3.3V8.8H2V7.5zm5.8 0H10c1.5 0 2.5.4 2.5 2 0 .9-.4 1.5-1.1 1.8.8.3 1.3 1 1.3 2 0 1.7-1.1 2.2-2.7 2.2H7.8V7.5zm1.4 3.3h.7c.8 0 1.2-.3 1.2-1s-.4-1-1.2-1h-.7v2zm0 3.6h.8c.9 0 1.3-.3 1.3-1.1 0-.7-.5-1.1-1.3-1.1h-.8v2.2zm5.6-4.5c0-1.5 1.2-2.6 2.7-2.6s2.7 1.1 2.7 2.6v3.7c0 1.5-1.2 2.6-2.7 2.6s-2.7-1.1-2.7-2.6V9.9zm1.4 3.8c0 .7.5 1.2 1.3 1.2.7 0 1.3-.5 1.3-1.2V9.8c0-.7-.5-1.2-1.3-1.2-.7 0-1.3.5-1.3 1.2v3.9z"
                      fill="currentColor"
                    />
                  </svg>
                  토스로 시작하기
                </button>
              </>
            )}
            {tossErrorMessage ? <p className={styles.tossLoginError}>{tossErrorMessage}</p> : null}
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
