"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import { useHeaderStore } from '@/store/useHeaderStore';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import styles from './BuilderPage.module.scss';
import { clsx } from 'clsx';
import { Smartphone, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from '@/components/ui/Sheet';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import EditorForm from '@/components/common/EditorForm';

const invitationCanvasLoading = (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }} />
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

export function BuilderClient() {
    const [isSaving, setIsSaving] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const { user, isProfileComplete, profileLoading, isAdmin } = useAuth();
    const { editingSection, reset } = useInvitationStore(useShallow((state) => ({
        editingSection: state.editingSection,
        reset: state.reset,
    })));
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('mode') === 'edit';
    const profileLockRef = useRef(false);
    const initRef = useRef(false);

    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;
        if (!isEditMode) {
            reset();
            sessionStorage.removeItem('builder-draft-slug');
        }
        setIsReady(true);
    }, [isEditMode, reset]);

    useEffect(() => {
        if (isPreviewOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isPreviewOpen]);

    useEffect(() => {
        if (user && !profileLoading && !isProfileComplete && !profileLockRef.current) {
            router.replace('/login');
        }
    }, [user, profileLoading, isProfileComplete, router]);

    const handleLogin = useCallback(() => {
        router.push('/login');
    }, [router]);

    const handleSave = useCallback(async () => {
        if (!user) {
            handleLogin();
            return;
        }

        if (!isReady) {
            toast.error('잠시 후 다시 시도해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            const currentStoreState = useInvitationStore.getState();
            const cleanData = Object.fromEntries(
                Object.entries(currentStoreState).filter(([, v]) => typeof v !== 'function')
            ) as unknown as InvitationData;

            let currentSlug = currentStoreState.slug;

            if (!currentSlug) {
                currentSlug = generateSlug(currentStoreState.groom.firstName);
                currentStoreState.setSlug(currentSlug);
            }

            if (!isAdmin && (currentStoreState.isRequestingApproval || currentStoreState.isApproved)) {
                toast.error('승인 신청 중이거나 승인된 청첩장은 수정할 수 없습니다.');
                return;
            }

            await invitationService.saveInvitation(currentSlug, cleanData, user.id);
            toast.success('청첩장이 저장되었습니다! 🎉');
            router.push('/mypage');
        } catch {
            toast.error('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSaving(false);
        }
    }, [user, handleLogin, isReady, router, isAdmin]);

    const { registerSaveAction, setIsLoading } = useHeaderStore();

    useEffect(() => {
        registerSaveAction(handleSave);
        return () => registerSaveAction(null);
    }, [handleSave, registerSaveAction]);

    useEffect(() => {
        setIsLoading(isSaving);
    }, [isSaving, setIsLoading]);

    return (
        <div className={styles.container}>
            {isSaving ? <LoadingSpinner /> : null}

            <main className={styles.workspace}>
                <section className={styles.sidebar} id="sidebar-portal-root">
                    <div className={styles.scrollArea} id="builder-sidebar-scroll">
                        <EditorForm />
                    </div>
                </section>

                <section className={styles.previewArea}>
                    <div className={styles.backgroundPattern} />
                    <div className={styles.previewContent}>
                        <div className={styles.iphoneFrame}>
                            <div className={clsx(styles.button, styles.action)} />
                            <div className={clsx(styles.button, styles.volUp)} />
                            <div className={clsx(styles.button, styles.volDown)} />
                            <div className={clsx(styles.button, styles.power)} />

                            <div className={styles.chassis}>
                                <div className={styles.bezel}>
                                    <div className={styles.dynamicIsland}>
                                        <div className={styles.island}>
                                            <div className={styles.camera} />
                                        </div>
                                    </div>

                                    <div className={styles.statusBar}>
                                        <div className={styles.time}>9:41</div>
                                        <div className={styles.icons}>
                                            <div className={styles.signal}>
                                                <div style={{ height: '4px' }} />
                                                <div style={{ height: '6px' }} />
                                                <div style={{ height: '9px' }} />
                                                <div style={{ height: '12px', opacity: 0.3 }} />
                                            </div>
                                            <div className={styles.battery}>
                                                <div className={styles.level} />
                                                <div className={styles.tip} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.screen}>
                                        <InvitationCanvas key="desktop-preview" editingSection={editingSection} hideWatermark />
                                    </div>

                                    <div className={styles.homeIndicator} />
                                </div>
                            </div>
                        </div>

                        <p className={styles.label}>MOBILE PREVIEW</p>
                    </div>
                </section>
            </main>

            <button
                className={clsx(styles.floatingButton, isPreviewOpen && styles.previewOpen)}
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                aria-label={isPreviewOpen ? "Close Preview" : "Open Preview"}
            >
                {isPreviewOpen ? <X size={24} /> : <Smartphone size={24} />}
            </button>

            <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen} modal={false}>
                <SheetContent side="right" className={styles.sheetContent} hideCloseButton>
                    <SheetHeader style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
                        <SheetTitle>Mobile Preview</SheetTitle>
                        <SheetDescription>나만의 달콤한 바나나웨딩 청첩장 미리보기</SheetDescription>
                    </SheetHeader>

                    <div className={styles.mobilePreview}>
                        <InvitationCanvas key="mobile-preview" isPreviewMode editingSection={editingSection} hideWatermark />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
