'use client';

import React, { memo, useMemo, useEffect, useLayoutEffect } from 'react';
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
import { FontSizeControl } from './elements/FontSizeControl';
import { SectionLoader } from '@/components/ui/SectionLoader';

const LocationView = dynamic(() => import('./sections/LocationView'), {
  ssr: false,
  loading: () => <SectionLoader height={320} message="지도를 준비하고 있어요" />,
});

const AccountsView = dynamic(() => import('./sections/AccountsView'), {
  loading: () => <SectionLoader height={160} message="계좌 정보를 불러오고 있어요" />,
});

const ClosingView = dynamic(() => import('./sections/ClosingView'), {
  loading: () => <SectionLoader height={240} message="마무리 중이에요" />,
});

const GalleryView = dynamic(() => import('./sections/GalleryView'), {
  ssr: false,
  loading: () => <SectionLoader height={400} message="사진을 불러오고 있어요" />,
});

interface InvitationCanvasProps {
  isPreviewMode?: boolean;
  editingSection?: string | null;
  hideWatermark?: boolean;
  disableInternalScroll?: boolean;
  data?: InvitationData; // Allow passing raw data to bypass global store
}

const EDITING_SECTION_TO_PREVIEW_ID: Record<string, string> = {
  basic: 'section-mainScreen',
  theme: 'section-mainScreen',
  mainScreen: 'section-mainScreen',
  message: 'section-message',
  gallery: 'section-gallery',
  date: 'section-date',
  location: 'section-location',
  account: 'section-account',
  closing: 'section-closing',
  kakao: 'section-closing',
};

