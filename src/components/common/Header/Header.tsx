'use client';

import React, { Suspense, useCallback } from 'react';
import { LogIn, Save } from 'lucide-react';
import Link from 'next/link';
import { useInvitationStore } from '@/store/useInvitationStore';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { IconButton, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useShallow } from 'zustand/react/shallow';
import styles from './Header.module.scss';

import { useHeaderStore } from '@/store/useHeaderStore';
import { useHeaderData } from './HeaderDataProvider';
import { ProfileMenu } from './ProfileMenu';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';

const HEADER_SCROLL_THRESHOLD = 1;

const Logo = React.memo(() => (
  <div className={styles.logoWrapper}>
    <Link href="/" className={styles.logoLink}>
      {/* <Image
        src="/logo.png"
        alt="Logo"
        width={44}
        height={44}
        className={styles.logoImage}
        quality={100}
        priority
      /> */}
      <span className={styles.logoText}>Banana Wedding</span>
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
  isHome: boolean;
}

const HeaderActions = React.memo(
  ({
    user,
    authLoading,
    isLoading,
    isUploading,
    notificationCount,
    onLogin,
    onSaveAction,
    showSave,
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
              variant="ghost"
              className={styles.actionButton}
              aria-label="저장하기"
              name=""
            >
              <Save size={20} strokeWidth={2.5} />
            </IconButton>
          ) : null}

          {user ? (
            <div className={styles.actionsRow}>
              <ProfileMenu
                notificationCount={notificationCount}
                className={styles.actionButton || ''}
              />
            </div>
          ) : (
            <IconButton
              iconSize={20}
              variant="ghost"
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
  )
);
HeaderActions.displayName = 'HeaderActions';

const HeaderContent = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, notificationCount, authLoading } = useHeaderData();

  const { isUploading } = useInvitationStore(
    useShallow((state) => ({
      isUploading: state.isUploading,
    }))
  );

  const { onSave, isLoading, progress } = useHeaderStore(
    useShallow((state) => ({
      onSave: state.onSave,
      isLoading: state.isLoading,
      progress: state.progress,
    }))
  );

  const { toast } = useToast();

  React.useEffect(() => {
    let animationFrameId: number | null = null;

    const syncScrolledState = () => {
      animationFrameId = null;
      const nextIsScrolled = window.scrollY > HEADER_SCROLL_THRESHOLD;
      setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));
    };

    const handleScroll = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(syncScrolledState);
    };

    syncScrolledState();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSaveAction = useCallback(() => {
    if (isUploading) {
      toast({
        variant: 'destructive',
        title: '이미지 업로드 중',
        description: '이미지가 완전히 업로드될 때까지 잠시만 기다려주세요.',
      });
      return;
    }
    onSave?.();
  }, [isUploading, onSave, toast]);

  const handleLogin = useCallback(() => {
    if (typeof window === 'undefined') return;
    const returnTo = `${window.location.pathname}${window.location.search}`;
    router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }, [router]);

  const isHome = !pathname || pathname === '/' || pathname === '/home';

  return (
    <>
      <header
        className={cn(
          styles.header,
          isScrolled && styles.scrolled,
          !isHome && styles.notHome,
          'view-transition-header'
        )}
      >
        <div className={styles.left}>
          <Logo />
        </div>

        <div className={styles.center}></div>

        <div className={styles.right}>
          <HeaderActions
            user={user}
            authLoading={authLoading}
            isLoading={isLoading}
            isUploading={isUploading}
            notificationCount={notificationCount}
            onLogin={handleLogin}
            onSaveAction={handleSaveAction}
            showSave={!!onSave}
            isHome={!pathname || pathname === '/' || pathname === '/home'}
          />
        </div>

        {progress !== null && (
          <div className={styles.progressWrapper}>
            <ProgressBar value={progress} className={styles.headerProgressBar} />
          </div>
        )}
      </header>
    </>
  );
});
HeaderContent.displayName = 'HeaderContent';

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className={cn(styles.header, 'view-transition-header')}>
          <div className={styles.left}>
            <Logo />
          </div>
          <div className={styles.right}>
            <div className={styles.actionPlaceholder} />
          </div>
        </header>
      }
    >
      <TossAwareHeader />
    </Suspense>
  );
}

/** 토스 환경에서는 Header를 숨긴다. 토스 비게임 내비게이션 바가 대체. */
function TossAwareHeader() {
  const isToss = useTossEnvironment();

  // 토스 앱인토스 환경: 내비게이션 바가 이미 브랜드 로고/뒤로가기/더보기를 제공
  if (isToss) return null;

  return <HeaderContent />;
}
