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
        <div id="section-mainScreen">
          <MainScreenView />
        </div>

        {/* Divider */}
        <div className="flex justify-center py-4 opacity-5">
          <div className="w-16 h-[1px]" style={{ backgroundColor: theme.accentColor }}></div>
        </div>

        {/* 2. Message / Greeting */}
        <div id="section-message" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
          <GreetingView />
        </div>

        {/* 3. Detailed Names - Removed as it's redundant with signatures in GreetingView */}


        {/* Divider */}
        <div className="flex justify-center py-6 opacity-5">
          <div className="w-24 h-[1px]" style={{ backgroundColor: theme.accentColor }}></div>
        </div>

        {/* 4. Calendar & D-Day */}
        <div id="section-date" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-backwards">
          <CalendarSectionView />
        </div>

        {/* 5. Location */}
        <div id="section-location" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900 fill-mode-backwards px-6 pb-12">
          <LocationView />
        </div>

        {/* 6. Gallery */}
        <div id="section-gallery" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-backwards">
          <GalleryView />
        </div>

        {/* 7. Accounts */}
        <div id="section-account" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-backwards pb-12">
          <AccountsView />
        </div>

        {/* 8. Closing / Ending */}
        <div id="section-closing" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-backwards pb-12">
          <ClosingView />
        </div>

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