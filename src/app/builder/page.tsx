"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamic import for InvitationCanvas (conditionally rendered based on screen size)
const InvitationCanvas = dynamic(
  () => import('@/components/preview/InvitationCanvas'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse" />
  }
);

// Static import for EditorForm to prevent CSS chunk splitting that causes preload warnings
import EditorForm from '@/components/builder/EditorForm';

import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import Header from '@/components/common/Header';
import { toast } from 'sonner';
import SavingOverlay from '@/components/common/SavingOverlay';
import styles from './BuilderPage.module.scss';
import { clsx } from 'clsx';
import { Smartphone, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from '@/components/ui/sheet';
import { useWindowSize } from '@/hooks/useWindowSize';

const generateSlug = (name: string): string => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${name || 'wedding'}-${randomStr}`;
};

export default function BuilderPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { user } = useAuth();
  const state = useInvitationStore();
  const editingSection = useInvitationStore(state => state.editingSection);
  const windowWidth = useWindowSize(); // Optimized hook usage


  const handleLogin = useCallback(() => router.push('/login'), [router]);

  const handleSave = useCallback(async () => {
    if (!user) {
      handleLogin();
      return;
    }

    setIsSaving(true);
    try {
      const cleanData = Object.fromEntries(
        Object.entries(state).filter(([, v]) => typeof v !== 'function')
      ) as unknown as InvitationData;

      let currentSlug = state.slug;
      if (!currentSlug) {
        currentSlug = generateSlug(state.groom.firstName);
        state.setSlug(currentSlug);
      }

      await invitationService.saveInvitation(currentSlug, cleanData, user.id);
      toast.success('청첩장이 저장되었습니다! 🎉');
    } catch {
      toast.error('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }, [user, state, handleLogin]);

  return (
    <main className={styles.main}>
      <Header onSave={handleSave} onLogin={handleLogin} isLoading={isSaving} />
      <SavingOverlay isVisible={isSaving} />

      <div className={styles.workspace}>
        <section className={styles.sidebar} id="sidebar-portal-root">
          <div className={styles.scrollArea} id="builder-sidebar-scroll">
            <EditorForm />
          </div>
        </section>

        <section className={styles.previewArea}>
          {windowWidth >= 1024 && (
            <>
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
                        <InvitationCanvas key="desktop-preview" editingSection={editingSection} />
                      </div>

                      <div className={styles.homeIndicator} />
                    </div>
                  </div>
                </div>

                <p className={styles.label}>MOBILE PREVIEW</p>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Mobile Preview FAB */}
      <button
        className={styles.floatingButton}
        onClick={() => setIsPreviewOpen(true)}
        aria-label="Open Preview"
      >
        <Smartphone />
      </button>

      {/* Mobile Preview Drawer */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent side="right" className={styles.sheetContent}>
          <SheetHeader className="sr-only">
            <SheetTitle>Mobile Preview</SheetTitle>
            <SheetDescription>Preview of your wedding invitation</SheetDescription>
          </SheetHeader>

          <button
            className={styles.mobilePreviewClose}
            onClick={() => setIsPreviewOpen(false)}
            aria-label="Close Preview"
          >
            <X size={20} />
          </button>

          {isPreviewOpen && (
            <div className={styles.mobilePreview}>
              <InvitationCanvas key="mobile-preview" isPreviewMode editingSection={editingSection} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}