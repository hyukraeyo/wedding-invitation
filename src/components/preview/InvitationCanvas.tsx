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
  const {
    theme,
    editingSection,
    mainScreen,
    imageUrl,
    groom,
    bride,
    date,
    time,
    location,
    coordinates,
    address,
    detailAddress,
    greetingTitle,
    message,
    accounts,
    closing,
    gallery,
    galleryTitle,
    galleryType,
    galleryPreview,
    galleryFade,
    galleryAutoplay,
    galleryPopup
  } = useInvitationStore();

  // Scroll to editing section
  useEffect(() => {
    if (editingSection) {
      const targetId = editingSection;
      if (targetId === 'basic') return; // 기본 정보 클릭 시 프리뷰는 가만히 둠

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
      transform: 'translate3d(0, 0, 0)', // Trap fixed elements like modals within the preview
    };
  }, [theme.backgroundColor, theme.fontScale, theme.font]);

  return (
    <div
      className="w-full h-full bg-white relative shadow-2xl overflow-hidden md:max-w-[430px] md:mx-auto"
      style={canvasStyle as React.CSSProperties}
    >
      <div
        className={`w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-500 ${theme.pattern === 'flower-sm' ? 'pattern-flower-sm' : theme.pattern === 'flower-lg' ? 'pattern-flower-lg' : ''}`}
      >
        <EffectsOverlay
          effect={theme.effect}
          effectOnlyOnMain={theme.effectOnlyOnMain}
        />

        {/* 1. Main Screen */}
        <ScrollReveal id="section-mainScreen">
          <MainScreenView
            mainScreen={mainScreen}
            imageUrl={imageUrl}
            groom={groom}
            bride={bride}
            date={date}
            time={time}
            location={location}
            detailAddress={detailAddress}
            accentColor={theme.accentColor}
          />
        </ScrollReveal>

        {/* 2. Message / Greeting */}
        <GreetingView
          id="section-message"
          greetingTitle={greetingTitle}
          greetingContent={message}
          groom={groom}
          bride={bride}
          accentColor={theme.accentColor}
        />

        {/* 4. Calendar & D-Day */}
        <CalendarSectionView
          id="section-date"
          date={date}
          accentColor={theme.accentColor}
        />

        {/* 5. Location */}
        <LocationView
          id="section-location"
          location={location}
          lat={coordinates?.lat || 37.5665}
          lng={coordinates?.lng || 126.9780}
          address={address}
          detailAddress={detailAddress}
          accentColor={theme.accentColor}
        />

        {/* 6. Gallery */}
        <GalleryView
          id="section-gallery"
          gallery={gallery}
          galleryTitle={galleryTitle}
          galleryType={galleryType}
          galleryPreview={galleryPreview}
          galleryFade={galleryFade}
          galleryAutoplay={galleryAutoplay}
          galleryPopup={galleryPopup}
          accentColor={theme.accentColor}
        />

        {/* 7. Accounts */}
        <AccountsView
          id="section-account"
          accounts={accounts}
          accentColor={theme.accentColor}
        />

        {/* 8. Closing / Ending */}
        <ClosingView
          id="section-closing"
          closingMessage={closing.content}
          accentColor={theme.accentColor}
        />

        {/* Footer Padding */}
        <div className="h-40 flex flex-col items-center justify-center text-[10px] text-black/10 tracking-[0.2em] font-light pb-20">
          <div className="mb-4">COPYRIGHT © 2026 ANTIGRAVITY</div>
          <div>ALL RIGHTS RESERVED</div>
        </div>
      </div>

      {/* Portal Root for Modals (to keep them inside the mockup) */}
      <div id="invitation-modal-root" className="absolute inset-0 pointer-events-none z-[10000]" />
    </div>
  );
});

InvitationCanvas.displayName = 'InvitationCanvas';

export default InvitationCanvas;