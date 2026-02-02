"use client";

import { X } from 'lucide-react';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useToast } from '@/hooks/use-toast';
import { BottomSheet } from '@/components/ui';
import { BananaLoader } from '@/components/ui/Loader';
import styles from './BuilderPage.module.scss';
import { MobileNav } from '@/components/common/MobileNav';
import { clsx } from 'clsx';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import EditorForm from '@/components/common/EditorForm';
import { useScrollLock } from '@/hooks/use-scroll-lock';

import { IPhoneFrame } from './IPhoneFrame';

const invitationCanvasLoading = (
    <div className={styles.invitationCanvasLoading} />
);

const InvitationCanvas = dynamic(
    () => import('@/components/preview/InvitationCanvas'),
    {
        ssr: false,
        loading: () => invitationCanvasLoading
    }
);

const generateSlug = (name: string): string => {
    const cleanName = (name || 'banana').trim().normalize('NFC').replace(/\s+/g, '-');
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${cleanName}-${randomStr}`;
};

// Module-level lock for absolute safety across any React re-renders or stale closures.
let GLOBAL_SAVE_LOCK = false;

export function BuilderClient() {
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const { user, isProfileComplete, profileLoading, isAdmin } = useAuth();
    const { editingSection } = useInvitationStore(useShallow((state) => ({
        editingSection: state.editingSection,
    })));
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isEditMode = searchParams.get('mode') === 'edit';
    const profileLockRef = useRef(false);
    const initRef = useRef(false);
    const getLoginUrl = useCallback(() => {
        const search = searchParams.toString();
        const returnTo = `${pathname}${search ? `?${search}` : ''}`;
        return `/login?returnTo=${encodeURIComponent(returnTo)}`;
    }, [pathname, searchParams]);

    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        const isOnboarding = searchParams.get('onboarding') === 'true';

        if (isEditMode) {
            // Re-mount lock reset
            GLOBAL_SAVE_LOCK = false;
        } else if (isOnboarding) {
            sessionStorage.removeItem('builder-draft-slug');
            GLOBAL_SAVE_LOCK = false;
        } else {
            // Check if essential info exists (User might have refreshed or navigated back)
            const state = useInvitationStore.getState();
            const hasEssentialInfo = state.groom.firstName && state.bride.firstName && state.slug;

            if (!hasEssentialInfo) {
                // If no essential info and not in onboarding flow, redirect to setup
                router.replace('/setup');
                return;
            }

            sessionStorage.removeItem('builder-draft-slug');
            GLOBAL_SAVE_LOCK = false;
        }
        // Set ready in next frame to avoid cascading renders
        requestAnimationFrame(() => setIsReady(true));
    }, [isEditMode, router, searchParams]);

    const togglePreview = useCallback(() => {
        setIsPreviewOpen(prev => !prev);
    }, []);

    useScrollLock(isPreviewOpen);

    useEffect(() => {
        if (user && !profileLoading && !isProfileComplete && !profileLockRef.current) {
            router.replace(getLoginUrl());
        }
    }, [user, profileLoading, isProfileComplete, router, getLoginUrl]);

    const handleLogin = useCallback(() => {
        router.push(getLoginUrl());
    }, [router, getLoginUrl]);

    // use-latest or ref for event handlers used in async logic
    const handleSaveRef = useRef<(() => Promise<void>) | null>(null);
    const stableSave = useCallback(() => {
        void handleSaveRef.current?.();
    }, []);

    const handleSave = useCallback(async () => {
        if (!user) {
            handleLogin();
            return;
        }

        if (!isReady || isSaving || GLOBAL_SAVE_LOCK) {
            return;
        }

        GLOBAL_SAVE_LOCK = true;
        setIsSaving(true);
        try {
            const currentStoreState = useInvitationStore.getState();

            // js-cache-function-results: Cache expensive object filtering
            const cleanData = (() => {
                const entries = Object.entries(currentStoreState);
                const filteredEntries = entries.filter(([, v]) => typeof v !== 'function');
                return Object.fromEntries(filteredEntries) as InvitationData;
            })();

            let currentSlug = currentStoreState.slug;

            if (!currentSlug) {
                // js-early-exit: Early return for slug generation
                const groomName = currentStoreState.groom.firstName;
                currentSlug = generateSlug(groomName);
                currentStoreState.setSlug(currentSlug);
            }

            if (!isAdmin && (currentStoreState.isRequestingApproval || currentStoreState.isApproved)) {
                toast({ variant: 'destructive', description: '승인 신청 중이거나 승인된 청첩장은 수정할 수 없어요.' });
                return;
            }

            await invitationService.saveInvitation(currentSlug, cleanData, user.id);
            toast({ description: '청첩장이 저장되었어요! 🎉' });
            router.push('/mypage');
            // Note: Don't set isSaving(false) here because we're navigating away.
            // Keeping it true (and keeping GLOBAL_SAVE_LOCK) prevents any further clicks during the transition.
        } catch (error) {
            console.error('Save error:', error);
            toast({ variant: 'destructive', description: '저장 중 오류가 발생했어요. 다시 시도해주세요.' });
            setIsSaving(false);
            GLOBAL_SAVE_LOCK = false;
        }
    }, [user, handleLogin, isReady, router, isAdmin, isSaving, toast]);

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
        // advanced-event-handler-refs: Ensure the header always has the latest handleSave
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
                            <InvitationCanvas key="desktop-preview" editingSection={editingSection} hideWatermark />
                        </IPhoneFrame>

                        <p className={styles.label}>MOBILE PREVIEW</p>
                    </div>
                </div>
            </div>

            <BottomSheet
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                header="Mobile Preview"
            >
                <div className={styles.previewHint}>
                    나만의 달콤한 바나나웨딩 청첩장 미리보기
                </div>

                <div className={styles.mobilePreview}>
                    <React.Activity mode={isPreviewOpen ? 'visible' : 'hidden'}>
                        <InvitationCanvas key="mobile-preview" isPreviewMode editingSection={editingSection} hideWatermark />
                    </React.Activity>
                </div>

                {/* Preview Close FAB */}
                <button
                    className={clsx(styles.floatingPreview, styles.fabVisible, styles.previewOpenFab)}
                    onClick={togglePreview}
                    aria-label="Close preview"
                >
                    <X className={styles.icon} />
                </button>
            </BottomSheet>

            {/* Mobile Navigation Bar */}
            <MobileNav
                onSave={stableSave}
                isSaving={isSaving}
                onPreviewToggle={togglePreview}
                isPreviewOpen={isPreviewOpen}
            />
        </div>
    );
}
