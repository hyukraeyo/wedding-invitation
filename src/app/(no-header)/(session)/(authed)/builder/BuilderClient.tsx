'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Eye, MoreHorizontal, Save, X, User, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { clsx } from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import EditorForm from '@/components/common/EditorForm';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { IconButton } from '@/components/ui/IconButton';
import { BananaLoader } from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';
import { useToast } from '@/hooks/use-toast';
import { validateBeforeBuilderSave } from '@/lib/builderBusinessValidation';
import { ensureBuilderSlug, toInvitationData } from '@/lib/builderSave';
import { invitationService } from '@/services/invitationService';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useInvitationStore } from '@/store/useInvitationStore';

import styles from './BuilderPage.module.scss';
import { IPhoneFrame } from './IPhoneFrame';

import { SectionLoader } from '@/components/ui/SectionLoader';

const InvitationCanvas = dynamic(() => import('@/components/preview/InvitationCanvas'), {
  ssr: false,
  loading: () => <SectionLoader height="100%" message="초대장을 구성하고 있어요" />,
});

interface TopActionItem {
  key: 'back' | 'save' | 'mypage';
  variant: 'secondary' | 'primary';
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled: boolean;
}

interface BuilderClientProps {
  initialIsMobile?: boolean;
  initialIsToss?: boolean;
}

