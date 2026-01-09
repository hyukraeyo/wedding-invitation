'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { AmpersandSVG, HeartSVG, RingIcon } from '../../common/BrandIcons';
import styles from './MainScreenView.module.css';
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
                            className="tracking-[0.4em] font-black mb-3 uppercase text-gray-900"
                            style={{ fontSize: 'calc(11px * var(--font-scale))', color: accentColor }}
                        >
                            {mainScreen.title || 'THE MARRIAGE'}
                        </div>
                    )}
                    <div
                        className="font-serif font-light text-gray-700 tracking-tighter mb-5 tabular-nums"
                        style={{ fontSize: 'calc(48px * var(--font-scale))' }}
                    >
                        {formatShortDate(date)}
                    </div>
                    {mainScreen.showGroomBride && (
                        <div
                            className={clsx(
                                "font-serif text-gray-800 font-medium tracking-tight flex items-center justify-center flex-wrap gap-y-1",
                                mainScreen.andText === '·' ? 'gap-x-1.5' : (mainScreen.andText || '').length <= 2 ? 'gap-x-2' : 'gap-x-4'
                            )}
                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                        >
                            <span className="shrink-0">{groom.lastName}{groom.firstName}</span>
                            <span
                                className="font-playfair uppercase opacity-100 shrink-0 inline-flex items-center justify-center"
                                style={{
                                    fontSize: (mainScreen.andText || '').length === 1 ? 'calc(20px * var(--font-scale))' : 'calc(15px * var(--font-scale))',
                                    color: accentColor,
                                    transform: mainScreen.andText === '·' ? 'translateY(-15%)' : 'none',
                                    paddingInline: (mainScreen.andText || '').length > 1 ? '0.2rem' : '0'
                                }}
                            >
                                {mainScreen.andText === '&' ? (
                                    <AmpersandSVG className="scale-125 translate-y-[-5%]" />
                                ) : mainScreen.andText === 'ring' ? (
                                    <RingIcon style={{ transform: 'translateY(-10%)' }} />
                                ) : (
                                    mainScreen.andText || 'and'
                                )}
                            </span>
                            <span className="shrink-0">{bride.lastName}{bride.firstName}</span>
                            {mainScreen.suffixText && (
                                <span className={clsx("text-gray-600 font-medium shrink-0", mainScreen.andText === '·' ? 'ml-0.5' : 'ml-[-2px]')} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
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
                    (!isFillLayout && mainScreen.layout !== 'arch' && mainScreen.layout !== 'oval') && 'bg-gray-50'
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
                            className="object-cover transition-transform duration-700 ease-in-out"
                            style={{
                                transform: (mainScreen.expandPhoto && !isFillLayout) ? 'scale(1.1)' : 'scale(1)',
                                transformOrigin: 'center center'
                            }}
                            priority
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 text-gray-300 bg-gray-50/50">
                            <Heart size={48} strokeWidth={1} />
                            <span className="mt-4 uppercase tracking-[0.2em] font-light" style={{ fontSize: 'calc(10px * var(--font-scale))' }}>No Image Selected</span>
                        </div>
                    )}

                    {mainScreen.layout === 'frame' && <div className="absolute inset-4 border border-white/40 z-10"></div>}
                    {isFillLayout && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10" />}

                    {mainScreen.effect === 'mist' && <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 animate-pulse-slow"></div>}
                    {mainScreen.effect === 'ripple' && <div className="absolute inset-0 z-10 opacity-30 bg-[url('https://www.transparenttextures.com/water.png')] animate-pulse"></div>}
                    {mainScreen.effect === 'paper' && mainScreen.layout !== 'oval' && <div className="absolute inset-0 z-10 opacity-40 bg-[url('https://www.transparenttextures.com/paper.png')] mix-blend-multiply"></div>}
                </div>

                {/* 3. Bottom Area */}
                <div className={clsx(styles.bottomArea, isFillLayout ? styles.bottomFill : styles.bottomStandard)}>
                    {!isBasicLayout && (
                        <>
                            {mainScreen.showTitle && (
                                <div
                                    className="tracking-[0.4em] uppercase mb-6 font-black"
                                    style={{ fontSize: 'calc(10px * var(--font-scale))', color: isFillLayout ? 'inherit' : accentColor }}
                                >
                                    {mainScreen.title}
                                </div>
                            )}
                            {mainScreen.showGroomBride && (
                                <div
                                    className={clsx("font-serif mb-6 flex items-center", mainScreen.andText === '·' ? 'gap-x-1.5' : 'gap-4', isFillLayout ? 'font-light' : 'font-normal text-gray-800')}
                                    style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                >
                                    <span>{groom.lastName}{groom.firstName}</span>
                                    <span
                                        className="font-serif uppercase tracking-widest opacity-60 inline-flex items-center justify-center"
                                        style={{ fontSize: 'calc(16px * var(--font-scale))' }}
                                    >
                                        {mainScreen.andText === '&' ? <AmpersandSVG className="scale-150 translate-y-[-5%]" /> :
                                            mainScreen.andText === '♥' ? <HeartSVG className="scale-150 translate-y-[-5%]" /> :
                                                mainScreen.andText === 'ring' ? <RingIcon style={{ transform: 'translateY(-10%)' }} /> :
                                                    <span>{mainScreen.andText || 'and'}</span>}
                                    </span>
                                    <span>{bride.lastName}{bride.firstName}</span>
                                    {mainScreen.suffixText && (
                                        <span className={clsx("shrink-0", mainScreen.andText === '·' ? 'ml-0.5' : 'ml-2', isFillLayout ? 'text-white/90' : 'text-gray-600')} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
                                            {mainScreen.suffixText}
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    <div className="mb-8 opacity-10">
                        <svg width="60" height="20" viewBox="0 0 100 20" fill="none" stroke="currentColor">
                            <path d="M0 10h40M60 10h40M45 10l5-5 5 5-5 5-5-5z" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {mainScreen.showSubtitle && (
                        <div className={clsx("mb-6 font-script", isFillLayout ? 'text-white/90' : 'text-gray-500')} style={{ fontSize: 'calc(24px * var(--font-scale))' }}>
                            {mainScreen.subtitle}
                        </div>
                    )}

                    {mainScreen.showDatePlace && (
                        <div
                            className={clsx("leading-[2.2] whitespace-pre-wrap tracking-wider rich-text-content", isFillLayout ? 'opacity-80' : 'text-gray-500 font-medium font-serif')}
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
