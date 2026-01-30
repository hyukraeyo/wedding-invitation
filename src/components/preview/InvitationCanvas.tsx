'use client';

import React, { memo, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Banana } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { InvitationData } from '@/store/useInvitationStore';
import MainScreenView from './sections/MainScreenView';
import CalendarSectionView from './sections/CalendarSectionView';
import GreetingView from './sections/GreetingView';
import EffectsOverlay from './sections/EffectsOverlay';
import ScrollReveal from './ScrollReveal';
import styles from './InvitationCanvas.module.scss';
import { clsx } from 'clsx';
import { getFontStyle } from '@/lib/utils/font';
import { Skeleton } from '@/components/ui/Skeleton';
import { FontSizeControl } from './elements/FontSizeControl';

const LocationView = dynamic(() => import('./sections/LocationView'), { ssr: false });
const AccountsView = dynamic(() => import('./sections/AccountsView'));
const ClosingView = dynamic(() => import('./sections/ClosingView'));

const galleryLoading = <Skeleton className={styles.gallerySkeleton ?? ''} />;
const GalleryView = dynamic(() => import('./sections/GalleryView'), {
  ssr: false,
  loading: () => galleryLoading,
});

interface InvitationCanvasProps {
  isPreviewMode?: boolean;
  editingSection?: string | null;
  hideWatermark?: boolean;
  data?: InvitationData; // Allow passing raw data to bypass global store
}

type InvitationCanvasData = Pick<
  InvitationData,
  | 'theme'
  | 'mainScreen'
  | 'imageUrl'
  | 'imageRatio'
  | 'groom'
  | 'bride'
  | 'date'
  | 'time'
  | 'location'
  | 'detailAddress'
  | 'greetingTitle'
  | 'greetingSubtitle'
  | 'message'
  | 'greetingImage'
  | 'greetingRatio'
  | 'showNamesAtBottom'
  | 'enableFreeformNames'
  | 'groomNameCustom'
  | 'brideNameCustom'
  | 'gallery'
  | 'galleryTitle'
  | 'gallerySubtitle'
  | 'galleryType'
  | 'galleryFade'
  | 'galleryAutoplay'
  | 'galleryPopup'
  | 'ddayMessage'
  | 'showCalendar'
  | 'showDday'
  | 'locationTitle'
  | 'locationSubtitle'
  | 'coordinates'
  | 'address'
  | 'mapZoom'
  | 'showMap'
  | 'showNavigation'
  | 'sketchUrl'
  | 'sketchRatio'
  | 'lockMap'
  | 'mapType'
  | 'locationContact'
  | 'accounts'
  | 'accountsTitle'
  | 'accountsSubtitle'
  | 'accountsDescription'
  | 'accountsGroomTitle'
  | 'accountsBrideTitle'
  | 'accountsColorMode'
  | 'closing'
  | 'isApproved'
  | 'kakaoShare'
  | 'slug'
  | 'mapHeight'
>;

