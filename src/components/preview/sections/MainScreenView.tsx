'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { AmpersandSVG, HeartSVG, RingIcon } from '../../common/Icons';
import styles from './MainScreenView.module.scss';
import { clsx } from 'clsx';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Person {
    lastName: string;
    firstName: string;
}

interface MainScreenViewProps {
    mainScreen: {
        layout: 'classic' | 'minimal' | 'english' | 'heart' | 'korean' | 'arch' | 'oval' | 'frame' | 'fill' | 'basic';
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
        effect: 'none' | 'mist' | 'ripple' | 'paper';
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

/**
 * Presentational Component for the Main Screen.
 * Optimized for performance with React.memo and formatted with CSS Modules.
 */
const MainScreenView = memo(({
    mainScreen: rawMainScreen,
    imageUrl,
    imageRatio = 'fixed',
    groom: rawGroom,
    bride: rawBride,

    date,
    time,
    location,
    detailAddress,
    accentColor
}: MainScreenViewProps) => {
    const bgColor = useInvitationStore((state) => state.theme.backgroundColor);
    const mainScreen = rawMainScreen || {
        layout: 'classic',
        showTitle: true,
        title: 'THE MARRIAGE',
        showGroomBride: true,
        andText: '그리고',
        suffixText: '',
        showSubtitle: true,
        subtitle: '소중한 날에 초대합니다',
        showDatePlace: true,
        customDatePlace: '',
        showBorder: false,
        expandPhoto: false,
        effect: 'none',
        groomName: '',
        brideName: ''
    };
    const groom = rawGroom || { firstName: '', lastName: '', relation: '', parents: { father: { name: '', isDeceased: false }, mother: { name: '', isDeceased: false } } };
    const bride = rawBride || { firstName: '', lastName: '', relation: '', parents: { father: { name: '', isDeceased: false }, mother: { name: '', isDeceased: false } } };

    const isFillLayout = mainScreen.layout === 'fill' || mainScreen.layout === 'heart';
    const isBasicLayout = mainScreen.layout === 'classic' || mainScreen.layout === 'minimal' || mainScreen.layout === 'english' || mainScreen.layout === 'korean' || mainScreen.layout === 'basic';

    return (
        <div className={clsx(styles.wrapper, isFillLayout ? styles.fill : styles.standard)}>
            <div className={clsx(styles.content, isFillLayout ? styles.centerFill : styles.pt10)}>

                {/* 1. Header Area - Conditional based on textStyle */}
                <div className={clsx(styles.headerArea, isBasicLayout ? styles.headerVisible : styles.headerHidden)}>
                    {/* Classic Style */}
                    {mainScreen.layout === 'classic' ? (
                        <>
                            <div
                                className={styles.mainTitle}
                                style={{ fontSize: 'calc(10px * var(--font-scale))', color: accentColor }}
                            >
                                {mainScreen.title || 'THE MARRIAGE'}
                            </div>
                        </>
                    ) : null}

                    {/* Minimal Style */}
                    {mainScreen.layout === 'minimal' ? (
                        <>
                            <div className={styles.minimalDateRow} style={{ fontSize: 'calc(28px * var(--font-scale))' }}>
                                {(() => {
                                    if (!date) return null;
                                    const d = new Date(date);
                                    return (
                                        <>
                                            <span className={styles.minimalDateBox}>{d.getFullYear()}</span>
                                            <span className={styles.minimalDateBox}>{String(d.getMonth() + 1).padStart(2, '0')}</span>
                                            <span className={styles.minimalDateBox}>{String(d.getDate()).padStart(2, '0')}</span>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className={styles.weekdayText} style={{ fontSize: 'calc(14px * var(--font-scale))' }}>
                                {date ? ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date(date).getDay()] : null}
                            </div>
                        </>
                    ) : null}

                    {/* English Style */}
                    {mainScreen.layout === 'english' ? (
                        <>
                            {mainScreen.title ? (
                                <div
                                    className={styles.mainTitle}
                                    style={{ fontSize: 'calc(12px * var(--font-scale))', color: accentColor, letterSpacing: '0.15em' }}
                                >
                                    {mainScreen.title}
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    {/* Heart Style - No header, just names below */}
                    {/* Korean Style */}
                    {mainScreen.layout === 'korean' ? (
                        <>
                            {mainScreen.title ? (
                                <div
                                    className={styles.koreanTitle}
                                    style={{ fontSize: 'calc(18px * var(--font-scale))' }}
                                >
                                    {mainScreen.title}
                                </div>
                            ) : null}
                            {mainScreen.subtitle ? (
                                <div
                                    className={styles.koreanSubtitle}
                                    style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                >
                                    {mainScreen.subtitle}
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    {/* Names Row - For styles that show names in header */}
                    {mainScreen.layout === 'classic' || mainScreen.layout === 'minimal' || mainScreen.layout === 'english' || mainScreen.layout === 'korean' ? (
                        <div
                            className={clsx(
                                styles.namesWrapper,
                                (mainScreen.andText || '그리고') === '·' ? styles.gapSmall : (mainScreen.andText || '그리고').length <= 2 ? styles.gapMedium : styles.gapLarge
                            )}
                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                        >
                            <span className={styles.nameText}>
                                {mainScreen.groomName || (groom.lastName || groom.firstName ? `${groom.lastName}${groom.firstName}` : '신랑')}
                            </span>
                            <span
                                className={styles.connector}
                                style={{
                                    fontSize: (mainScreen.andText || '그리고').length === 1 ? 'calc(20px * var(--font-scale))' : 'calc(15px * var(--font-scale))',
                                    color: accentColor,
                                    transform: (mainScreen.andText || '그리고') === '·' ? 'translateY(-15%)' : 'none',
                                    paddingInline: (mainScreen.andText || '그리고').length > 1 ? '0.2rem' : '0'
                                }}
                            >
                                {mainScreen.andText === '&' ? (
                                    <AmpersandSVG className={clsx(styles.ampersand)} />
                                ) : mainScreen.andText === 'ring' ? (
                                    <RingIcon className={clsx(styles.ringIcon)} />
                                ) : (
                                    mainScreen.andText || '그리고'
                                )}
                            </span>
                            <span className={styles.nameText}>
                                {mainScreen.brideName || (bride.lastName || bride.firstName ? `${bride.lastName}${bride.firstName}` : '신부')}
                            </span>

                        </div>
                    ) : null}

                    {/* Heart Style - Special names display */}
                    {mainScreen.layout === 'heart' ? (
                        <div
                            className={styles.heartNamesRow}
                            style={{ fontSize: 'calc(22px * var(--font-scale))' }}
                        >
                            <span>{mainScreen.groomName || (groom.lastName || groom.firstName ? `${groom.lastName}${groom.firstName}` : '신랑')}</span>
                            <span className={styles.heartIcon} style={{ color: '#e74c3c' }}>♥</span>
                            <span>{mainScreen.brideName || (bride.lastName || bride.firstName ? `${bride.lastName}${bride.firstName}` : '신부')}</span>
                        </div>
                    ) : null}

                    {/* English Style - Subtitle after names */}
                    {mainScreen.layout === 'english' && mainScreen.subtitle ? (
                        <div
                            className={styles.englishSubtitle}
                            style={{ fontSize: 'calc(13px * var(--font-scale))', marginTop: '0.5rem' }}
                        >
                            {mainScreen.subtitle}
                        </div>
                    ) : null}
                </div>

                {/* 2. Photo Area */}
                <div className={clsx(
                    styles.imageFrame,
                    isFillLayout ? styles.imageFill : styles.imageStandard,
                    mainScreen.layout === 'classic' && styles.classic,
                    mainScreen.expandPhoto && styles.expanded,
                    (!isFillLayout && mainScreen.layout !== 'arch' && mainScreen.layout !== 'oval' && !(mainScreen.layout === 'classic' && (mainScreen.imageShape === 'arch' || mainScreen.imageShape === 'oval'))) && styles.bgGray,
                    !isFillLayout && styles[imageRatio],
                    mainScreen.effect === 'mist' && styles.mistEffect,

                )}
                    style={{
                        borderColor: 'transparent',
                        borderWidth: '0px',
                        borderStyle: 'none',
                        borderRadius:
                            mainScreen.layout === 'arch' ? `170px 170px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}` :
                                mainScreen.layout === 'oval' ? '170px' :
                                    (mainScreen.layout === 'classic' && mainScreen.imageShape === 'arch') ? `170px 170px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}` :
                                        (mainScreen.layout === 'classic' && mainScreen.imageShape === 'oval') ? '170px' :
                                            mainScreen.expandPhoto ? '0px' :
                                                mainScreen.layout === 'basic' ? `20px 20px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}` :
                                                    mainScreen.layout === 'frame' ? `4px 4px ${mainScreen.effect === 'mist' ? '0px 0px' : '4px 4px'}` :
                                                        mainScreen.layout === 'fill' ? '0px 0px 0px 0px' : `20px 20px ${mainScreen.effect === 'mist' ? '0px 0px' : '20px 20px'}`
                    }}
                >
                    {imageUrl ? (
                        imageRatio === 'fixed' && !isFillLayout ? (
                            <AspectRatio ratio={4 / 5} className={styles.fullSize}>
                                <Image
                                    src={imageUrl}
                                    alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`}
                                    fill
                                    sizes={IMAGE_SIZES.section}
                                    className={styles.mainImage}
                                    style={{
                                        transform: 'scale(1)',
                                        transformOrigin: 'center center',
                                        objectFit: 'cover',
                                    }}
                                    priority
                                    unoptimized={isBlobUrl(imageUrl)}
                                />
                            </AspectRatio>
                        ) : isFillLayout ? (
                            <Image
                                src={imageUrl}
                                alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`}
                                fill
                                sizes={IMAGE_SIZES.full}
                                className={styles.mainImage}
                                style={{
                                    transform: 'scale(1)',
                                    transformOrigin: 'center center',
                                    objectFit: 'cover',
                                }}
                                priority
                                unoptimized={isBlobUrl(imageUrl)}
                            />
                        ) : (
                            <Image
                                src={imageUrl}
                                alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`}
                                width={800}
                                height={600}
                                sizes={IMAGE_SIZES.section}
                                className={styles.mainImage}
                                style={{
                                    transform: 'scale(1)',
                                    transformOrigin: 'center center',
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                }}
                                priority
                                unoptimized={isBlobUrl(imageUrl)}
                            />
                        )
                    ) : (
                        <div className={styles.emptyPlaceholder}>
                            <Heart size={48} strokeWidth={1} />
                            <span style={{ fontSize: 'calc(10px * var(--font-scale))' }}>No Image Selected</span>
                        </div>
                    )}

                    {mainScreen.layout === 'frame' ? <div className={styles.frameBorder}></div> : null}
                    {isFillLayout ? <div className={styles.gradientOverlay} /> : null}

                    {mainScreen.effect === 'ripple' ? (
                        <svg className={styles.waves} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                            <defs>
                                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                            </defs>
                            <g className={styles.parallax}>
                                <use href="#gentle-wave" x="48" y="0" fill={bgColor || '#ffffff'} opacity={0.7} />
                                <use href="#gentle-wave" x="48" y="3" fill={bgColor || '#ffffff'} opacity={0.5} />
                                <use href="#gentle-wave" x="48" y="5" fill={bgColor || '#ffffff'} opacity={0.3} />
                                <use href="#gentle-wave" x="48" y="7" fill={bgColor || '#ffffff'} opacity={0.2} />
                            </g>
                        </svg>
                    ) : null}
                    {mainScreen.effect === 'paper' && mainScreen.layout !== 'oval' ? (
                        <div className={clsx(styles.effectLayer, styles.paper)}></div>
                    ) : null}


                </div>

                {/* 3. Bottom Area */}
                <div className={clsx(styles.bottomArea, isFillLayout ? styles.bottomFill : styles.bottomStandard)}>
                    {!isBasicLayout ? (
                        <>
                            {mainScreen.title ? (
                                <div
                                    className={styles.bottomTitle}
                                    style={{ fontSize: 'calc(10px * var(--font-scale))', color: isFillLayout ? 'inherit' : accentColor }}
                                >
                                    {mainScreen.title}
                                </div>
                            ) : null}
                            {groom.firstName || bride.firstName ? (
                                <div
                                    className={clsx(styles.bottomNames, mainScreen.andText === '·' ? styles.gapSmall : styles.gapLarge, isFillLayout ? styles.light : styles.normal)}
                                    style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                >
                                    <span>{groom.lastName}{groom.firstName}</span>
                                    <span
                                        className={styles.connector}
                                        style={{ fontSize: 'calc(16px * var(--font-scale))' }}
                                    >
                                        {mainScreen.andText === '&' ? <AmpersandSVG className={clsx(styles.ampersand)} /> :
                                            mainScreen.andText === '♥' ? <HeartSVG className={clsx(styles.heartIcon)} /> :
                                                mainScreen.andText === 'ring' ? <RingIcon className={clsx(styles.ringIcon)} /> :
                                                    <span>{mainScreen.andText || 'and'}</span>}
                                    </span>
                                    <span>{bride.lastName}{bride.firstName}</span>
                                    {mainScreen.suffixText ? (
                                        <span className={clsx(styles.suffix, mainScreen.andText === '·' ? styles.marginLeftSmall : styles.marginLeftStandard, isFillLayout ? styles.textWhite : styles.textGray)} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
                                            {mainScreen.suffixText}
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}
                        </>
                    ) : null}



                    {(() => {
                        const displaySubtitle = mainScreen.subtitle || '소중한 날에 초대합니다';

                        if (!displaySubtitle) return null;

                        return (
                            <div className={clsx(styles.subtitle, isFillLayout ? styles.textWhite : styles.textGray)} style={{ fontSize: 'calc(24px * var(--font-scale))' }}>
                                {displaySubtitle}
                            </div>
                        );
                    })()}

                    {(() => {
                        const hasCustomText = mainScreen.customDatePlace && mainScreen.customDatePlace.replace(/<[^>]*>/g, '').trim().length > 0;

                        let displayText = '';

                        if (hasCustomText) {
                            displayText = mainScreen.customDatePlace;
                        } else if (date && time) {
                            // Automatic formatting
                            const dateValue = date as string;
                            const timeValue = time as string;
                            const d = new Date(dateValue);
                            const year = d.getFullYear();
                            const month = d.getMonth() + 1;
                            const day = d.getDate();
                            const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][d.getDay()];

                            const [h = '12', m = '00'] = timeValue.split(':');
                            const hour = parseInt(h, 10);
                            const ampm = hour < 12 ? '오전' : '오후';
                            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

                            const dateStr = `${year}년 ${month}월 ${day}일 ${week}`;
                            const timeStr = `${ampm} ${displayHour}시 ${m === '00' ? '' : `${m}분`}`; // Clean time format

                            const fullLocation = [location, detailAddress].filter(Boolean).join(' ');
                            displayText = `${dateStr} ${timeStr}${fullLocation ? `<br/>${fullLocation}` : ''}`;
                        } else if (location || detailAddress) {
                            displayText = [location, detailAddress].filter(Boolean).join(' ');
                        }

                        if (!displayText) return null;

                        return (
                            <div
                                className={clsx(styles.datePlace, "rich-text-content", isFillLayout ? styles.textWhite : styles.textGray)}
                                style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                                dangerouslySetInnerHTML={{
                                    __html: displayText
                                }}
                            />
                        );
                    })()}
                </div>
            </div>
        </div >
    );
});

MainScreenView.displayName = 'MainScreenView';

export default MainScreenView;
