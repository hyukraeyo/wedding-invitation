"use client";

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

const invitationCanvasLoading = (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }} />
);

// Dynamic import for InvitationCanvas (conditionally rendered based on screen size)
const InvitationCanvas = dynamic(
  () => import('@/components/preview/InvitationCanvas'),
  {
    ssr: false,
    loading: () => invitationCanvasLoading
  }
);



// Static import for EditorForm to prevent CSS chunk splitting that causes preload warnings
import EditorForm from '@/components/common/EditorForm';

import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import Header from '@/components/common/Header';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import styles from './BuilderPage.module.scss';
import { clsx } from 'clsx';
import { Smartphone, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from '@/components/ui/Sheet';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

const generateSlug = (name: string): string => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${name || 'banana'}-${randomStr}`;
};

function BuilderPageContent() {
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReady, setIsReady] = useState(false); // 초기화 완료 여부
  const { user, isProfileComplete, profileLoading, isAdmin } = useAuth();
  const { editingSection, reset } = useInvitationStore(useShallow((state) => ({
    editingSection: state.editingSection,
    reset: state.reset,
  })));
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const profileLockRef = useRef(false); // 모달이 닫힌 후 다시 열리는 것 방지
  const initRef = useRef(false); // 초기화가 한 번만 실행되도록 보장

  // 🔑 빌더 페이지 진입 시 모드에 따라 스토어 초기화
  // - mode=edit: 마이페이지에서 "수정" 버튼 클릭 시 (기존 데이터 유지)
  // - mode 없음: 새 청첩장 생성 (스토어 초기화)
  useEffect(() => {
    if (initRef.current) return; // 이미 초기화됨
    initRef.current = true;
    if (!isEditMode) {
      // 새 청첩장 모드: 스토어를 초기 상태로 리셋
      reset();
      sessionStorage.removeItem('builder-draft-slug');
    }
    setIsReady(true);
  }, [isEditMode, reset]);

  // 🖱️ 프리뷰 오픈 시 바디 스크롤 방지 (modal={false} 사용 시 필수)
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

  // 프로필 미완성시 로그인 페이지로 리다이렉트 (로그인 가드)
  useEffect(() => {
    if (user && !profileLoading && !isProfileComplete && !profileLockRef.current) {
      router.replace('/login');
    }
  }, [user, profileLoading, isProfileComplete, router]);

  // Prefetch login route for instant modal transition
  useEffect(() => {
    router.prefetch('/login');
  }, [router]);

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

      // slug가 없거나 비어있으면 새로 생성
      if (!currentSlug) {
        currentSlug = generateSlug(currentStoreState.groom.firstName);
        currentStoreState.setSlug(currentSlug);
      }

      // 🛑 신청 중이거나 승인된 청첩장은 저장(수정) 불가 (일반 사용자)
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



  return (
    <>
      <div className={styles.container}>
        <Header onSave={handleSave} onLogin={handleLogin} isLoading={isSaving} />
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
      </div>

      {/* Mobile Preview FAB - Truly One Button */}
      <button
        className={clsx(styles.floatingButton, isPreviewOpen && styles.previewOpen)}
        onClick={() => setIsPreviewOpen(!isPreviewOpen)}
        aria-label={isPreviewOpen ? "Close Preview" : "Open Preview"}
      >
        {isPreviewOpen ? <X size={24} /> : <Smartphone size={24} />}
      </button>

      {/* Mobile Preview Drawer - Using modal={false} to keep the FAB interactive */}
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
    </>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className={styles.container} />}>
      <BuilderPageContent />
    </Suspense>
  );
}
