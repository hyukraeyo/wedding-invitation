"use client";

import React, { useState, useCallback, memo, useEffect } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

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
  { key: 'gallery', Component: GallerySection },
  { key: 'date', Component: DateTimeSection },
  { key: 'location', Component: LocationSection },
  { key: 'account', Component: AccountsSection },
  { key: 'closing', Component: ClosingSection },
  { key: 'kakao', Component: KakaoShareSection },
] as const;

const EditorForm = memo(function EditorForm() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const setEditingSection = useInvitationStore(state => state.setEditingSection);

  // When sections change, identify if a new section was opened to update the preview
  const handleValueChange = useCallback((value: string[]) => {
    // Find if a new section was added
    const added = value.find(v => !openSections.includes(v));
    if (added) {
      setEditingSection(added);
    }
    setOpenSections(value);
  }, [openSections, setEditingSection]);

  // Delay rendering to ensure all icons are loaded for smooth appearance
  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleToggle = useCallback((section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col gap-3 pb-32">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white border border-builder-border rounded-[20px] p-5 h-[64px] flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="w-24 h-4 rounded-full" />
                <Skeleton className="w-16 h-3 rounded-full opacity-60" />
              </div>
            </div>
            <Skeleton className="w-4 h-4 rounded-full opacity-30" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-32 sm-animate-fadeIn">
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={handleValueChange}
        className="flex flex-col gap-3"
      >
        {SECTIONS.map(({ key, Component }) => (
          <Component
            key={key}
            value={key}
            isOpen={openSections.includes(key)}
            onToggle={() => handleToggle(key)}
          />
        ))}
      </Accordion>
    </div>
  );
});

EditorForm.displayName = 'EditorForm';

export default EditorForm;