"use client";

import React, { useState, useCallback, memo, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore } from '@/store/useInvitationStore';

// Dynamic imports for code splitting
const ThemeSection = dynamic(() => import('./sections/ThemeSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const MainScreenSection = dynamic(() => import('./sections/MainScreenSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const BasicInfoSection = dynamic(() => import('./sections/BasicInfoSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const DateTimeSection = dynamic(() => import('./sections/DateTimeSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const LocationSection = dynamic(() => import('./sections/LocationSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const GreetingSection = dynamic(() => import('./sections/GreetingSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const GallerySection = dynamic(() => import('./sections/GallerySection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const AccountsSection = dynamic(() => import('./sections/AccountsSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const KakaoShareSection = dynamic(() => import('./sections/KakaoShareSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const ClosingSection = dynamic(() => import('./sections/ClosingSection'), {
  loading: () => <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
});

const EditorForm = memo(function EditorForm() {
  // State to track open accordion section
  const [openSection, setOpenSection] = useState<string | null>(null);
  const setEditingSection = useInvitationStore(state => state.setEditingSection);

  // Update editing section when openSection changes
  useEffect(() => {
    setEditingSection(openSection);
  }, [openSection, setEditingSection]);

  const handleToggle = useCallback((section: string) => {
    setOpenSection(prev => prev === section ? null : section);
  }, []);

  return (
    <div className="h-full overflow-y-auto px-1 py-2">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 px-1">청첩장 정보 입력</h2>

      <Suspense fallback={<div className="space-y-1">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="animate-pulse h-20 bg-gray-100 rounded-lg" />
        ))}
      </div>}>
        <div className="space-y-1">
          {/* Theme Settings */}
          <ThemeSection
            isOpen={openSection === 'theme'}
            onToggle={() => handleToggle('theme')}
          />

          {/* Main Screen */}
          <MainScreenSection
            isOpen={openSection === 'mainScreen'}
            onToggle={() => handleToggle('mainScreen')}
          />

          {/* Basic Info */}
          <BasicInfoSection
            isOpen={openSection === 'basic'}
            onToggle={() => handleToggle('basic')}
          />

          {/* Date & Time */}
          <DateTimeSection
            isOpen={openSection === 'date'}
            onToggle={() => handleToggle('date')}
          />

          {/* Location */}
          <LocationSection
            isOpen={openSection === 'location'}
            onToggle={() => handleToggle('location')}
          />

          {/* Greeting */}
          <GreetingSection
            isOpen={openSection === 'message'}
            onToggle={() => handleToggle('message')}
          />

          {/* Gallery */}
          <GallerySection
            isOpen={openSection === 'gallery'}
            onToggle={() => handleToggle('gallery')}
          />

          {/* Accounts */}
          <AccountsSection
            isOpen={openSection === 'account'}
            onToggle={() => handleToggle('account')}
          />

          {/* Closing Section */}
          <ClosingSection
            isOpen={openSection === 'closing'}
            onToggle={() => handleToggle('closing')}
          />

          {/* Kakao Share Thumbnail */}
          <KakaoShareSection
            isOpen={openSection === 'kakao'}
            onToggle={() => handleToggle('kakao')}
          />
        </div>
      </Suspense>
    </div>
  );
});

EditorForm.displayName = 'EditorForm';

export default EditorForm;