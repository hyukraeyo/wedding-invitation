"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InvitationCanvas from '@/components/preview/InvitationCanvas';
import EditorForm from '@/components/builder/EditorForm';
import LoginModal from '@/components/auth/LoginModal'; // Original import
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import Header from '@/components/common/Header';
import styles from './BuilderPage.module.scss';
import { clsx } from 'clsx';

export default function BuilderPage() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const state = useInvitationStore();

  const handleSave = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      // 1. Prepare data
      const cleanData = Object.fromEntries(
        Object.entries(state).filter(([, value]) => typeof value !== 'function')
      ) as unknown as InvitationData;

      // 2. Handle Slug (if empty, generate one)
      let currentSlug = state.slug;
      if (!currentSlug) {
        const randomStr = Math.random().toString(36).substring(2, 8);
        const namePart = state.groom.firstName || 'wedding';
        currentSlug = `${namePart}-${randomStr}`;
        state.setSlug(currentSlug);
      }

      // 3. Save to Supabase
      await invitationService.saveInvitation(currentSlug, cleanData, user.id);

      // 4. Redirect to My Page
      alert('저장이 완료되었습니다! 마이페이지로 이동합니다.');
      router.push('/mypage');
    } catch (error) {
      console.error('Save error:', error);
      alert('저장 도중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Common Header */}
      <Header onSave={handleSave} onLogin={() => setIsLoginModalOpen(true)} isLoading={isSaving} />

      {/* Workspace */}
      <div className={styles.workspace}>
        {/* Left Panel: Editor */}
        <section className={styles.sidebar}>
          <div className={styles.scrollArea}>
            <EditorForm />
          </div>
        </section>

        {/* Right Panel: Preview */}
        <section className={styles.previewArea}>
          <div className={styles.backgroundPattern} />

          <div className={styles.previewContent}>

            {/* Hyper-realistic iPhone 15 Pro Frame */}
            <div className={styles.iphoneFrame}>
              {/* Physical Buttons */}
              <div className={clsx(styles.button, styles.action)}></div>
              <div className={clsx(styles.button, styles.volUp)}></div>
              <div className={clsx(styles.button, styles.volDown)}></div>
              <div className={clsx(styles.button, styles.power)}></div>

              {/* Main Device Frame (Titanium Look) */}
              <div className={styles.chassis}>

                {/* Screen Bezel (Inner Black Border) */}
                <div className={styles.bezel}>

                  {/* Dynamic Island Area */}
                  <div className={styles.dynamicIsland}>
                    {/* Island itself */}
                    <div className={styles.island}>
                      <div className={styles.camera}></div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className={styles.statusBar}>
                    <div className={styles.time}>9:41</div>
                    <div className={styles.icons}>
                      {/* Signal */}
                      <div className={styles.signal}>
                        <div style={{ height: '4px' }}></div>
                        <div style={{ height: '6px' }}></div>
                        <div style={{ height: '9px' }}></div>
                        <div style={{ height: '12px', opacity: 0.3 }}></div>
                      </div>

                      {/* Battery */}
                      <div className={styles.battery}>
                        <div className={styles.level}></div>
                        <div className={styles.tip}></div>
                      </div>
                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className={styles.screen}>
                    <InvitationCanvas />
                  </div>

                  {/* Home Indicator */}
                  <div className={styles.homeIndicator}></div>
                </div>
              </div>
            </div>

            <p className={styles.label}>
              MOBILE PREVIEW
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}