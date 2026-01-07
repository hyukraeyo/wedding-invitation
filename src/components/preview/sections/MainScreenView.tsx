import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function MainScreenView() {
    const { mainScreen, imageUrl, groom, bride } = useInvitationStore();
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    return (
        <div className={`relative w-full ${mainScreen.layout === 'fill' ? 'h-[600px]' : 'pb-10'}`}>
            <div className={`
        relative w-full overflow-hidden flex flex-col items-center justify-center
        ${mainScreen.layout === 'fill' ? 'h-full' : 'p-6'}
      `}>

                {/* Image Area */}
                <div className={`
           relative w-full transition-all duration-300 overflow-hidden
           ${mainScreen.layout === 'fill' ? 'absolute inset-0 h-full' : 'aspect-[3/4] shadow-sm'}
           ${!mainScreen.layout.startsWith('fill') && mainScreen.layout !== 'arch' && mainScreen.layout !== 'oval' && 'bg-gray-100'}
           ${mainScreen.layout === 'arch' ? 'rounded-t-[100px] rounded-b-xl' : ''}
           ${mainScreen.layout === 'oval' ? 'rounded-[100px]' : ''}
           ${mainScreen.layout === 'basic' || mainScreen.layout === 'frame' ? 'rounded-md' : ''}
           ${mainScreen.showBorder ? 'border-4 border-double' : ''}
           ${mainScreen.expandPhoto && mainScreen.layout !== 'fill' ? 'scale-105' : ''}
        `}
                    style={mainScreen.showBorder ? { borderColor: accentColor } : {}}
                >
                    {imageUrl ? (
                        <Image src={imageUrl} alt={`${groom.firstName}와 ${bride.firstName}의 결혼식 메인 사진`} fill className="object-cover" priority />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 text-gray-400">
                            <Heart size={48} />
                            <span className="text-sm mt-2">No Image</span>
                        </div>
                    )}

                    {/* Frame Layout Inner Border */}
                    {mainScreen.layout === 'frame' && (
                        <div className="absolute inset-4 border border-white/50 z-10"></div>
                    )}

                    {/* Fill Layout Gradient Overlay */}
                    {mainScreen.layout === 'fill' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10" />
                    )}

                    {/* Effects Overlay (Main Screen Specific) */}
                    {mainScreen.effect === 'mist' && (
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 animate-pulse-slow"></div>
                    )}
                    {mainScreen.effect === 'ripple' && (
                        <div className="absolute inset-0 z-10 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/water.png')] animate-pulse"></div>
                    )}
                    {mainScreen.effect === 'paper' && mainScreen.layout !== 'oval' && (
                        <div className="absolute inset-0 z-10 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-multiply"></div>
                    )}
                </div>

                {/* Text Overlay (Position varies by layout) */}
                <div className={`
           z-20 flex flex-col items-center text-center transition-all duration-300
           ${mainScreen.layout === 'fill' ? 'absolute bottom-12 left-0 right-0 text-white' : 'mt-10 mb-6'}
        `}>
                    {/* Title */}
                    {mainScreen.showTitle && (
                        <div className={`text-[10px] tracking-[0.4em] uppercase mb-6 font-medium ${mainScreen.layout === 'fill' ? 'opacity-80' : 'text-forest-green opacity-40'}`}>
                            {mainScreen.title}
                        </div>
                    )}

                    {/* Names */}
                    {mainScreen.showGroomBride && (
                        <div className={`font-serif text-3xl mb-6 flex items-center gap-4 ${mainScreen.layout === 'fill' ? 'font-light' : 'font-normal text-gray-800'}`}>
                            <span>{groom.firstName}</span>
                            <span className="font-sans text-[10px] uppercase tracking-widest opacity-40 italic">and</span>
                            <span>{bride.firstName}</span>
                        </div>
                    )}

                    {/* Decorative Ornament */}
                    <div className="mb-6 opacity-20">
                        <svg width="60" height="20" viewBox="0 0 100 20" fill="none" stroke="currentColor">
                            <path d="M0 10h40M60 10h40M45 10l5-5 5 5-5 5-5-5z" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {/* Subtitle */}
                    {mainScreen.showSubtitle && (
                        <div className={`text-sm mb-6 tracking-wide ${mainScreen.layout === 'fill' ? 'opacity-95 font-light' : 'text-gray-500 font-light italic'}`}>
                            {mainScreen.subtitle}
                        </div>
                    )}

                    {/* Date & Place */}
                    {mainScreen.showDatePlace && (
                        <div className={`text-[11px] leading-relaxed whitespace-pre-wrap tracking-wider ${mainScreen.layout === 'fill' ? 'opacity-80' : 'text-gray-400 font-light'}`}>
                            {mainScreen.customDatePlace}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
