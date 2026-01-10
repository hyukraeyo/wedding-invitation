"use client";

import React, { useState, useCallback, memo, useEffect } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './EditorForm.module.scss';
import { clsx } from 'clsx';

// Static imports for immediate loading (prevents icon pop-in)
import ThemeSection from './sections/ThemeSection';
import MainScreenSection from './sections/MainScreenSection';
import BasicInfoSection from './sections/BasicInfoSection';
import DateTimeSection from './sections/DateTimeSection';
import LocationSection from './sections/LocationSection';
import GreetingSection from './sections/GreetingSection';
import GallerySection from './sections/GallerySection';
import AccountsSection from './sections/AccountsSection';
import KakaoShareSection from './sections/KakaoShareSection';
import ClosingSection from './sections/ClosingSection';

const SECTIONS = [
  { key: 'basic', Component: BasicInfoSection },
  { key: 'theme', Component: ThemeSection },
  { key: 'mainScreen', Component: MainScreenSection },
  { key: 'message', Component: GreetingSection },
  { key: 'date', Component: DateTimeSection },
  { key: 'location', Component: LocationSection },
  { key: 'gallery', Component: GallerySection },
  { key: 'account', Component: AccountsSection },
  { key: 'closing', Component: ClosingSection },
  { key: 'kakao', Component: KakaoShareSection },
] as const;

const EditorForm = memo(function EditorForm() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const setEditingSection = useInvitationStore(state => state.setEditingSection);

  useEffect(() => {
    setEditingSection(openSection);
  }, [openSection, setEditingSection]);

  // Delay rendering to ensure all icons are loaded for smooth appearance
  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleToggle = useCallback((section: string) => {
    setOpenSection(prev => prev === section ? null : section);
  }, []);

  return (
    <div className={clsx(styles.container, isReady && styles.ready)}>
      {SECTIONS.map(({ key, Component }) => (
        <Component
          key={key}
          isOpen={openSection === key}
          onToggle={() => handleToggle(key)}
        />
      ))}
    </div>
  );
});

EditorForm.displayName = 'EditorForm';

export default EditorForm;