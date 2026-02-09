'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Eye, X } from 'lucide-react';
import { clsx } from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import EditorForm from '@/components/common/EditorForm';
import { Dialog } from '@/components/ui';
import { BananaLoader } from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { validateBeforeBuilderSave } from '@/lib/builderBusinessValidation';
import { ensureBuilderSlug, toInvitationData } from '@/lib/builderSave';
import { invitationService } from '@/services/invitationService';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useToast } from '@/hooks/use-toast';

import styles from './BuilderPage.module.scss';
import { IPhoneFrame } from './IPhoneFrame';

const invitationCanvasLoading = <div className={styles.invitationCanvasLoading} />;

const InvitationCanvas = dynamic(() => import('@/components/preview/InvitationCanvas'), {
  ssr: false,
  loading: () => invitationCanvasLoading,
});

export function BuilderClient() {
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { user, isProfileComplete, profileLoading, isAdmin } = useAuth();
  const { editingSection, setValidationErrors } = useInvitationStore(
    useShallow((state) => ({
      editingSection: state.editingSection,
      setValidationErrors: state.setValidationErrors,
    }))
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isEditMode = searchParams.get('mode') === 'edit';
  const profileLockRef = useRef(false);
  const initRef = useRef(false);
  const saveLockRef = useRef(false);

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

      if (!hasEssentialInfo) {
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

  const { registerSaveAction, setIsLoading } = useHeaderStore();
  const editorFormId = 'builder-editor-form';

  const requestEditorFormSubmit = useCallback(() => {
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
  }, [editorFormId, stableSave]);

  useEffect(() => {
    registerSaveAction(requestEditorFormSubmit);
    return () => registerSaveAction(null);
  }, [registerSaveAction, requestEditorFormSubmit]);

  useEffect(() => {
    setIsLoading(isSaving);
  }, [isSaving, setIsLoading]);

  return (
    <div className={styles.container}>
      {isSaving ? <BananaLoader variant="fixed" /> : null}

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

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} fullScreen>
        {!isPreviewOpen ? (
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={clsx(styles.floatingPreview, styles.fabVisible)}
              aria-label="Open preview"
            >
              <Eye className={styles.icon} />
            </button>
          </Dialog.Trigger>
        ) : null}

        <Dialog.Content surface="muted">
          <div className={styles.mobilePreview}>
            <InvitationCanvas
              key="mobile-preview"
              isPreviewMode
              editingSection={editingSection}
              hideWatermark
            />
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className={clsx(styles.floatingPreview, styles.fabVisible, styles.previewOpenFab)}
              aria-label="Close preview"
            >
              <X className={styles.icon} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog>

    </div>
  );
}