const selectInvitationCanvasData = (state: InvitationData): InvitationCanvasData => ({
  theme: state.theme,
  mainScreen: state.mainScreen,
  imageUrl: state.imageUrl,
  imageRatio: state.imageRatio,
  groom: state.groom,
  bride: state.bride,
  date: state.date,
  time: state.time,
  location: state.location,
  detailAddress: state.detailAddress,
  greetingTitle: state.greetingTitle,
  greetingSubtitle: state.greetingSubtitle,
  message: state.message,
  greetingImage: state.greetingImage,
  greetingRatio: state.greetingRatio,
  showNamesAtBottom: state.showNamesAtBottom,
  enableFreeformNames: state.enableFreeformNames,
  groomNameCustom: state.groomNameCustom,
  brideNameCustom: state.brideNameCustom,
  gallery: state.gallery,
  galleryTitle: state.galleryTitle,
  gallerySubtitle: state.gallerySubtitle,
  galleryType: state.galleryType,
  galleryFade: state.galleryFade,
  galleryAutoplay: state.galleryAutoplay,
  galleryPopup: state.galleryPopup,
  ddayMessage: state.ddayMessage,
  showCalendar: state.showCalendar,
  showDday: state.showDday,
  locationTitle: state.locationTitle,
  locationSubtitle: state.locationSubtitle,
  coordinates: state.coordinates,
  address: state.address,
  mapZoom: state.mapZoom,
  showMap: state.showMap,
  showNavigation: state.showNavigation,
  sketchUrl: state.sketchUrl,
  sketchRatio: state.sketchRatio,
  lockMap: state.lockMap,
  mapType: state.mapType,
  locationContact: state.locationContact,
  accounts: state.accounts,
  accountsTitle: state.accountsTitle,
  accountsSubtitle: state.accountsSubtitle,
  accountsDescription: state.accountsDescription,
  accountsGroomTitle: state.accountsGroomTitle,
  accountsBrideTitle: state.accountsBrideTitle,
  accountsColorMode: state.accountsColorMode,
  closing: state.closing,
  isApproved: state.isApproved,
  kakaoShare: state.kakaoShare,
  slug: state.slug,
  mapHeight: state.mapHeight,
});

type InvitationCanvasContentProps = Omit<InvitationCanvasProps, 'data'> & {
  data: InvitationCanvasData;
};

