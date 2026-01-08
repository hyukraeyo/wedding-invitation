'use client';

import React, { memo, useMemo, useEffect } from 'react';
import { useInvitationStore } from '@/store/useInvitationStore';
import MainScreenView from './sections/MainScreenView';
import CalendarSectionView from './sections/CalendarSectionView';
// import NamesView from './sections/NamesView';
import GreetingView from './sections/GreetingView';
import LocationView from './sections/LocationView';
import GalleryView from './sections/GalleryView';
import AccountsView from './sections/AccountsView';
import ClosingView from './sections/ClosingView';
import EffectsOverlay from './sections/EffectsOverlay';
import ScrollReveal from './ScrollReveal';

const InvitationCanvas = memo(() => {
  const { theme, editingSection } = useInvitationStore();

  // Scroll to editing section
  useEffect(() => {
    if (editingSection) {
      let targetId = editingSection;
      if (targetId === 'basic') targetId = 'mainScreen';

      const element = document.getElementById(`section-${targetId}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [editingSection]);

  const canvasStyle = useMemo(() => {
    let selectedFontVar = '--font-pretendard';
    switch (theme.font) {
      case 'pretendard': selectedFontVar = '--font-pretendard'; break;
      case 'gmarket': selectedFontVar = '--font-gmarket-sans'; break;
      case 'gowun-batang': selectedFontVar = '--font-gowun-batang'; break;
      case 'gowun-dodum': selectedFontVar = '--font-gowun-dodum'; break;
      case 'nanum-myeongjo': selectedFontVar = '--font-nanum-myeongjo'; break;
      case 'yeon-sung': selectedFontVar = '--font-yeon-sung'; break;
      case 'do-hyeon': selectedFontVar = '--font-do-hyeon'; break;
      case 'song-myung': selectedFontVar = '--font-song-myung'; break;
      case 'serif': selectedFontVar = '--font-serif'; break;
      case 'sans': selectedFontVar = '--font-sans'; break;
    }

    const selectedFontValue = `var(${selectedFontVar})`;

    return {
      backgroundColor: theme.backgroundColor,
      '--font-scale': theme.fontScale,
      // Global overrides for Tailwind classes inside the canvas
      '--font-serif': selectedFontValue,
      '--font-sans': selectedFontValue,
      fontFamily: selectedFontValue,
    };
  }, [theme.backgroundColor, theme.fontScale, theme.font]);

  return (
    <div className="w-full h-full bg-white relative shadow-2xl overflow-hidden md:max-w-[430px] md:mx-auto">
      <div
        className={`w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-500 ${theme.pattern === 'flower-sm' ? 'pattern-flower-sm' : theme.pattern === 'flower-lg' ? 'pattern-flower-lg' : ''}`}
        style={canvasStyle as React.CSSProperties}
      >
        <EffectsOverlay />

        {/* 1. Main Screen */}
        <ScrollReveal id="section-mainScreen">
          <MainScreenView />
        </ScrollReveal>

        {/* 2. Message / Greeting */}
        <ScrollReveal id="section-message">
          <GreetingView />
        </ScrollReveal>

        {/* Divider */}
        <div className="flex justify-center py-6 opacity-5">
          <div className="w-24 h-[1px]" style={{ backgroundColor: theme.accentColor }}></div>
        </div>

        {/* 4. Calendar & D-Day */}
        <ScrollReveal id="section-date">
          <CalendarSectionView />
        </ScrollReveal>

        {/* 5. Location */}
        <ScrollReveal id="section-location" className="px-6 pb-12 pt-12">
          <LocationView />
        </ScrollReveal>

        {/* 6. Gallery */}
        <ScrollReveal id="section-gallery">
          <GalleryView />
        </ScrollReveal>

        {/* 7. Accounts */}
        <ScrollReveal id="section-account" className="pb-12">
          <AccountsView />
        </ScrollReveal>

        {/* 8. Closing / Ending */}
        <ScrollReveal id="section-closing" className="pb-12">
          <ClosingView />
        </ScrollReveal>

        {/* Footer Padding */}
        <div className="h-40 flex flex-col items-center justify-center text-[10px] text-black/10 tracking-[0.2em] font-light pb-20">
          <div className="mb-4">COPYRIGHT © 2026 ANTIGRAVITY</div>
          <div>ALL RIGHTS RESERVED</div>
        </div>
      </div>
    </div>
  );
});

InvitationCanvas.displayName = 'InvitationCanvas';

export default InvitationCanvas;