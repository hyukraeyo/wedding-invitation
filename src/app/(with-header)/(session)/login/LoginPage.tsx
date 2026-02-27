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
 */
interface LoginPageProps {
  initialProfileState?: ProfileState | null;
  initialUser: User | null;
}

const GUEST_ID_STORAGE_KEY = 'banana_wedding_guest_id';
const ENABLE_TOSS_GUEST_MODE = process.env.NEXT_PUBLIC_ENABLE_TOSS_GUEST_MODE !== 'false';
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createFallbackGuestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') {
    return createFallbackGuestId();
  }

  const existing = window.localStorage.getItem(GUEST_ID_STORAGE_KEY);
  if (existing && UUID_V4_REGEX.test(existing)) {
    return existing;
  }

  const nextGuestId =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : createFallbackGuestId();

  window.localStorage.setItem(GUEST_ID_STORAGE_KEY, nextGuestId);
  return nextGuestId;
}

export default function LoginPage({ initialProfileState, initialUser }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isToss = useTossEnvironment();
  const useTossGuestMode = isToss && ENABLE_TOSS_GUEST_MODE;
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
    if (rawMessage.includes('지원하지 않는 앱 버전') || normalizedMessage.includes('not supported')) {
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
      const result = useTossGuestMode
        ? await signIn('guest', {
            guestId: getOrCreateGuestId(),
            callbackUrl,
            redirect: false,
          })
        : await (async () => {
            const { appLogin } = await loadTossWebFramework();
            const { authorizationCode, referrer } = await appLogin();
            return signIn('toss', {
              authorizationCode,
              referrer,
              callbackUrl,
              redirect: false,
            });
          })();

      if (result?.error) {
        const message =
          result.error === 'CredentialsSignin'
            ? useTossGuestMode
              ? '게스트 입장 세션 생성에 실패했어요. 잠시 후 다시 시도해 주세요.'
              : '토스 로그인 검증에 실패했어요. 토스 콘솔 로그인 설정을 확인해 주세요.'
            : useTossGuestMode
              ? '게스트 입장에 실패했어요. 잠시 후 다시 시도해 주세요.'
              : '토스 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.';

        setTossErrorMessage(message);
        toast({
          title: useTossGuestMode ? '게스트 입장 실패' : '토스 로그인 실패',
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
        title: useTossGuestMode ? '게스트 입장 실패' : '토스 로그인 실패',
        description: message,
        variant: 'destructive',
      });
      console.error('[TOSS_LOGIN_CLIENT_ERROR]', error);
    } finally {
      tossLoginInFlightRef.current = false;
      setIsTossLoading(false);
    }
  }, [callbackUrl, getTossErrorMessage, router, toast, useTossGuestMode]);

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

  // 토스 환경: 카카오/네이버 로그인 대신 토스 전용 UI 표시
  // 비게임 검수 가이드: "토스 로그인이 아닌 자사 로그인이나 기타 로그인 방식은 제공하지 않아요"
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
            <p className={styles.tossLoginNotice}>
              {isTossLoading
                ? useTossGuestMode
                  ? '앱에서 게스트 입장 중입니다...'
                  : '토스 앱에서 로그인 중입니다...'
                : useTossGuestMode
                  ? '로그인 없이 바로 시작할 수 있어요.'
                  : '토스 앱에서 자동으로 로그인돼요.'}
              <br />
              잠시만 기다려주세요.
            </p>
            {!isTossLoading && (
              <button type="button" onClick={handleTossLogin} className={styles.tossLoginButton}>
                {useTossGuestMode ? '로그인 없이 시작하기' : '토스로 로그인하기'}
              </button>
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
