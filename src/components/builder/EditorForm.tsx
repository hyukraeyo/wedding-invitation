"use client";

import React, { useState } from 'react';
import ThemeSection from './sections/ThemeSection';
import MainScreenSection from './sections/MainScreenSection';
import BasicInfoSection from './sections/BasicInfoSection';
import DateTimeSection from './sections/DateTimeSection';
import LocationSection from './sections/LocationSection';
import GreetingSection from './sections/GreetingSection';
import GallerySection from './sections/GallerySection';
import AccountsSection from './sections/AccountsSection';

export default function EditorForm() {
  // State to track open accordion section
  const [openSection, setOpenSection] = useState<string | null>('basic');

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="h-full overflow-y-auto px-1 py-2">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 px-1">청첩장 정보 입력</h2>

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
      </div>
    </div>
  );
}