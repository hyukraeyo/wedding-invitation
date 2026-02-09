'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { AmpersandSVG, HeartSVG, RingIcon } from '../../common/Icons';
import { Heading } from '@/components/ui/Heading';
import styles from './MainScreenView.module.scss';
import { clsx } from 'clsx';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { Placeholder } from '@/components/ui/Placeholder';

interface Person {
  lastName: string;
  firstName: string;
}

interface MainScreenViewProps {
  mainScreen: {
    layout:
      | 'classic'
      | 'minimal'
      | 'english'
      | 'heart'
      | 'korean'
      | 'arch'
      | 'oval'
      | 'frame'
      | 'fill'
      | 'basic';
    showTitle: boolean;
    title: string;
    showGroomBride: boolean;
    andText: string;
    suffixText: string;
    showSubtitle: boolean;
    subtitle: string;
    showDatePlace: boolean;
    customDatePlace: string;
    showBorder: boolean;
    expandPhoto: boolean;
    effect: 'none' | 'mist' | 'ripple';
    imageShape?: 'rect' | 'arch' | 'oval';
    groomName?: string;
    brideName?: string;
  };
  imageUrl: string | null | undefined;
  imageRatio?: 'fixed' | 'auto';
  groom: Person;
  bride: Person;
  date?: string;
  time?: string;
  location: string;
  detailAddress?: string | null | undefined;
  accentColor: string;
}

const DEFAULT_MAIN_SCREEN = {
  layout: 'classic' as const,
  showTitle: true,
  title: 'THE MARRIAGE',
  showGroomBride: true,
  andText: '그리고',
  suffixText: '',
  showSubtitle: true,
  subtitle: '소중한 날에 초대해요',
  showDatePlace: true,
  customDatePlace: '',
  showBorder: false,
  expandPhoto: false,
  effect: 'none' as const,
  groomName: '',
  brideName: '',
};

const DEFAULT_PERSON = {
  firstName: '',
  lastName: '',
  relation: '',
  parents: {
    father: { name: '', isDeceased: false },
    mother: { name: '', isDeceased: false },
  },
};

const formatDatePlaceArea = (
  customDatePlace: string,
  date?: string,
  time?: string,
  location?: string,
  detailAddress?: string | null
) => {
  const hasCustomText = customDatePlace?.replace(/<[^>]*>/g, '').trim().length > 0;

  if (hasCustomText) return customDatePlace;

  if (date && time) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][d.getDay()];

    const [h = '12', m = '00'] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour < 12 ? '오전' : '오후';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    const dateStr = `${year}년 ${month}월 ${day}일 ${week}`;
    const timeStr = `${ampm} ${displayHour}시 ${m === '00' ? '' : `${m}분`}`;
    const fullLocation = [location, detailAddress].filter(Boolean).join(' ');

    return `${dateStr} ${timeStr}${fullLocation ? `<br/>${fullLocation}` : ''}`;
  }

  return [location, detailAddress].filter(Boolean).join(' ') || '';
};

/**
 * Presentational Component for the Main Screen.
 */
