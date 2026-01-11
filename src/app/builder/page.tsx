"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import InvitationCanvas from '@/components/preview/InvitationCanvas';
import EditorForm from '@/components/builder/EditorForm';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { useAuth } from '@/hooks/useAuth';
import { invitationService } from '@/services/invitationService';
import Header from '@/components/common/Header';
import { useToast } from '@/components/common/Toast';
import styles from './BuilderPage.module.scss';
import { clsx } from 'clsx';

const generateSlug = (name: string): string => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${name || 'wedding'}-${randomStr}`;
};

export default function BuilderPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const state = useInvitationStore();
  const toast = useToast();

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
  }, [user, state, handleLogin, toast]);

  return (
    <main className={styles.main}>
      <Header onSave={handleSave} onLogin={handleLogin} isLoading={isSaving} />

      <div className={styles.workspace}>
        <section className={styles.sidebar} id="sidebar-portal-root">
          <div className={styles.scrollArea}>
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
                    <InvitationCanvas />
                  </div>

                  <div className={styles.homeIndicator} />
                </div>
              </div>
            </div>

            <p className={styles.label}>MOBILE PREVIEW</p>
          </div>
        </section>
      </div>
    </main>
  );
}