'use client';

import React, { memo, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore } from '@/store/useInvitationStore';
import MainScreenView from './sections/MainScreenView';
import CalendarSectionView from './sections/CalendarSectionView';
// import NamesView from './sections/NamesView';
import GreetingView from './sections/GreetingView';
import GalleryView from './sections/GalleryView';
import AccountsView from './sections/AccountsView';
import ClosingView from './sections/ClosingView';
import EffectsOverlay from './sections/EffectsOverlay';
import ScrollReveal from './ScrollReveal';
import styles from './InvitationCanvas.module.scss';
import { clsx } from 'clsx';

const LocationView = dynamic(() => import('./sections/LocationView'), { ssr: false });

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
    locationContact,
    greetingTitle,
    greetingImage,
    message,
    showNamesAtBottom,
    enableFreeformNames,
    groomNameCustom,
    accounts,
    accountsTitle,
    accountsDescription,
    accountsGroomTitle,
    accountsBrideTitle,
    accountsColorMode,
    closing,
    gallery,
    galleryTitle,
    galleryType,
    galleryPreview,
    galleryFade,
    galleryAutoplay,
    galleryPopup,
    mapZoom,
    showMap,
    showNavigation,
    showSketch,
    sketchUrl,
    lockMap,
    ddayMessage,
    greetingSubtitle,
    mapType,
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

    const fontVars = [
      '--font-serif',
      '--font-sans',
      '--font-gowun-batang',
      '--font-gowun-dodum',
      '--font-nanum-myeongjo',
      '--font-yeon-sung',
      '--font-do-hyeon',
      '--font-song-myung',
      '--font-pretendard',
      '--font-gmarket-sans',
      '--font-script',
    ];

    const styleOverrides: Record<string, string | number> = {
      backgroundColor: theme.backgroundColor,
      '--font-scale': theme.fontScale,
      fontFamily: selectedFontValue,
      transform: 'translate3d(0, 0, 0)',
    };

    // 현재 선택된 폰트 변수를 제외한 모든 폰트 변수를 선택된 폰트로 오버라이드
    fontVars.forEach(v => {
      if (v !== selectedFontVar) {
        styleOverrides[v] = selectedFontValue;
      }
    });

    return styleOverrides;
  }, [theme.backgroundColor, theme.fontScale, theme.font]);

  return (
    <div
      className={styles.canvasWrapper}
      style={canvasStyle as React.CSSProperties}
    >
      <div
        className={clsx(
          styles.scrollArea,
          theme.pattern === 'flower-sm' ? 'pattern-flower-sm' :
            theme.pattern === 'flower-lg' ? 'pattern-flower-lg' : ''
        )}
      >
        <EffectsOverlay
          effect={theme.effect}
          effectOnlyOnMain={theme.effectOnlyOnMain}
        />

        {/* 1. Main Screen */}
        <ScrollReveal id="section-mainScreen">
          <MainScreenView
            mainScreen={mainScreen}
            imageUrl={imageUrl || undefined}
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
          greetingSubtitle={greetingSubtitle}
          greetingContent={message}
          greetingImage={greetingImage || undefined}
          showNamesAtBottom={showNamesAtBottom}
          enableFreeformNames={enableFreeformNames}
          freeformNames={groomNameCustom || ''}
          groom={groom}
          bride={bride}
          accentColor={theme.accentColor}
        />

        {/* 4. Calendar & D-Day */}
        <CalendarSectionView
          id="section-date"
          date={date}
          time={time}
          accentColor={theme.accentColor}
          ddayMessage={ddayMessage}
          groom={groom}
          bride={bride}
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
          mapZoom={mapZoom}
          showMap={showMap}
          showNavigation={showNavigation}
          showSketch={showSketch}
          sketchUrl={sketchUrl || undefined}
          lockMap={lockMap}
          mapType={mapType}
          locationContact={locationContact}
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
          title={accountsTitle}
          description={accountsDescription}
          groomTitle={accountsGroomTitle}
          brideTitle={accountsBrideTitle}
          colorMode={accountsColorMode as 'accent' | 'subtle' | 'white'}
          accentColor={theme.accentColor}
        />

        {/* 8. Closing / Ending */}
        <ClosingView
          id="section-closing"
          closingMessage={closing.content}
          accentColor={theme.accentColor}
        />

        {/* Footer Padding */}
        <div className={styles.footerPadding}>
          <div className={styles.copyright}>COPYRIGHT © 2026 ANTIGRAVITY</div>
          <div>ALL RIGHTS RESERVED</div>
        </div>
      </div>

      {/* Portal Root for Modals (to keep them inside the mockup) */}
      <div id="invitation-modal-root" className={styles.modalRoot} />
    </div>
  );
});

InvitationCanvas.displayName = 'InvitationCanvas';

export default InvitationCanvas;