const MainScreenView = memo(
  ({
    mainScreen: rawMainScreen,
    imageUrl,
    imageRatio = 'fixed',
    groom: rawGroom,
    bride: rawBride,
    date,
    time,
    location,
    detailAddress,
    accentColor,
    backgroundColor,
  }: MainScreenViewProps & { backgroundColor?: string }) => {
    // const bgColor = useInvitationStore((state) => state.theme.backgroundColor); // Removed store dependency
    const bgColor = backgroundColor;
    const mainScreen = rawMainScreen || DEFAULT_MAIN_SCREEN;
    const groom = rawGroom || DEFAULT_PERSON;
    const bride = rawBride || DEFAULT_PERSON;

    const isFillLayout = mainScreen.layout === 'fill' || mainScreen.layout === 'heart';
    const isBasicLayout = ['classic', 'minimal', 'english', 'korean', 'basic'].includes(
      mainScreen.layout
    );

    const displayText = formatDatePlaceArea(
      mainScreen.customDatePlace,
      date,
      time,
      location,
      detailAddress
    );

    // SEO: Dynamic Alt Text
    const groomName = groom.firstName ? `${groom.lastName}${groom.firstName}` : '신랑';
    const brideName = bride.firstName ? `${bride.lastName}${bride.firstName}` : '신부';
    const imageAlt = `${groomName} & ${brideName}의 결혼식`;

    return (
      <div className={clsx(styles.wrapper, isFillLayout ? styles.fill : styles.standard) || ''}>
        <div className={clsx(styles.content, isFillLayout ? styles.centerFill : styles.pt10) || ''}>
          {/* 1. Header Area */}
          <div
            className={
              clsx(styles.headerArea, isBasicLayout ? styles.headerVisible : styles.headerHidden) ||
              ''
            }
          >
            {mainScreen.layout === 'classic' ? (
              <Heading
                as="h1"
                size="1"
                className={clsx(styles.mainTitle) || ''}
                style={{ fontSize: 'calc(10px * var(--font-scale))', color: accentColor }}
              >
                {mainScreen.title || 'THE MARRIAGE'}
              </Heading>
            ) : null}

            {mainScreen.layout === 'minimal' ? (
              <>
                <div
                  className={clsx(styles.minimalDateRow) || ''}
                  style={{ fontSize: 'calc(28px * var(--font-scale))' }}
                >
                  {date
                    ? (() => {
                        const d = new Date(date);
                        return (
                          <>
                            <span className={clsx(styles.minimalDateBox) || ''}>
                              {d.getFullYear()}
                            </span>
                            <span className={clsx(styles.minimalDateBox) || ''}>
                              {String(d.getMonth() + 1).padStart(2, '0')}
                            </span>
                            <span className={clsx(styles.minimalDateBox) || ''}>
                              {String(d.getDate()).padStart(2, '0')}
                            </span>
                          </>
                        );
                      })()
                    : null}
                </div>
                <div
                  className={clsx(styles.weekdayText) || ''}
                  style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                >
                  {date
                    ? [
                        'SUNDAY',
                        'MONDAY',
                        'TUESDAY',
                        'WEDNESDAY',
                        'THURSDAY',
                        'FRIDAY',
                        'SATURDAY',
                      ][new Date(date).getDay()]
                    : null}
                </div>
              </>
            ) : null}

            {mainScreen.layout === 'english' ? (
              mainScreen.title ? (
                <Heading
                  as="h1"
                  size="1"
                  className={clsx(styles.mainTitle) || ''}
                  style={{
                    fontSize: 'calc(12px * var(--font-scale))',
                    color: accentColor,
                    letterSpacing: '0.15em',
                  }}
                >
                  {mainScreen.title}
                </Heading>
              ) : null
            ) : null}

            {mainScreen.layout === 'korean' ? (
              <>
                {mainScreen.title ? (
                  <Heading
                    as="h1"
                    size="5"
                    className={clsx(styles.koreanTitle) || ''}
                    style={{ fontSize: 'calc(18px * var(--font-scale))' }}
                  >
                    {mainScreen.title}
                  </Heading>
                ) : null}
                {mainScreen.subtitle ? (
                  <div
                    className={clsx(styles.koreanSubtitle) || ''}
                    style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                  >
                    {mainScreen.subtitle}
                  </div>
                ) : null}
              </>
            ) : null}

            {['classic', 'minimal', 'english', 'korean'].includes(mainScreen.layout) ? (
              <div
                className={
                  clsx(
                    styles.namesWrapper,
                    (mainScreen.andText || '그리고') === '·'
                      ? styles.gapSmall
                      : (mainScreen.andText || '그리고').length <= 2
                        ? styles.gapMedium
                        : styles.gapLarge
                  ) || ''
                }
                style={{ fontSize: 'calc(17px * var(--font-scale))' }}
              >
                <span className={clsx(styles.nameText) || ''}>
                  {mainScreen.groomName ||
                    (groom.lastName || groom.firstName
                      ? `${groom.lastName}${groom.firstName}`
                      : '신랑')}
                </span>
                <span
                  className={clsx(styles.connector) || ''}
                  style={{
                    fontSize:
                      (mainScreen.andText || '그리고').length === 1
                        ? 'calc(20px * var(--font-scale))'
                        : 'calc(15px * var(--font-scale))',
                    color: accentColor,
                    transform:
                      (mainScreen.andText || '그리고') === '·' ? 'translateY(-15%)' : 'none',
                    paddingInline: (mainScreen.andText || '그리고').length > 1 ? '0.2rem' : '0',
                  }}
                >
                  {mainScreen.andText === '&' ? (
                    <AmpersandSVG className={clsx(styles.ampersand) || ''} />
                  ) : mainScreen.andText === 'ring' ? (
                    <RingIcon className={clsx(styles.ringIcon) || ''} />
                  ) : (
                    mainScreen.andText || '그리고'
                  )}
                </span>
                <span className={clsx(styles.nameText) || ''}>
                  {mainScreen.brideName ||
                    (bride.lastName || bride.firstName
                      ? `${bride.lastName}${bride.firstName}`
                      : '신부')}
                </span>
              </div>
            ) : null}

            {mainScreen.layout === 'heart' ? (
              <Heading
                as="h1"
                size="3"
                className={clsx(styles.heartNamesRow) || ''}
                style={{ fontSize: 'calc(22px * var(--font-scale))' }}
              >
                <span>
                  {mainScreen.groomName ||
                    (groom.lastName || groom.firstName
                      ? `${groom.lastName}${groom.firstName}`
                      : '신랑')}
                </span>
                <span
                  className={clsx(styles.heartIcon) || ''}
                  style={{ color: 'var(--color-error)' }}
                >
                  ♥
                </span>
                <span>
                  {mainScreen.brideName ||
                    (bride.lastName || bride.firstName
                      ? `${bride.lastName}${bride.firstName}`
                      : '신부')}
                </span>
              </Heading>
            ) : null}

            {mainScreen.layout === 'english' && mainScreen.subtitle ? (
              <div
                className={clsx(styles.englishSubtitle) || ''}
                style={{ fontSize: 'calc(13px * var(--font-scale))', marginTop: '0.5rem' }}
              >
                {mainScreen.subtitle}
              </div>
            ) : null}
          </div>

          {/* 2. Photo Area */}
          <div
            className={
              clsx(
                styles.imageFrame,
                isFillLayout ? styles.imageFill : styles.imageStandard,
                mainScreen.layout === 'classic' && styles.classic,
                mainScreen.expandPhoto && styles.expanded,
                !isFillLayout &&
                  mainScreen.layout !== 'arch' &&
                  mainScreen.layout !== 'oval' &&
                  !(
                    mainScreen.layout === 'classic' &&
                    (mainScreen.imageShape === 'arch' || mainScreen.imageShape === 'oval')
                  ) &&
                  styles.bgGray,
                !isFillLayout && styles[imageRatio],
                mainScreen.effect === 'mist' && styles.mistEffect
              ) || ''
            }
            style={{
              borderColor: 'transparent',
              borderWidth: '0px',
              borderStyle: 'none',
              borderRadius:
                mainScreen.layout === 'arch'
                  ? `170px 170px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}`
                  : mainScreen.layout === 'oval'
                    ? '170px'
                    : mainScreen.layout === 'classic' && mainScreen.imageShape === 'arch'
                      ? `170px 170px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}`
                      : mainScreen.layout === 'classic' && mainScreen.imageShape === 'oval'
                        ? '170px'
                        : mainScreen.expandPhoto
                          ? '0px'
                          : mainScreen.layout === 'basic'
                            ? `20px 20px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}`
                            : mainScreen.layout === 'frame'
                              ? `4px 4px ${mainScreen.effect === 'mist' ? '0px 0px' : '4px 4px'}`
                              : mainScreen.layout === 'fill'
                                ? '0px'
                                : `20px 20px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}`,
            }}
          >
            {imageUrl ? (
              imageRatio === 'fixed' && !isFillLayout ? (
                <AspectRatio ratio={4 / 5} className={clsx(styles.fullSize) || ''}>
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes={IMAGE_SIZES.section}
                    className={clsx(styles.mainImage) || ''}
                    style={{ objectFit: 'cover' }}
                    priority
                    loading="eager"
                    unoptimized={isBlobUrl(imageUrl)}
                  />
                </AspectRatio>
              ) : isFillLayout ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes={IMAGE_SIZES.full}
                  className={clsx(styles.mainImage) || ''}
                  style={{ objectFit: 'cover' }}
                  priority
                  loading="eager"
                  unoptimized={isBlobUrl(imageUrl)}
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={800}
                  height={600}
                  sizes={IMAGE_SIZES.section}
                  className={clsx(styles.mainImage) || ''}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  priority
                  loading="eager"
                  unoptimized={isBlobUrl(imageUrl)}
                />
              )
            ) : (
              <Placeholder />
            )}

            {mainScreen.layout === 'frame' ? (
              <div className={clsx(styles.frameBorder) || ''} />
            ) : null}
            {isFillLayout && imageUrl ? (
              <div className={clsx(styles.gradientOverlay) || ''} />
            ) : null}

            {mainScreen.effect === 'ripple' ? (
              <svg
                className={clsx(styles.waves) || ''}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
              >
                <defs>
                  <path
                    id="gentle-wave"
                    d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                  />
                </defs>
                <g className={clsx(styles.parallax) || ''}>
                  <use
                    href="#gentle-wave"
                    x="48"
                    y="0"
                    fill={bgColor || 'var(--background)'}
                    opacity={0.7}
                  />
                  <use
                    href="#gentle-wave"
                    x="48"
                    y="3"
                    fill={bgColor || 'var(--background)'}
                    opacity={0.5}
                  />
                  <use
                    href="#gentle-wave"
                    x="48"
                    y="5"
                    fill={bgColor || 'var(--background)'}
                    opacity={0.3}
                  />
                  <use
                    href="#gentle-wave"
                    x="48"
                    y="7"
                    fill={bgColor || 'var(--background)'}
                    opacity={0.2}
                  />
                </g>
              </svg>
            ) : null}
          </div>

          {/* 3. Bottom Area */}
          <div
            className={
              clsx(styles.bottomArea, isFillLayout ? styles.bottomFill : styles.bottomStandard) ||
              ''
            }
          >
            {!isBasicLayout ? (
              <>
                {mainScreen.title ? (
                  <div
                    className={clsx(styles.bottomTitle) || ''}
                    style={{
                      fontSize: 'calc(10px * var(--font-scale))',
                      color: isFillLayout ? 'inherit' : accentColor,
                    }}
                  >
                    {mainScreen.title}
                  </div>
                ) : null}
                {groom.firstName || bride.firstName ? (
                  <div
                    className={
                      clsx(
                        styles.bottomNames,
                        mainScreen.andText === '·' ? styles.gapSmall : styles.gapLarge,
                        isFillLayout ? styles.light : styles.normal
                      ) || ''
                    }
                    style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                  >
                    <span>
                      {groom.lastName}
                      {groom.firstName}
                    </span>
                    <span
                      className={clsx(styles.connector) || ''}
                      style={{ fontSize: 'calc(16px * var(--font-scale))' }}
                    >
                      {mainScreen.andText === '&' ? (
                        <AmpersandSVG className={clsx(styles.ampersand) || ''} />
                      ) : mainScreen.andText === '♥' ? (
                        <HeartSVG className={clsx(styles.heartIcon) || ''} />
                      ) : mainScreen.andText === 'ring' ? (
                        <RingIcon className={clsx(styles.ringIcon) || ''} />
                      ) : (
                        <span>{mainScreen.andText || 'and'}</span>
                      )}
                    </span>
                    <span>
                      {bride.lastName}
                      {bride.firstName}
                    </span>
                    {mainScreen.suffixText ? (
                      <span
                        className={
                          clsx(
                            styles.suffix,
                            mainScreen.andText === '·'
                              ? styles.marginLeftSmall
                              : styles.marginLeftStandard,
                            isFillLayout ? styles.textWhite : styles.textGray
                          ) || ''
                        }
                        style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                      >
                        {mainScreen.suffixText}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}

            {(() => {
              const displaySubtitle = mainScreen.subtitle || '소중한 날에 초대해요';
              if (!displaySubtitle) return null;
              return (
                <div
                  className={
                    clsx(styles.subtitle, isFillLayout ? styles.textWhite : styles.textGray) || ''
                  }
                  style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                >
                  {displaySubtitle}
                </div>
              );
            })()}

            {displayText ? (
              <div
                className={
                  clsx(
                    styles.datePlace,
                    'rich-text-content',
                    isFillLayout ? styles.textWhite : styles.textGray
                  ) || ''
                }
                style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                dangerouslySetInnerHTML={{ __html: displayText }}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

MainScreenView.displayName = 'MainScreenView';

export default MainScreenView;