export function BuilderClient({
  initialIsMobile = false,
  initialIsToss = false,
}: BuilderClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileActionsExpanded, setIsMobileActionsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasOpenedPreviewOnce, setHasOpenedPreviewOnce] = useState(false);
  const isMobilePreviewViewport = useMediaQuery('(max-width: 767px)', initialIsMobile);
  const isToss = useTossEnvironment(initialIsToss);
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const { user, profile, isProfileComplete, profileLoading, isAdmin } = useAuth();
  const { editingSection, setValidationErrors, isUploading } = useInvitationStore(
    useShallow((state) => ({
      editingSection: state.editingSection,
      setValidationErrors: state.setValidationErrors,
      isUploading: state.isUploading,
    }))
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  const mode = searchParams.get('mode');
  const isEditMode = mode === 'edit';
  const isNewMode = mode === 'new';
  const profileLockRef = useRef(false);
  const initRef = useRef(false);
  const saveLockRef = useRef(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const getLoginUrl = useCallback(() => {
    const returnTo = `${pathname}${searchParamsString ? `?${searchParamsString}` : ''}`;
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }, [pathname, searchParamsString]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const isOnboarding = searchParams.get('onboarding') === 'true';

    if (isEditMode || isOnboarding) {
      if (isOnboarding) {
        sessionStorage.removeItem('builder-draft-slug');
      }
      saveLockRef.current = false;
    } else {
      if (isNewMode) {
        useInvitationStore.getState().reset();
      }

      sessionStorage.removeItem('builder-draft-slug');
      saveLockRef.current = false;
    }

    requestAnimationFrame(() => {
      setIsReady(true);
      if (isEditMode) setIsSaving(false);
    });
  }, [isEditMode, isNewMode, router, searchParams]);

  useEffect(() => {
    // 프로필 완성 여부는 최초 프로필 로드 완료 시 1회만 확인
    // react-query 리패치로 인한 재평가 → 리다이렉트 루프 방지
    if (profileLockRef.current) return;
    if (!user || profileLoading) return;

    profileLockRef.current = true;

    if (profile && !isProfileComplete) {
      router.replace(getLoginUrl());
    }
  }, [user, profile, profileLoading, isProfileComplete, router, getLoginUrl]);

  const handleLogin = useCallback(() => {
    router.push(getLoginUrl());
  }, [router, getLoginUrl]);

  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);
  const stableSave = useCallback(() => {
    void handleSaveRef.current?.();
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) {
      handleLogin();
      return;
    }

    if (!isReady || isSaving || saveLockRef.current) {
      return;
    }

    saveLockRef.current = true;
    setIsSaving(true);

    try {
      const currentStoreState = useInvitationStore.getState();

      if (!isAdmin && (currentStoreState.isRequestingApproval || currentStoreState.isApproved)) {
        toast({
          variant: 'destructive',
          description: '승인 요청 중이거나 승인된 청첩장은 수정할 수 없어요.',
        });
        return;
      }

      const cleanData = toInvitationData(currentStoreState);
      const validation = validateBeforeBuilderSave(cleanData);

      if (!validation.isValid) {
        setValidationErrors(validation.invalidSectionKeys ?? []);
        toast({
          variant: 'destructive',
          description: validation.message ?? '필수 입력 항목을 확인해주세요.',
        });
        return;
      }

      setValidationErrors([]);

      const currentSlug = ensureBuilderSlug(currentStoreState);

      await invitationService.saveInvitation(currentSlug, cleanData, user.id);
      toast({ description: '청첩장이 저장되었어요.' });
      router.push('/mypage');
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: 'destructive',
        description: '저장 중 오류가 발생했어요. 다시 시도해주세요.',
      });
    } finally {
      setIsSaving(false);
      saveLockRef.current = false;
    }
  }, [user, handleLogin, isReady, isSaving, isAdmin, toast, router, setValidationErrors]);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const registerSaveAction = useHeaderStore((state) => state.registerSaveAction);
  const setIsLoading = useHeaderStore((state) => state.setIsLoading);
  const editorFormId = 'builder-editor-form';

  const requestEditorFormSubmit = useCallback(() => {
    if (isUploading) {
      toastRef.current({
        variant: 'destructive',
        title: '이미지 업로드 중',
        description: '이미지가 완전히 업로드될 때까지 잠시만 기다려주세요.',
      });
      return;
    }

    const form = document.getElementById(editorFormId) as HTMLFormElement | null;

    if (form?.requestSubmit) {
      form.requestSubmit();
      return;
    }

    if (form) {
      form.submit();
      return;
    }

    stableSave();
  }, [editorFormId, isUploading, stableSave]);

  const handleBack = useCallback(() => {
    if (isSaving) {
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/mypage');
  }, [isSaving, router]);

  useEffect(() => {
    registerSaveAction(requestEditorFormSubmit);
    return () => registerSaveAction(null);
  }, [registerSaveAction, requestEditorFormSubmit]);

  useEffect(() => {
    setIsLoading(isSaving);
  }, [isSaving, setIsLoading]);

  useEffect(() => {
    if (!isMobilePreviewViewport && isPreviewOpen) {
      setIsPreviewOpen(false);
    }
  }, [isMobilePreviewViewport, isPreviewOpen]);

  useEffect(() => {
    if (!isMobilePreviewViewport || isPreviewOpen) {
      setIsMobileActionsExpanded(false);
    }
  }, [isMobilePreviewViewport, isPreviewOpen]);

  const topActions: TopActionItem[] = [
    {
      key: 'back',
      variant: 'secondary' as const,
      icon: ArrowLeft,
      label: '뒤로가기',
      onClick: handleBack,
      disabled: isSaving,
    },
    {
      key: 'mypage',
      variant: 'secondary' as const,
      icon: User,
      label: '마이페이지',
      onClick: () => router.push('/mypage'),
      disabled: isSaving,
    },
    {
      key: 'save',
      variant: 'primary' as const,
      icon: Save,
      label: '저장',
      onClick: requestEditorFormSubmit,
      disabled: isSaving || isUploading || !isReady,
    },
  ];

  const hasExpandableMobileActions = topActions.length >= 1;

  const handleMobileMoreToggle = useCallback(() => {
    setIsMobileActionsExpanded((prev) => !prev);
  }, []);

  const updatePreviewOpen = useCallback((nextOpen: boolean) => {
    setIsPreviewOpen(nextOpen);

    if (nextOpen) {
      setHasOpenedPreviewOnce(true);
    }
  }, []);

  const handlePreviewOpen = useCallback(() => {
    updatePreviewOpen(true);
  }, [updatePreviewOpen]);

  const handlePreviewClose = useCallback(() => {
    updatePreviewOpen(false);
  }, [updatePreviewOpen]);

  const renderMobileActionRail = () => {
    return (
      <div
        className={clsx(styles.mobileActionRail)}
        style={{
          opacity: isPreviewOpen ? 0 : 1,
          pointerEvents: isPreviewOpen ? 'none' : 'auto',
          visibility: isPreviewOpen ? 'hidden' : 'visible',
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {hasExpandableMobileActions && isMobileActionsExpanded ? (
          <motion.div
            id="builder-mobile-rail-actions"
            className={styles.mobileRailActionList}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            {topActions.map((action, index) => (
              <motion.div
                key={action.key}
                className={clsx(styles.mobileRailButton, styles.mobileRailActionItem)}
                initial={{ opacity: 0, y: 18, scale: 0.64 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 520,
                  damping: 30,
                  mass: 0.72,
                  delay: index * 0.055,
                }}
              >
                <IconButton
                  type="button"
                  variant={action.variant}
                  size="xl"
                  aria-label={action.label}
                  onClick={() => {
                    setIsMobileActionsExpanded(false);
                    action.onClick();
                  }}
                  disabled={action.disabled}
                >
                  <action.icon className={styles.icon} />
                </IconButton>
              </motion.div>
            ))}
          </motion.div>
        ) : null}

        {hasExpandableMobileActions ? (
          <div className={styles.mobileRailButton}>
            <IconButton
              type="button"
              variant="secondary"
              size="xl"
              aria-label={isMobileActionsExpanded ? '더보기 닫기' : '더보기 열기'}
              aria-controls="builder-mobile-rail-actions"
              aria-expanded={isMobileActionsExpanded}
              onClick={handleMobileMoreToggle}
            >
              {isMobileActionsExpanded ? (
                <motion.span
                  key="expanded"
                  className={styles.iconMotion}
                  initial={{ opacity: 0, rotate: -90, scale: 0.56 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <X className={styles.icon} />
                </motion.span>
              ) : (
                <motion.span
                  key="collapsed"
                  className={styles.iconMotion}
                  initial={{ opacity: 0, rotate: 90, scale: 0.56 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MoreHorizontal className={styles.icon} />
                </motion.span>
              )}
            </IconButton>
          </div>
        ) : null}

        <div className={styles.mobileRailButton}>
          <IconButton
            type="button"
            variant="primary"
            size="xl"
            aria-label="미리보기 열기"
            onClick={handlePreviewOpen}
          >
            <Eye className={styles.icon} />
          </IconButton>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {isSaving ? <BananaLoader variant="fixed" /> : null}

      {!isMobilePreviewViewport ? (
        <div className={styles.floatingTopActions}>
          {topActions.map((action) => (
            <div key={action.key} className={styles.topActionButton}>
              <Button
                type="button"
                variant={action.variant}
                size="md"
                leftIcon={<action.icon size={14} />}
                aria-label={action.label}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.workspace}>
        <div className={styles.sidebar} id="sidebar-portal-root">
          <div className={styles.scrollArea} id="builder-sidebar-scroll">
            <EditorForm formId={editorFormId} onSubmit={stableSave} />
          </div>
        </div>

        {isReady && !isMobilePreviewViewport && (
          <div className={styles.previewArea}>
            <div className={styles.backgroundPattern} />
            <div className={styles.previewContent}>
              <IPhoneFrame>
                <InvitationCanvas
                  key="desktop-preview"
                  editingSection={editingSection}
                  hideWatermark
                />
              </IPhoneFrame>
            </div>
          </div>
        )}
      </div>

      {isMobilePreviewViewport ? (
        isToss ? (
          <>
            <AnimatePresence mode="wait">
              {isMobileActionsExpanded && (
                <motion.button
                  key="mobile-rail-backdrop"
                  type="button"
                  className={styles.mobileRailBackdrop}
                  aria-label="액션 메뉴 닫기"
                  onClick={() => setIsMobileActionsExpanded(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </AnimatePresence>

            {renderMobileActionRail()}

            {hasOpenedPreviewOnce ? (
              <>
                <button
                  type="button"
                  className={clsx(
                    styles.previewFallbackBackdrop,
                    isPreviewOpen && styles.previewFallbackBackdropOpen
                  )}
                  aria-label="미리보기 닫기"
                  aria-hidden={!isPreviewOpen}
                  tabIndex={isPreviewOpen ? 0 : -1}
                  onClick={handlePreviewClose}
                />

                <div
                  className={clsx(
                    styles.previewFallbackPanel,
                    isPreviewOpen && styles.previewFallbackPanelOpen
                  )}
                  role={isPreviewOpen ? 'dialog' : undefined}
                  aria-hidden={!isPreviewOpen}
                  aria-modal={isPreviewOpen || undefined}
                >
                  <div className={styles.previewFallbackBody}>
                    <InvitationCanvas
                      key="mobile-preview-fallback"
                      isPreviewMode
                      editingSection={editingSection}
                      hideWatermark
                      disableInternalScroll
                    />
                  </div>

                  <div className={clsx(styles.mobileRailButton, styles.mobileRailCloseButton)}>
                    <IconButton
                      type="button"
                      variant="secondary"
                      size="xl"
                      aria-label="미리보기 닫기"
                      onClick={handlePreviewClose}
                    >
                      <X className={styles.icon} />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <Drawer.Root
            open={isPreviewOpen}
            onOpenChange={updatePreviewOpen}
            direction="right"
          >
            <AnimatePresence>
              {isMobileActionsExpanded && (
                <motion.button
                  key="mobile-rail-backdrop-drawer"
                  type="button"
                  className={styles.mobileRailBackdrop}
                  aria-label="액션 메뉴 닫기"
                  onClick={() => setIsMobileActionsExpanded(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </AnimatePresence>

            {renderMobileActionRail()}

            <Drawer.Portal>
              <Drawer.Overlay />
              <Drawer.Content aria-label="모바일 청첩장 미리보기" variant="default">
                <Drawer.Body padding={false} className={styles.previewDrawerBody}>
                  <InvitationCanvas
                    key="mobile-preview"
                    isPreviewMode
                    editingSection={editingSection}
                    hideWatermark
                    disableInternalScroll
                  />
                </Drawer.Body>

                <div className={clsx(styles.mobileRailButton, styles.mobileRailCloseButton)}>
                  <IconButton
                    type="button"
                    variant="secondary"
                    size="xl"
                    aria-label="미리보기 닫기"
                    onClick={handlePreviewClose}
                  >
                    <X className={styles.icon} />
                  </IconButton>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )
      ) : null}
    </div>
  );
}
