"use client";

import React from 'react';
import { Save, Eye, Home, Share2 } from 'lucide-react';
import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import styles from './BuilderMobileNav.module.scss';
import { clsx } from 'clsx';

interface BuilderMobileNavProps {
  onSave: () => void;
  onPreviewToggle: () => void;
  isPreviewOpen: boolean;
  isSaving: boolean;
}

export function BuilderMobileNav({
  onSave,
  onPreviewToggle,
  isPreviewOpen,
  isSaving
}: BuilderMobileNavProps) {
  return (
    <nav className={styles.mobileNav}>
      <ViewTransitionLink
        href="/mypage"
        className={clsx(styles.navItem, styles.navItemHome)}
      >
        <Home className={styles.icon} />
        <span>홈</span>
      </ViewTransitionLink>

      <button
        className={clsx(styles.navItem, isSaving && styles.disabled)}
        onClick={onSave}
        disabled={isSaving}
      >
        <Save className={styles.icon} />
        <span>{isSaving ? '저장중' : '저장'}</span>
      </button>

      <button
        className={clsx(styles.navItem, isPreviewOpen && styles.active)}
        onClick={onPreviewToggle}
      >
        <Eye className={styles.icon} />
        <span>미리보기</span>
      </button>

      <button
        className={styles.navItem}
        onClick={() => {
          // Share functionality would go here
          if (typeof window !== 'undefined') {
            if (navigator.share) {
              navigator.share({
                title: '청첩장 공유',
                text: '내가 만든 청첩장을 공유해요!',
                url: window.location.href,
              }).catch(console.error);
            } else {
              // Fallback: Copy to clipboard
              navigator.clipboard.writeText(window.location.href);
            }
          }
        }}
      >
        <Share2 className={styles.icon} />
        <span>공유</span>
      </button>
    </nav>
  );
}