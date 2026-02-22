'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Eye, MoreHorizontal, Save, X, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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

// Temporary bypass: keep setup guard logic but disable forced redirect for now.
const ENABLE_SETUP_REQUIRED_GUARD = false;

interface TopActionItem {
  key: 'back' | 'save';
  variant: 'secondary' | 'primary';
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled: boolean;
}

interface PreviewGestureState {
  pointerId: number | null;
  startX: number;
  startY: number;
  axis: 'horizontal' | 'vertical' | null;
}

const PREVIEW_GESTURE_LOCK_PX = 8;
const PREVIEW_VERTICAL_BIAS_PX = 2;

export function BuilderClient() {
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileActionsExpanded, setIsMobileActionsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isMobilePreviewViewport = useMediaQuery('(max-width: 767px)');
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const { user, isProfileComplete, profileLoading, isAdmin } = useAuth();
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

  const isEditMode = searchParams.get('mode') === 'edit';
  const profileLockRef = useRef(false);
  const initRef = useRef(false);
  const saveLockRef = useRef(false);
  const previewGestureRef = useRef<PreviewGestureState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    axis: null,
  });

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const getLoginUrl = useCallback(() => {
    const search = searchParams.toString();
    const returnTo = `${pathname}${search ? `?${search}` : ''}`;
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }, [pathname, searchParams]);

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
      const state = useInvitationStore.getState();
      const hasEssentialInfo = state.groom.firstName && state.bride.firstName && state.slug;

      if (ENABLE_SETUP_REQUIRED_GUARD && !hasEssentialInfo) {
        router.replace('/setup');
        return;
      }

      sessionStorage.removeItem('builder-draft-slug');
      saveLockRef.current = false;
    }

    requestAnimationFrame(() => {
      setIsReady(true);
      if (isEditMode) setIsSaving(false);
    });
  }, [isEditMode, router, searchParams]);

  useEffect(() => {
    if (user && !profileLoading && !isProfileComplete && !profileLockRef.current) {
      router.replace(getLoginUrl());
    }
  }, [user, profileLoading, isProfileComplete, router, getLoginUrl]);

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

  const resetPreviewGesture = useCallback((element?: HTMLDivElement | null) => {
    if (element) {
      element.removeAttribute('data-vaul-no-drag');
    }

    previewGestureRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      axis: null,
    };
  }, []);

  const handlePreviewPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      resetPreviewGesture(event.currentTarget);

      previewGestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        axis: null,
      };
    },
    [resetPreviewGesture]
  );

  const handlePreviewPointerMoveCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = previewGestureRef.current;
      if (state.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (!state.axis) {
        if (absX < PREVIEW_GESTURE_LOCK_PX && absY < PREVIEW_GESTURE_LOCK_PX) return;

        const isVerticalIntent = absY >= absX + PREVIEW_VERTICAL_BIAS_PX;
        state.axis = isVerticalIntent ? 'vertical' : 'horizontal';
      }

      if (state.axis === 'vertical') {
        event.currentTarget.setAttribute('data-vaul-no-drag', 'true');
        // Prevent Vaul from treating vertical scroll gestures as drawer drag.
        event.stopPropagation();
      } else {
        event.currentTarget.removeAttribute('data-vaul-no-drag');
      }
    },
    []
  );

  const handlePreviewPointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = previewGestureRef.current;
      if (state.pointerId !== null && state.pointerId !== event.pointerId) return;
      resetPreviewGesture(event.currentTarget);
    },
    [resetPreviewGesture]
  );

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
      </div>

      {isMobilePreviewViewport ? (
        <Drawer.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen} direction="right">
          <AnimatePresence>
            {isMobileActionsExpanded ? (
              <motion.button
                type="button"
                className={styles.mobileRailBackdrop}
                aria-label="액션 메뉴 닫기"
                onClick={() => setIsMobileActionsExpanded(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : null}
          </AnimatePresence>

          {!isPreviewOpen ? (
            <div className={styles.mobileActionRail}>
              <AnimatePresence initial={false}>
                {hasExpandableMobileActions && isMobileActionsExpanded ? (
                  <motion.div
                    id="builder-mobile-rail-actions"
                    className={styles.mobileRailActionList}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {topActions.map((action, index) => (
                      <motion.div
                        key={action.key}
                        className={clsx(styles.mobileRailButton, styles.mobileRailActionItem)}
                        initial={{ opacity: 0, y: 18, scale: 0.64 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.78 }}
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
              </AnimatePresence>

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
                    <AnimatePresence mode="wait" initial={false}>
                      {isMobileActionsExpanded ? (
                        <motion.span
                          key="expanded"
                          className={styles.iconMotion}
                          initial={{ opacity: 0, rotate: -90, scale: 0.56 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.56 }}
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
                          exit={{ opacity: 0, rotate: -90, scale: 0.56 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <MoreHorizontal className={styles.icon} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </IconButton>
                </div>
              ) : null}

              <div className={styles.mobileRailButton}>
                <Drawer.Trigger asChild>
                  <IconButton type="button" variant="primary" size="xl" aria-label="미리보기 열기">
                    <Eye className={styles.icon} />
                  </IconButton>
                </Drawer.Trigger>
              </div>
            </div>
          ) : null}

          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content aria-label="모바일 청첩장 미리보기" variant="default">
              <Drawer.Body
                padding={false}
                className={styles.previewDrawerBody}
                onPointerDown={handlePreviewPointerDown}
                onPointerMoveCapture={handlePreviewPointerMoveCapture}
                onPointerUp={handlePreviewPointerEnd}
                onPointerCancel={handlePreviewPointerEnd}
              >
                <InvitationCanvas
                  key="mobile-preview"
                  isPreviewMode
                  editingSection={editingSection}
                  hideWatermark
                  disableInternalScroll
                />
              </Drawer.Body>

              <div className={clsx(styles.mobileRailButton, styles.mobileRailCloseButton)}>
                <Drawer.Close asChild>
                  <IconButton
                    type="button"
                    variant="secondary"
                    size="xl"
                    aria-label="미리보기 닫기"
                  >
                    <X className={styles.icon} />
                  </IconButton>
                </Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      ) : null}
    </div>
  );
}
