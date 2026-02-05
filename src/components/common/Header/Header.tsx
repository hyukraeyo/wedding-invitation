'use client';

import React, { Suspense, useCallback } from 'react';
import Image from 'next/image';
import { LogIn, Save, Banana, Bell } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { IconButton, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useShallow } from 'zustand/react/shallow';
import styles from './Header.module.scss';

import { useHeaderStore } from '@/store/useHeaderStore';
import { useHeaderData } from './HeaderDataProvider';

const Logo = React.memo(() => (
  <div className={styles.logoWrapper}>
    <ViewTransitionLink href="/" className={styles.logoLink}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={44}
        height={44}
        className={styles.logoImage}
        quality={100}
        priority
      />
    </ViewTransitionLink>
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
              variant="clear"
              className={styles.actionButton}
              aria-label="저장하기"
              name=""
            >
              <Save size={20} strokeWidth={2.5} />
            </IconButton>
          ) : null}

          {user ? (
            <div className={styles.actionsRow}>
              <ViewTransitionLink href="/mypage/notifications" className={styles.notificationLink}>
                <IconButton
                  iconSize={20}
                  variant="clear"
                  className={styles.actionButton}
                  aria-label="알림"
                  name=""
                >
                  <Bell size={20} strokeWidth={2.5} />
                  {notificationCount > 0 && <span className={styles.notificationBadge} />}
                </IconButton>
              </ViewTransitionLink>
              <ViewTransitionLink href="/mypage" className={styles.profileLink}>
                <IconButton
                  iconSize={20}
                  variant="fill"
                  className={styles.profileButton}
                  aria-label="마이페이지"
                  name=""
                >
                  <Banana size={20} strokeWidth={2.5} />
                </IconButton>
              </ViewTransitionLink>
            </div>
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
  )
);
HeaderActions.displayName = 'HeaderActions';

const HeaderContent = React.memo(() => {
  const router = useRouter();
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

  return (
    <>
      <header className={cn(styles.header, 'view-transition-header')}>
        <div className={styles.left}>
          <Logo />
        </div>

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
      <HeaderContent />
    </Suspense>
  );
}
