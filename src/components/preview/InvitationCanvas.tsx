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
      const element = document.getElementById(`section-${editingSection}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [editingSection]);

  const fontClass = useMemo(
    () => (theme.font === 'serif' ? 'font-serif' : 'font-sans'),
    [theme.font]
  );

  const canvasStyle = useMemo(
    () => ({
      backgroundColor: theme.backgroundColor,
      '--font-scale': theme.fontScale,
    }),
    [theme.backgroundColor, theme.fontScale]
  );

  return (
    <div className="w-full h-full bg-white relative shadow-2xl overflow-hidden md:max-w-[430px] md:mx-auto">
      <div
        className={`w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-500 ${fontClass}`}
        style={canvasStyle}
      >
        <EffectsOverlay />

        {/* 1. Main Screen */}
        <div id="section-mainScreen">
          <MainScreenView />
        </div>

        {/* Divider */}
        <div className="flex justify-center py-4 opacity-5">
          <div className="w-16 h-[1px] bg-forest-green"></div>
        </div>

        {/* 2. Message / Greeting */}
        <div id="section-greeting" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
          <GreetingView />
        </div>

        {/* 3. Detailed Names - Removed as it's redundant with signatures in GreetingView */}


        {/* Divider */}
        <div className="flex justify-center py-6 opacity-5">
          <div className="w-24 h-[1px] bg-forest-green"></div>
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