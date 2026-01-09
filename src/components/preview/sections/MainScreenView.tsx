'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { AmpersandSVG, HeartSVG, RingIcon } from '../../common/BrandIcons';
import styles from './MainScreenView.module.scss';
import { clsx } from 'clsx';
import { formatShortDate } from '@/lib/utils/format';

interface Person {
    lastName: string;
    firstName: string;
}

interface MainScreenViewProps {
    mainScreen: {
        layout: 'fill' | 'basic' | 'arch' | 'oval' | 'frame';
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
    };
    imageUrl: string | null;
    groom: Person;
    bride: Person;
    date?: string;
    time?: string;
    location: string;
    detailAddress?: string;
    accentColor: string;
}

/**
 * Presentational Component for the Main Screen.
 * Optimized for performance with React.memo and formatted with CSS Modules.
 */
const MainScreenView = memo(({
    mainScreen,
    imageUrl,
    groom,
    bride,
    date,
    time,
    location,
    detailAddress,
    accentColor
}: MainScreenViewProps) => {
    const isFillLayout = mainScreen.layout === 'fill';
    const isBasicLayout = mainScreen.layout === 'basic';

    return (
        <div className={clsx(styles.wrapper, isFillLayout ? styles.fill : styles.standard)}>
            <div className={clsx(styles.content, isFillLayout ? styles.centerFill : styles.pt10)}>

                {/* 1. Header Area (Basic Layout) */}
                <div className={clsx(styles.headerArea, isBasicLayout ? styles.headerVisible : styles.headerHidden)}>
                    {mainScreen.showTitle && (
                        <div
                            className={styles.mainTitle}
                            style={{ fontSize: 'calc(11px * var(--font-scale))', color: accentColor }}
                        >
                            {mainScreen.title || 'THE MARRIAGE'}
                        </div>
                    )}
                    <div
                        className={styles.dateText}
                        style={{ fontSize: 'calc(48px * var(--font-scale))' }}
                    >
                        {formatShortDate(date)}
                    </div>
                    {mainScreen.showGroomBride && (
                        <div
                            className={clsx(
                                styles.namesWrapper,
                                mainScreen.andText === '·' ? styles.gapSmall : (mainScreen.andText || '').length <= 2 ? styles.gapMedium : styles.gapLarge
                            )}
                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                        >
                            <span className={styles.nameText}>{groom.lastName}{groom.firstName}</span>
                            <span
                                className={styles.connector}
                                style={{
                                    fontSize: (mainScreen.andText || '').length === 1 ? 'calc(20px * var(--font-scale))' : 'calc(15px * var(--font-scale))',
                                    color: accentColor,
                                    transform: mainScreen.andText === '·' ? 'translateY(-15%)' : 'none',
                                    paddingInline: (mainScreen.andText || '').length > 1 ? '0.2rem' : '0'
                                }}
                            >
                                {mainScreen.andText === '&' ? (
                                    <AmpersandSVG className={clsx(styles.ampersand)} />
                                ) : mainScreen.andText === 'ring' ? (
                                    <RingIcon className={clsx(styles.ringIcon)} />
                                ) : (
                                    mainScreen.andText || 'and'
                                )}
                            </span>
                            <span className={styles.nameText}>{bride.lastName}{bride.firstName}</span>
                            {mainScreen.suffixText && (
                                <span className={clsx(styles.suffix, mainScreen.andText === '·' ? styles.marginLeftSmall : styles.marginLeftStandard)} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
                                    {mainScreen.suffixText}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Photo Area */}
                <div className={clsx(
                    styles.imageFrame,
                    isFillLayout ? styles.imageFill : styles.imageStandard,
                    (!isFillLayout && mainScreen.layout !== 'arch' && mainScreen.layout !== 'oval') && styles.bgGray
                )}
                    style={{
                        borderColor: mainScreen.showBorder ? accentColor : 'transparent',
                        borderWidth: mainScreen.showBorder ? '4px' : '0px',
                        borderStyle: mainScreen.showBorder ? 'double' : 'solid',
                        borderRadius:
                            mainScreen.layout === 'arch' ? '170px 170px 20px 20px' :
                                mainScreen.layout === 'oval' ? '170px 170px 170px 170px' :
                                    mainScreen.layout === 'basic' ? '20px 20px 20px 20px' :
                                        mainScreen.layout === 'frame' ? '4px 4px 4px 4px' :
                                            mainScreen.layout === 'fill' ? '0px 0px 0px 0px' : '20px 20px 20px 20px'
                    }}
                >
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`}
                            fill
                            className={styles.mainImage}
                            style={{
                                transform: (mainScreen.expandPhoto && !isFillLayout) ? 'scale(1.1)' : 'scale(1)',
                                transformOrigin: 'center center'
                            }}
                            priority
                        />
                    ) : (
                        <div className={styles.emptyPlaceholder}>
                            <Heart size={48} strokeWidth={1} />
                            <span style={{ fontSize: 'calc(10px * var(--font-scale))' }}>No Image Selected</span>
                        </div>
                    )}

                    {mainScreen.layout === 'frame' && <div className={styles.frameBorder}></div>}
                    {isFillLayout && <div className={styles.gradientOverlay} />}

                    {mainScreen.effect === 'mist' && <div className={clsx(styles.effectLayer, styles.mist)}></div>}
                    {mainScreen.effect === 'ripple' && <div className={clsx(styles.effectLayer, styles.ripple)}></div>}
                    {mainScreen.effect === 'paper' && mainScreen.layout !== 'oval' && <div className={clsx(styles.effectLayer, styles.paper)}></div>}
                </div>

                {/* 3. Bottom Area */}
                <div className={clsx(styles.bottomArea, isFillLayout ? styles.bottomFill : styles.bottomStandard)}>
                    {!isBasicLayout && (
                        <>
                            {mainScreen.showTitle && (
                                <div
                                    className={styles.bottomTitle}
                                    style={{ fontSize: 'calc(10px * var(--font-scale))', color: isFillLayout ? 'inherit' : accentColor }}
                                >
                                    {mainScreen.title}
                                </div>
                            )}
                            {mainScreen.showGroomBride && (
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
                                    {mainScreen.suffixText && (
                                        <span className={clsx(styles.suffix, mainScreen.andText === '·' ? styles.marginLeftSmall : styles.marginLeftStandard, isFillLayout ? styles.textWhite : styles.textGray)} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
                                            {mainScreen.suffixText}
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    <div className={styles.separator}>
                        <svg width="60" height="20" viewBox="0 0 100 20" fill="none" stroke="currentColor">
                            <path d="M0 10h40M60 10h40M45 10l5-5 5 5-5 5-5-5z" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {mainScreen.showSubtitle && (
                        <div className={clsx(styles.subtitle, isFillLayout ? styles.textWhite : styles.textGray)} style={{ fontSize: 'calc(24px * var(--font-scale))' }}>
                            {mainScreen.subtitle}
                        </div>
                    )}

                    {mainScreen.showDatePlace && (
                        <div
                            className={clsx(styles.datePlace, isFillLayout ? styles.textWhite : styles.textGray)}
                            style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                            dangerouslySetInnerHTML={{
                                __html: (() => {
                                    if (mainScreen.customDatePlace && mainScreen.customDatePlace !== '0000.00.00. Sunday 00:00 PM\nOOO예식장 1F, OOO홀') {
                                        return mainScreen.customDatePlace;
                                    }
                                    const dateObj = date ? new Date(date) : new Date();
                                    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()];
                                    const dayStr = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, '0')}. ${String(dateObj.getDate()).padStart(2, '0')}. ${weekday}`;
                                    const [h = '12', m = '00'] = (time || '12:00').split(':');
                                    const hr = parseInt(h);
                                    const ampm = hr >= 12 ? 'PM' : 'AM';
                                    const dH = hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr);
                                    return `${dayStr} ${String(dH).padStart(2, '0')}:${m} ${ampm}\n${location}${detailAddress ? `, ${detailAddress}` : ''}`;
                                })()
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

MainScreenView.displayName = 'MainScreenView';

export default MainScreenView;