function resolveScrollHost(
  scrollContainer: HTMLDivElement | null,
  targetElement: HTMLElement,
  disableInternalScroll: boolean
): HTMLElement | null {
  if (!disableInternalScroll) {
    return scrollContainer;
  }

  let currentElement = targetElement.parentElement;

  while (currentElement) {
    const { overflowY, overflow } = window.getComputedStyle(currentElement);
    const isScrollable =
      /(auto|scroll)/.test(overflowY) || /(auto|scroll)/.test(overflow);

    if (isScrollable && currentElement.scrollHeight > currentElement.clientHeight) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : null;
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
  | 'dateTimeTitle'
  | 'dateTimeSubtitle'
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
  dateTimeTitle: state.dateTimeTitle,
  dateTimeSubtitle: state.dateTimeSubtitle,
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

const InvitationCanvasContent = memo(
  ({
    isPreviewMode = false,
    editingSection,
    hideWatermark = false,
    disableInternalScroll = false,
    data,
  }: InvitationCanvasContentProps) => {
    const [isReady, setIsReady] = React.useState(!isPreviewMode);
    const isMounted = React.useRef(true);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    useEffect(() => {
      if (isReady) return undefined;

      const frameId = requestAnimationFrame(() => {
        if (isMounted.current) {
          setIsReady(true);
        }
      });

      return () => cancelAnimationFrame(frameId);
    }, [isReady]);

    useLayoutEffect(() => {
      if (!isReady || !editingSection) return undefined;

      const targetId = EDITING_SECTION_TO_PREVIEW_ID[editingSection];
      if (!targetId) return undefined;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return undefined;

      const scrollHost = resolveScrollHost(scrollContainerRef.current, targetElement, disableInternalScroll);
      if (!scrollHost) return undefined;

      if (scrollHost === document.documentElement || scrollHost === document.body) {
        const nextScrollTop = targetElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, Math.max(nextScrollTop, 0));
        return undefined;
      }

      const hostRect = scrollHost.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const nextScrollTop = targetRect.top - hostRect.top + scrollHost.scrollTop;

      scrollHost.scrollTop = Math.max(nextScrollTop, 0);

      return undefined;
    }, [disableInternalScroll, editingSection, isReady]);

    // Local font scale for transient changes (guest view or preview testing)
    // This ensures "Default cannot be set in the preview"
    const [localFontScale, setLocalFontScale] = React.useState(data.theme.fontScale || 1);

    const {
      theme,
      mainScreen,
      imageUrl,
      imageRatio,
      groom,
      bride,
      date,
      time,
      dateTimeTitle,
      dateTimeSubtitle,
      location: locationLabel,
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

    // Sync local scale when the "Default" from store/props changes
    useEffect(() => {
      if (isMounted.current) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Preview-only override must reset when the source font scale changes.
        setLocalFontScale(data.theme.fontScale || 1);
      }
    }, [data.theme.fontScale]);

    const canvasStyle = useMemo(
      () => getFontStyle(theme.font, localFontScale, theme.backgroundColor),
      [theme.font, localFontScale, theme.backgroundColor]
    );
    const enableSectionEntrance = theme.animateEntrance && !editingSection;

    return (
      <div
        className={clsx(styles.canvasWrapper, disableInternalScroll && styles.fullHeight)}
        style={canvasStyle as React.CSSProperties}
      >
        <div
          ref={scrollContainerRef}
          className={clsx(
            styles.scrollArea,
            disableInternalScroll && styles.disableScroll,
            !isReady && styles.hidden,
            !isApproved && !isPreviewMode && !hideWatermark && styles.hasNotice,
            theme.pattern === 'flower-sm'
              ? 'pattern-flower-sm'
              : theme.pattern === 'flower-lg'
                ? 'pattern-flower-lg'
                : ''
          )}
        >
          <EffectsOverlay effect={theme.effect} effectOnlyOnMain={theme.effectOnlyOnMain} />

          {/* 1. Main Screen */}
          <ScrollReveal id="section-mainScreen" animateEntrance={enableSectionEntrance}>
            <MainScreenView
              mainScreen={mainScreen}
              imageUrl={imageUrl || undefined}
              imageRatio={imageRatio}
              groom={groom}
              bride={bride}
              date={date}
              time={time}
              location={locationLabel}
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
            animateEntrance={enableSectionEntrance}
          />

          {/* 3. Gallery (Moved) */}
          <div id="section-gallery">
            <GalleryView
              gallery={gallery}
              galleryTitle={galleryTitle}
              gallerySubtitle={gallerySubtitle}
              galleryType={galleryType}
              galleryFade={galleryFade}
              galleryAutoplay={galleryAutoplay}
              galleryPopup={galleryPopup}
              accentColor={theme.accentColor}
              animateEntrance={enableSectionEntrance}
              isEditing={editingSection === 'gallery'}
            />
          </div>

          {/* 4. Calendar & D-Day */}
          <CalendarSectionView
            id="section-date"
            date={date}
            time={time}
            title={dateTimeTitle}
            subtitle={dateTimeSubtitle}
            accentColor={theme.accentColor}
            ddayMessage={ddayMessage}
            groom={groom}
            bride={bride}
            showCalendar={showCalendar}
            showDday={showDday}
            animateEntrance={enableSectionEntrance}
          />

          {/* 5. Location */}
          <div id="section-location">
            <LocationView
              title={locationTitle}
              subtitle={locationSubtitle}
              location={locationLabel}
              lat={coordinates?.lat ?? 0}
              lng={coordinates?.lng ?? 0}
              address={address}
              detailAddress={detailAddress}
              accentColor={theme.accentColor}
              mapZoom={mapZoom}
              showMap={showMap && coordinates !== null}
              showNavigation={showNavigation}
              sketchUrl={sketchUrl || undefined}
              sketchRatio={sketchRatio}
              lockMap={lockMap}
              mapType={mapType}
              locationContact={locationContact}
              animateEntrance={enableSectionEntrance}
              mapHeight={mapHeight}
            />
          </div>

          {/* 7. Accounts */}
          <div id="section-account">
            <AccountsView
              accounts={accounts}
              title={accountsTitle}
              subtitle={accountsSubtitle}
              description={accountsDescription}
              groomTitle={accountsGroomTitle}
              brideTitle={accountsBrideTitle}
              colorMode={accountsColorMode as 'accent' | 'subtle' | 'white'}
              accentColor={theme.accentColor}
              animateEntrance={enableSectionEntrance}
              isEditing={editingSection === 'account'}
            />
          </div>

          {/* 8. Closing / Ending */}
          <div id="section-closing">
            <ClosingView
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
              animateEntrance={enableSectionEntrance}
              address={address}
              location={locationLabel}
              slug={slug}
              isEditing={editingSection === 'closing'}
            />
          </div>

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
                    <span>
                      BANANA WEDDING PREMIUM • 워터마크 없는 정식 버전을 위해 승인을 요청해 주세요 •
                      Special Day with Banana
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.watermark} />
          </>
        ) : null}

        {/* Font Size UX/UI */}
        {theme.allowFontScale && (
          <FontSizeControl value={localFontScale} onChange={setLocalFontScale} />
        )}
      </div>
    );
  }
);

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
