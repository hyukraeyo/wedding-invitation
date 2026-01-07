import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function MainScreenView() {
    const { mainScreen, imageUrl, groom, bride, date, time, location, detailAddress } = useInvitationStore();
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={`relative w-full transition-all duration-700 ease-in-out ${mainScreen.layout === 'fill' ? 'h-[650px]' : 'pb-16'}`}>
            <div className={`
                relative w-full overflow-hidden flex flex-col items-center transition-all duration-700 ease-in-out
                ${mainScreen.layout === 'fill' ? 'h-full justify-center' : 'pt-20'}
            `}>
                {/* 1. Header Text Area (For Basic Layout, appears before image) */}
                <div className={`
                    flex flex-col items-center text-center px-6 transition-all duration-700 ease-in-out
                    ${mainScreen.layout === 'basic' ? 'mb-12 opacity-100 translate-y-0 scale-100' : 'h-0 mb-0 opacity-0 -translate-y-4 scale-95 pointer-events-none overflow-hidden'}
                `}>
                    {mainScreen.showTitle && (
                        <div
                            className="tracking-[0.4em] font-bold text-coral-pink mb-6 uppercase"
                            style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                        >
                            {mainScreen.title || 'THE MARRIAGE'}
                        </div>
                    )}
                    <div
                        className="font-serif font-light text-gray-700 tracking-tighter mb-8 tabular-nums"
                        style={{ fontSize: 'calc(48px * var(--font-scale))' }}
                    >
                        {date ? `${String(new Date(date).getMonth() + 1).padStart(2, '0')}.${String(new Date(date).getDate()).padStart(2, '0')}` : '00.00'}
                    </div>
                    {mainScreen.showGroomBride && (
                        <div
                            className="font-serif text-gray-800 font-medium tracking-tight"
                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                        >
                            {groom.lastName}{groom.firstName}, {bride.lastName}{bride.firstName} <span className="text-gray-400 font-light ml-0.5">결혼합니다.</span>
                        </div>
                    )}
                </div>

                {/* Image Area */}
                <div className={`
                    relative w-full transition-all duration-700 ease-in-out overflow-hidden
                    ${mainScreen.layout === 'fill' ? 'absolute inset-0 h-full w-full' : 'max-w-[340px] aspect-[4/5] shadow-2xl shadow-black/10 mx-auto'}
                    ${(!mainScreen.layout.startsWith('fill') && mainScreen.layout !== 'arch' && mainScreen.layout !== 'oval') ? 'bg-gray-50' : ''}
                `}
                    style={{
                        borderColor: mainScreen.showBorder ? accentColor : 'transparent',
                        borderWidth: mainScreen.showBorder ? '4px' : '0px',
                        borderStyle: mainScreen.showBorder ? 'double' : 'solid',
                        borderRadius:
                            mainScreen.layout === 'arch' ? '170px 170px 20px 20px' :
                                mainScreen.layout === 'oval' ? '170px 170px 170px 170px' :
                                    mainScreen.layout === 'basic' ? '20px 20px 20px 20px' :
                                        mainScreen.layout === 'frame' ? '4px 4px 4px 4px' :
                                            mainScreen.layout === 'fill' ? '0px 0px 0px 0px' : '20px 20px 20px 20px',
                        transform: mainScreen.expandPhoto && mainScreen.layout !== 'fill' ? 'scale(1.05)' : 'scale(1)'
                    }}
                >
                    {imageUrl ? (
                        <Image src={imageUrl} alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`} fill className="object-cover" priority />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 text-gray-300 bg-gray-50/50">
                            <Heart size={48} strokeWidth={1} />
                            <span
                                className="mt-4 uppercase tracking-[0.2em] font-light"
                                style={{ fontSize: 'calc(10px * var(--font-scale))' }}
                            >No Image Selected</span>
                        </div>
                    )}

                    {mainScreen.layout === 'frame' && <div className="absolute inset-4 border border-white/40 z-10"></div>}
                    {mainScreen.layout === 'fill' && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10" />}

                    {mainScreen.effect === 'mist' && <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 animate-pulse-slow"></div>}
                    {mainScreen.effect === 'ripple' && <div className="absolute inset-0 z-10 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/water.png')] animate-pulse"></div>}
                    {mainScreen.effect === 'paper' && mainScreen.layout !== 'oval' && <div className="absolute inset-0 z-10 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-multiply"></div>}
                </div>

                {/* Bottom Text Area */}
                <div className={`
                    z-20 flex flex-col items-center text-center transition-all duration-700
                    ${mainScreen.layout === 'fill' ? 'absolute bottom-12 left-0 right-0 text-white' : 'mt-14 mb-6 px-10'}
                `}>
                    {mainScreen.layout !== 'basic' && (
                        <>
                            {mainScreen.showTitle && (
                                <div
                                    className={`tracking-[0.4em] uppercase mb-6 font-medium ${mainScreen.layout === 'fill' ? 'opacity-80' : 'text-forest-green opacity-40'}`}
                                    style={{ fontSize: 'calc(10px * var(--font-scale))' }}
                                >
                                    {mainScreen.title}
                                </div>
                            )}
                            {mainScreen.showGroomBride && (
                                <div
                                    className={`font-serif mb-6 flex items-center gap-4 ${mainScreen.layout === 'fill' ? 'font-light' : 'font-normal text-gray-800'}`}
                                    style={{ fontSize: 'calc(30px * var(--font-scale))' }}
                                >
                                    <span>{groom.firstName}</span>
                                    <span
                                        className="font-sans uppercase tracking-widest opacity-40 italic"
                                        style={{ fontSize: 'calc(10px * var(--font-scale))' }}
                                    >{mainScreen.andText || 'and'}</span>
                                    <span>{bride.firstName}</span>
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
                        <div
                            className={`mb-6 tracking-wide ${mainScreen.layout === 'fill' ? 'opacity-95 font-light' : 'text-gray-500 font-light italic font-serif'}`}
                            style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                        >
                            {mainScreen.subtitle}
                        </div>
                    )}

                    {mainScreen.showDatePlace && (
                        <div
                            className={`leading-[2.2] whitespace-pre-wrap tracking-wider ${mainScreen.layout === 'fill' ? 'opacity-80' : 'text-gray-500 font-medium font-serif'}`}
                            style={{ fontSize: 'calc(12px * var(--font-scale))' }}
                        >
                            {(() => {
                                if (mainScreen.customDatePlace && mainScreen.customDatePlace !== '0000.00.00. Sunday 00:00 PM\nOOO예식장 1F, OOO홀') {
                                    return mainScreen.customDatePlace;
                                }
                                const dateObj = date ? new Date(date) : new Date();
                                const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()];
                                const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, '0')}. ${String(dateObj.getDate()).padStart(2, '0')}. ${weekday}`;
                                const [h = '12', m = '00'] = (time || '12:00').split(':');
                                const hour = parseInt(h);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                                return `${formattedDate} ${String(displayHour).padStart(2, '0')}:${m} ${ampm}\n${location}${detailAddress ? `, ${detailAddress}` : ''}`;
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
