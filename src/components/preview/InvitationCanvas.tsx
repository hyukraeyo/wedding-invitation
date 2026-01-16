'use client';

import React, { memo, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
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
  hideWatermark?: boolean;
  data?: InvitationData; // Allow passing raw data to bypass global store
}

const InvitationCanvas = memo(({ isPreviewMode = false, editingSection, hideWatermark = false, data }: InvitationCanvasProps) => {
  const [isReady, setIsReady] = React.useState(!isPreviewMode);
  const initialScrollDone = React.useRef(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const storeData = useInvitationStore();

  // Use provided data if available, otherwise fallback to store
  const currentData = data || storeData;

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
    detailAddress,
    greetingTitle,
    greetingSubtitle,
    message,
    greetingImage,
    greetingRatio,
    showNamesAtBottom,
    enableFreeformNames,
    groomNameCustom,
    brideNameCustom,
    gallery,
    galleryTitle,
    gallerySubtitle,
    galleryType,
    galleryPreview,
    galleryFade,
    galleryAutoplay,
    galleryPopup,
    ddayMessage,
    showCalendar,
    showDday,
    locationTitle,
    locationSubtitle,
    coordinates,
    address,
    mapZoom,
    showMap,
    showNavigation,
    sketchUrl,
    sketchRatio,
    lockMap,
    mapType,
    locationContact,
    accounts,
    accountsTitle,
    accountsSubtitle,
    accountsDescription,
    accountsGroomTitle,
    accountsBrideTitle,
    accountsColorMode,
    closing,
    isApproved,
  } = currentData;

  // Scroll to editing section
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let targetId = editingSection;
    if (!targetId || targetId === 'theme' || targetId === 'kakao' || targetId === 'basic') {
      targetId = 'mainScreen';
    }

    const performScroll = (behavior: ScrollBehavior) => {
      try {
        if (targetId === 'mainScreen' && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: 0,
            behavior,
          });
          return true;
        }

        const element = document.getElementById(`section-${targetId}`);
        if (element) {
          element.scrollIntoView({
            behavior,
            block: 'start',
            inline: 'nearest'
          });
          return true;
        }
      } catch (error) {
        console.warn('Scroll to section failed:', error);
      }
      return false;
    };

    if (isPreviewMode && !initialScrollDone.current) {
      // For mobile preview entrance: be more aggressive to hide the top flash
      let attempts = 0;
      const tryInitialScroll = () => {
        if (performScroll('auto')) {
          initialScrollDone.current = true;
          // Small extra delay before showing to ensure rendering has settled
          // 80ms feels like the sweet spot for Radix Sheet animations
          setTimeout(() => setIsReady(true), 80);
        } else if (attempts < 15) {
          attempts++;
          requestAnimationFrame(tryInitialScroll);
        }
      };

      timer = setTimeout(tryInitialScroll, 50); // Minimal delay for Sheet mount
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // Normal behavior for desktop edits or subsequent mobile updates
      performScroll('smooth');
      return undefined; // Explicitly return undefined
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
        ref={scrollContainerRef}
        className={clsx(
          styles.scrollArea,
          !isReady && styles.hidden,
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

      {/* Watermark for unapproved live pages */}
      {!isApproved && !isPreviewMode && !hideWatermark ? (
        <div className={styles.watermark} />
      ) : null}

      {/* Portal Root for Modals (to keep them inside the mockup) */}
      <div id="invitation-modal-root" className={styles.modalRoot} />
    </div>
  );
});

InvitationCanvas.displayName = 'InvitationCanvas';

export default InvitationCanvas;