const InvitationCanvasContent = memo(({
  isPreviewMode = false,
  editingSection,
  hideWatermark = false,
  data,
}: InvitationCanvasContentProps) => {
  const [isReady, setIsReady] = React.useState(!isPreviewMode);
  const initialScrollDone = React.useRef(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);


  // Local font scale for transient changes (guest view or preview testing)
  // This ensures "Default cannot be set in the preview"
  const [localFontScale, setLocalFontScale] = React.useState(data.theme.fontScale || 1);

  // Sync local scale when the "Default" from store/props changes
  useEffect(() => {
    setLocalFontScale(data.theme.fontScale || 1);
  }, [data.theme.fontScale]);

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
    kakaoShare,
    slug,
    mapHeight,
  } = data;

  // Scroll to editing section
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let targetId = editingSection;
    if (!targetId || targetId === 'theme' || targetId === 'kakao' || targetId === 'basic') {
      targetId = 'mainScreen';
    }

    const performScroll = (behavior: ScrollBehavior) => {
      try {
        if (!scrollContainerRef.current) return false;

        if (targetId === 'mainScreen') {
          scrollContainerRef.current.scrollTo({
            top: 0,
            behavior,
          });
          return true;
        }

        const element = scrollContainerRef.current.querySelector(`#section-${targetId}`);
        if (element instanceof HTMLElement) {
          // Using offsetTop is much more stable than getBoundingClientRect 
          // because it's relative to the scroll container, not the viewport.
          // This prevents jitter while the drawer is animating/moving.
          const scrollTarget = element.offsetTop;

          scrollContainerRef.current.scrollTo({
            top: scrollTarget,
            behavior,
          });
          return true;
        }
      } catch (error) {
        console.warn('Scroll to section failed:', error);
      }
      return false;
    };

    if (isPreviewMode && !initialScrollDone.current) {
      let attempts = 0;
      const tryInitialScroll = () => {
        // We need to ensure the element exists and has layout
        const element = targetId === 'mainScreen'
          ? scrollContainerRef.current
          : scrollContainerRef.current?.querySelector(`#section-${targetId}`);

        if (element && performScroll('auto')) {
          initialScrollDone.current = true;
          // Increased delay to ~350ms to match the Sheet animation duration.
          // This ensures the content is revealed ONLY after the motion has stopped,
          // eliminating the "jolt" caused by heavy layout paints during translation.
          setTimeout(() => setIsReady(true), 350);
        } else if (attempts < 20) {
          attempts++;
          requestAnimationFrame(tryInitialScroll);
        } else {
          // Fallback: just show it if we can't find the section after many tries
          setIsReady(true);
        }
      };

      // Initial delay to let the Sheet portal mount
      timer = setTimeout(tryInitialScroll, 50);
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // Normal behavior for desktop edits or subsequent mobile updates
      // Using a small timeout to ensure DOM has updated if the component just re-rendered
      const t = setTimeout(() => performScroll('smooth'), 50);
      return () => clearTimeout(t);
    }
  }, [editingSection, isPreviewMode]);


  const canvasStyle = useMemo(
    () => getFontStyle(theme.font, localFontScale, theme.backgroundColor),
    [theme.font, localFontScale, theme.backgroundColor]
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
          !isApproved && !isPreviewMode && !hideWatermark && styles.hasNotice,
          theme.pattern === 'flower-sm' ? 'pattern-flower-sm' :
            theme.pattern === 'flower-lg' ? 'pattern-flower-lg' : ''
        )}
      >
        <EffectsOverlay
          effect={theme.effect}
          effectOnlyOnMain={theme.effectOnlyOnMain}
        />

        {/* 1. Main Screen */}
        <ScrollReveal id="section-mainScreen" animateEntrance={theme.animateEntrance}>
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
            backgroundColor={theme.backgroundColor}
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
          animateEntrance={theme.animateEntrance}
        />

        {/* 3. Gallery (Moved) */}
        <GalleryView
          id="section-gallery"
          gallery={gallery}
          galleryTitle={galleryTitle}
          gallerySubtitle={gallerySubtitle}
          galleryType={galleryType}
          galleryFade={galleryFade}
          galleryAutoplay={galleryAutoplay}
          galleryPopup={galleryPopup}
          accentColor={theme.accentColor}
          animateEntrance={theme.animateEntrance}
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
          animateEntrance={theme.animateEntrance}
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
          animateEntrance={theme.animateEntrance}
          mapHeight={mapHeight}
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
          animateEntrance={theme.animateEntrance}
        />

        {/* 8. Closing / Ending */}
        <ClosingView
          id="section-closing"
          title={closing.title}
          subtitle={closing.subtitle}
          closingMessage={closing.content}
          imageUrl={closing.imageUrl}
          ratio={closing.ratio}
          accentColor={theme.accentColor}
          kakaoShare={kakaoShare}
          groom={groom}
          bride={bride}
          date={date}
          time={time}
          mainImageUrl={imageUrl}
          animateEntrance={theme.animateEntrance}
          address={address}
          location={location}
          slug={slug}
        />

        {/* Footer Padding */}
        <div className={styles.footerPadding}>
          <div className={styles.copyright}>COPYRIGHT © 2026 BANANA WEDDING</div>
          <div>ALL RIGHTS RESERVED</div>
        </div>
      </div>

      {/* Watermark and Notice for unapproved live pages */}
      {!isApproved && !isPreviewMode && !hideWatermark ? (
        <>
          <div className={styles.freeNotice}>
            <div className={styles.marqueeInner}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.marqueeItem}>
                  <Banana size={16} strokeWidth={2.5} />
                  <span>BANANA WEDDING PREMIUM • 워터마크 없는 정식 버전을 위해 승인을 요청해 주세요 • Special Day with Banana</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.watermark} />
        </>
      ) : null}

      {/* Portal Root for Modals (to keep them inside the mockup) */}
      <div id="invitation-modal-root" className={styles.modalRoot} />

      {/* Font Size UX/UI */}
      {theme.allowFontScale && (
        <FontSizeControl
          value={localFontScale}
          onChange={setLocalFontScale}
        />
      )}
    </div>
  );
});

InvitationCanvasContent.displayName = 'InvitationCanvasContent';

const InvitationCanvasFromStore = memo((props: Omit<InvitationCanvasProps, 'data'>) => {
  const storeData = useInvitationStore(useShallow(selectInvitationCanvasData));
  return <InvitationCanvasContent {...props} data={storeData} />;
});

InvitationCanvasFromStore.displayName = 'InvitationCanvasFromStore';

export default function InvitationCanvas(props: InvitationCanvasProps) {
  if (props.data) {
    return <InvitationCanvasContent {...props} data={props.data} />;
  }

  return <InvitationCanvasFromStore {...props} />;
}
