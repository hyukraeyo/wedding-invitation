import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';


const AmpersandSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '1.5em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const HeartSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <path d="M12 8C14.21 5.5 17.5 5.5 19.5 7.5C21.5 9.5 21.5 12.8 19.5 14.8L12 21L4.5 14.8C2.5 12.8 2.5 9.5 4.5 7.5C6.5 5.5 9.79 5.5 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);




export default function MainScreenView() {
    const { mainScreen, imageUrl, groom, bride, date, time, location, detailAddress } = useInvitationStore();
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={`relative w-full transition-all duration-700 ease-in-out ${mainScreen.layout === 'fill' ? 'h-[650px]' : 'pb-6'}`}>
            <div className={`
                relative w-full overflow-hidden flex flex-col items-center transition-all duration-700 ease-in-out
                ${mainScreen.layout === 'fill' ? 'h-full justify-center' : 'pt-10'}
            `}>
                {/* 1. Header Text Area (For Basic Layout, appears before image) */}
                <div className={`
                    flex flex-col items-center text-center px-6 transition-all duration-700 ease-in-out
                    ${mainScreen.layout === 'basic' ? 'mb-8 opacity-100 translate-y-0 scale-100' : 'h-0 mb-0 opacity-0 -translate-y-4 scale-95 pointer-events-none overflow-hidden'}
                `}>
                    {/* Subtitle removed from here as per user request */}
                    {mainScreen.showTitle && (
                        <div
                            className="tracking-[0.4em] font-black mb-3 uppercase text-gray-900"
                            style={{
                                fontSize: 'calc(11px * var(--font-scale))',
                                color: accentColor
                            }}
                        >
                            {mainScreen.title || 'THE MARRIAGE'}
                        </div>
                    )}
                    <div
                        className="font-serif font-light text-gray-700 tracking-tighter mb-5 tabular-nums"
                        style={{ fontSize: 'calc(48px * var(--font-scale))' }}
                    >
                        {date ? `${String(new Date(date).getMonth() + 1).padStart(2, '0')}.${String(new Date(date).getDate()).padStart(2, '0')}` : '00.00'}
                    </div>
                    {mainScreen.showGroomBride && (
                        <div
                            className={`font-serif text-gray-800 font-medium tracking-tight flex items-center justify-center flex-wrap ${mainScreen.andText === '·' ? 'gap-x-1.5' : (mainScreen.andText || '').length <= 2 ? 'gap-x-2' : 'gap-x-4'
                                } gap-y-1`}
                            style={{ fontSize: 'calc(17px * var(--font-scale))' }}
                        >
                            <span className="shrink-0">{groom.lastName}{groom.firstName}</span>
                            <span
                                className={`font-playfair uppercase opacity-100 shrink-0 inline-flex items-center justify-center ${(mainScreen.andText || '').length > 1 ? 'tracking-[0.2em]' : ''
                                    }`}
                                style={{
                                    fontSize: (mainScreen.andText || '').length === 1
                                        ? 'calc(20px * var(--font-scale))'
                                        : 'calc(15px * var(--font-scale))',
                                    color: accentColor,
                                    transform: mainScreen.andText === '·' ? 'translateY(-15%)' : 'none'
                                }}
                            >
                                {mainScreen.andText === '&' ? (
                                    <AmpersandSVG className="scale-125 translate-y-[-5%]" />
                                ) : mainScreen.andText === 'ring' ? (
                                    <Image
                                        src="/images/wedding-ring.png"
                                        alt="ring"
                                        width={48}
                                        height={48}
                                        className="inline-block object-contain"
                                        style={{ width: 'auto', height: '1.5em', transform: 'translateY(-10%)' }}
                                    />
                                ) : (
                                    mainScreen.andText || 'and'
                                )}
                            </span>
                            <span className="shrink-0">{bride.lastName}{bride.firstName}</span>
                            {mainScreen.suffixText && (
                                <span className={`text-gray-600 font-medium shrink-0 ${mainScreen.andText === '·' ? 'ml-0.5' : 'ml-[-2px]'}`} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
                                    {mainScreen.suffixText}
                                </span>
                            )}
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
                                            mainScreen.layout === 'fill' ? '0px 0px 0px 0px' : '20px 20px 20px 20px'
                    }}
                >
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`}
                            fill
                            className={`object-cover ${mainScreen.layout !== 'fill' ? 'transition-transform duration-700 ease-in-out' : ''}`}
                            style={{
                                transform: (mainScreen.expandPhoto && mainScreen.layout !== 'fill') ? 'scale(1.1)' : 'scale(1)',
                                transformOrigin: 'center center'
                            }}
                            priority
                        />
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
                    ${mainScreen.layout === 'fill' ? 'absolute bottom-12 left-0 right-0 text-white' : 'mt-6 mb-2 px-10'}
                `}>
                    {mainScreen.layout !== 'basic' && (
                        <>
                            {mainScreen.showTitle && (
                                <div
                                    className={`tracking-[0.4em] uppercase mb-6 font-black ${mainScreen.layout === 'fill' ? 'opacity-90' : 'text-gray-900'}`}
                                    style={{
                                        fontSize: 'calc(10px * var(--font-scale))',
                                        color: mainScreen.layout === 'fill' ? undefined : accentColor
                                    }}
                                >
                                    {mainScreen.title}
                                </div>
                            )}
                            {mainScreen.showGroomBride && (
                                <div
                                    className={`font-serif mb-6 flex items-center ${mainScreen.andText === '·' ? 'gap-x-1.5' : 'gap-4'} ${mainScreen.layout === 'fill' ? 'font-light' : 'font-normal text-gray-800'}`}
                                    style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                                >
                                    <span>{groom.lastName}{groom.firstName}</span>
                                    <span
                                        className="font-serif uppercase tracking-widest opacity-60 inline-flex items-center justify-center"
                                        style={{ fontSize: 'calc(16px * var(--font-scale))' }}
                                    >
                                        {mainScreen.andText === '&' ? (
                                            <AmpersandSVG className="scale-150 translate-y-[-5%]" />
                                        ) : mainScreen.andText === '♥' ? (
                                            <HeartSVG className="scale-150 translate-y-[-5%]" />
                                        ) : mainScreen.andText === 'ring' ? (
                                            <Image
                                                src="/images/wedding-ring.png"
                                                alt="ring"
                                                width={48}
                                                height={48}
                                                className="inline-block object-contain"
                                                style={{ width: 'auto', height: '1.5em', transform: 'translateY(-10%)' }}
                                            />
                                        ) : (
                                            <span>{mainScreen.andText || 'and'}</span>
                                        )}

                                    </span>
                                    <span>{bride.lastName}{bride.firstName}</span>
                                    {mainScreen.suffixText && (
                                        <span className={`shrink-0 ${mainScreen.andText === '·' ? 'ml-0.5' : 'ml-2'} ${mainScreen.layout === 'fill' ? 'text-white/90' : 'text-gray-600'}`} style={{ fontSize: 'calc(17px * var(--font-scale))' }}>
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
                        <div
                            className={`mb-6 font-script ${mainScreen.layout === 'fill' ? 'text-white/90' : 'text-gray-500'}`}
                            style={{ fontSize: 'calc(24px * var(--font-scale))' }}
                        >
                            {mainScreen.subtitle}
                        </div>
                    )}

                    {mainScreen.showDatePlace && (
                        <div
                            className={`leading-[2.2] whitespace-pre-wrap tracking-wider rich-text-content ${mainScreen.layout === 'fill' ? 'opacity-80' : 'text-gray-500 font-medium font-serif'}`}
                            style={{ fontSize: 'calc(14px * var(--font-scale))' }}
                            dangerouslySetInnerHTML={{
                                __html: (() => {
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
                                })()
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
