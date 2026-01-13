'use client';

import React, { memo, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore } from '@/store/useInvitationStore';
import MainScreenView from './sections/MainScreenView';
import CalendarSectionView from './sections/CalendarSectionView';
import GreetingView from './sections/GreetingView';
import GalleryView from './sections/GalleryView';
import AccountsView from './sections/AccountsView';
import ClosingView from './sections/ClosingView';
import EffectsOverlay from './sections/EffectsOverlay';
import ScrollReveal from './ScrollReveal';
import styles from './InvitationCanvas.module.scss';
import { clsx } from 'clsx';
import { getFontStyle } from '@/lib/utils/font';

const LocationView = dynamic(() => import('./sections/LocationView'), { ssr: false });

interface InvitationCanvasProps {
  isPreviewMode?: boolean;
  editingSection?: string | null;
}

const InvitationCanvas = memo(({ isPreviewMode = false, editingSection }: InvitationCanvasProps) => {
  const {
    theme,
    mainScreen,
    imageUrl,
    imageRatio,
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
    greetingRatio,
    message,
    showNamesAtBottom,
    enableFreeformNames,
    groomNameCustom,
    brideNameCustom,
    accounts,
    accountsTitle,
    accountsSubtitle,
    accountsDescription,
    accountsGroomTitle,
    accountsBrideTitle,
    accountsColorMode,
    closing,
    gallery,
    galleryTitle,
    gallerySubtitle,
    galleryType,
    galleryPreview,
    galleryFade,
    galleryAutoplay,
    galleryPopup,
    mapZoom,
    locationTitle,
    locationSubtitle,
    showMap,
    showNavigation,
    sketchUrl,
    sketchRatio,
    lockMap,
    ddayMessage,
    greetingSubtitle,
    mapType,
    showCalendar,
    showDday,
  } = useInvitationStore();

  // Scroll to editing section
  useEffect(() => {
    // If editingSection is null, or it's a section that doesn't exist in preview (theme, kakao),
    // scroll to top (mainScreen)
    let targetId = editingSection;
    if (!targetId || targetId === 'theme' || targetId === 'kakao') {
      targetId = 'mainScreen';
    } else if (targetId === 'basic') {
      targetId = 'mainScreen';
    }

    try {
      const element = document.getElementById(`section-${targetId}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } catch (error) {
      console.warn('Scroll to section failed:', error);
    }
  }, [editingSection, isPreviewMode]);


  const canvasStyle = useMemo(
    () => getFontStyle(theme.font, theme.fontScale, theme.backgroundColor),
    [theme.font, theme.fontScale, theme.backgroundColor]
  );

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
            imageRatio={imageRatio}
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
          greetingRatio={greetingRatio}
          showNamesAtBottom={showNamesAtBottom}
          enableFreeformNames={enableFreeformNames}
          groomNameCustom={groomNameCustom}
          brideNameCustom={brideNameCustom}
          groom={groom}
          bride={bride}
          accentColor={theme.accentColor}
        />

        {/* 3. Gallery (Moved) */}
        <GalleryView
          id="section-gallery"
          gallery={gallery}
          galleryTitle={galleryTitle}
          gallerySubtitle={gallerySubtitle}
          galleryType={galleryType}
          galleryPreview={galleryPreview}
          galleryFade={galleryFade}
          galleryAutoplay={galleryAutoplay}
          galleryPopup={galleryPopup}
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
          showCalendar={showCalendar}
          showDday={showDday}
        />

        {/* 5. Location */}
        <LocationView
          id="section-location"
          title={locationTitle}
          subtitle={locationSubtitle}
          location={location}
          lat={coordinates?.lat || 37.5665}
          lng={coordinates?.lng || 126.9780}
          address={address}
          detailAddress={detailAddress}
          accentColor={theme.accentColor}
          mapZoom={mapZoom}
          showMap={showMap}
          showNavigation={showNavigation}
          sketchUrl={sketchUrl || undefined}
          sketchRatio={sketchRatio}
          lockMap={lockMap}
          mapType={mapType}
          locationContact={locationContact}
        />

        {/* 7. Accounts */}
        <AccountsView
          id="section-account"
          accounts={accounts}
          title={accountsTitle}
          subtitle={accountsSubtitle}
          description={accountsDescription}
          groomTitle={accountsGroomTitle}
          brideTitle={accountsBrideTitle}
          colorMode={accountsColorMode as 'accent' | 'subtle' | 'white'}
          accentColor={theme.accentColor}
        />

        {/* 8. Closing / Ending */}
        <ClosingView
          id="section-closing"
          title={closing.title}
          subtitle={closing.subtitle}
          closingMessage={closing.content}
          imageUrl={closing.imageUrl}
          ratio={closing.ratio}
          effect={closing.effect}
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