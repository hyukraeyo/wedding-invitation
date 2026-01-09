import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay, FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import type { Swiper as SwiperClass } from 'swiper';
import { useInvitationStore } from '@/store/useInvitationStore';
import SectionContainer from '../SectionContainer';

interface Props { id?: string; }

export default function GalleryView({ id }: Props) {
    const { gallery, galleryTitle, galleryType, galleryPreview, galleryFade, galleryAutoplay, galleryPopup, theme } = useInvitationStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [popupIndex, setPopupIndex] = useState<number | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    // References for accessibility focus management
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. Scroll Lock & Focus Trap (Accessibility Standard)
    React.useEffect(() => {
        if (popupIndex !== null) {
            // Lock Scroll
            const scrollY = window.scrollY;
            document.body.style.cssText = `
                position: fixed; 
                top: -${scrollY}px;
                left: 0;
                width: 100%;
                overflow-y: hidden;
            `;
            document.documentElement.style.overflow = 'hidden';

            // Focus Trap (Simple)
            setTimeout(() => closeBtnRef.current?.focus(), 100);
        } else {
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            document.documentElement.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            document.body.style.cssText = '';
            document.documentElement.style.overflow = '';
        };
    }, [popupIndex]);

    // 2. Keyboard Navigation (UX Standard)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (popupIndex === null) return;
            if (e.key === 'Escape') setPopupIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [popupIndex]);

    // Prevent touch move on background
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (popupIndex !== null) {
            e.stopPropagation();
        }
    }, [popupIndex]);

    if (!gallery || gallery.length === 0) return <div id={id} />;
    if (!isMounted) return null;

    const handleImageClick = (index: number) => {
        if (galleryPopup) {
            setPopupIndex(index);
        }
    };

    // Render different gallery types
    const renderGallery = () => {
        switch (galleryType) {
            case 'swiper':
                return (
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="relative group">
                            <Swiper
                                key={`${gallery.length}-${galleryType}-${galleryPreview}-${galleryFade}`}
                                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                observer={true}
                                observeParents={true}
                                spaceBetween={galleryPreview ? 20 : 30}
                                slidesPerView={galleryPreview ? 1.2 : 1}
                                centeredSlides={galleryPreview}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom',
                                    prevEl: '.swiper-button-prev-custom',
                                }}
                                effect={galleryFade ? "fade" : "slide"}
                                {...(galleryFade && { fadeEffect: { crossFade: true } })}
                                autoplay={galleryAutoplay ? {
                                    delay: 3000,
                                    disableOnInteraction: false,
                                } : false}
                                loop={gallery.length > 1}
                                grabCursor={true}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                                className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-gray-50 shadow-sm"
                                style={{ width: '100%', aspectRatio: '4/3' }}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={`${index}-${img}`} className="h-full">
                                        <div
                                            className={`relative w-full h-full ${galleryPopup ? 'cursor-zoom-in' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Gallery ${index + 1}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {/* Custom Navigation (Desktop Only) */}
                            {gallery.length > 1 && (
                                <>
                                    <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all z-30 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all z-30 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center">
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                            {/* Fraction Indicator */}
                            {gallery.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full z-40 text-[11px] font-medium tracking-tight pointer-events-none">
                                    <span>{currentIndex + 1}</span>
                                    <span className="mx-1 opacity-50">/</span>
                                    <span className="opacity-70">{gallery.length}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'thumbnail':
                return (
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="relative group mb-4">
                            <Swiper
                                spaceBetween={10}
                                navigation={{
                                    nextEl: '.thumb-next',
                                    prevEl: '.thumb-prev',
                                }}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                                className={`w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm ${galleryPopup ? 'cursor-zoom-in' : ''}`}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={index} onClick={() => handleImageClick(index)}>
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`Gallery ${index + 1}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <button className="thumb-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="thumb-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={8}
                            slidesPerView={5.5}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="thumbs-swiper !py-2 !px-1"
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={index} className="cursor-pointer">
                                    <div
                                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex ? 'ring-2 ring-offset-2 opacity-100 scale-[0.98]' : 'opacity-40 grayscale-[30%]'}`}
                                        style={index === currentIndex ? { '--tw-ring-color': theme.accentColor } as React.CSSProperties : {}}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                );

            case 'grid':
            default:
                return (
                    <div className="grid grid-cols-2 gap-2">
                        {gallery.map((img, i) => (
                            <div
                                key={i}
                                className={`relative rounded-lg overflow-hidden ${i % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'} ${galleryPopup ? 'cursor-zoom-in' : ''}`}
                                onClick={() => handleImageClick(i)}
                            >
                                <Image
                                    src={img}
                                    alt={`Gallery ${i + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform hover:scale-105 duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <SectionContainer id={id} className="overflow-hidden">
            <div className="text-center mb-10 w-full">
                <div className="flex flex-col items-center space-y-3">
                    <span
                        className="tracking-[0.4em] font-medium uppercase"
                        style={{ fontSize: 'calc(10px * var(--font-scale))', color: theme.accentColor, opacity: 0.4 }}
                    >GALLERY</span>
                    <h2
                        className="font-serif text-gray-900 font-medium"
                        style={{ fontSize: 'calc(20px * var(--font-scale))' }}
                    >
                        {galleryTitle}
                    </h2>
                    <div className="w-8 h-[1px]" style={{ backgroundColor: theme.accentColor, opacity: 0.3 }}></div>
                </div>
            </div>

            {renderGallery()}

            {/* 3. Modern Accessible Lightbox (Immersive & Minimal) */}
            {popupIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image Gallery"
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-modal-bg touch-none"
                    onClick={() => setPopupIndex(null)}
                    onTouchMove={handleTouchMove}
                >
                    {/* Minimal Top Bar */}
                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-[10002] bg-gradient-to-b from-black/50 to-transparent">
                        <span className="text-white/60 text-xs font-light tracking-[0.2em]">
                            {currentIndex + 1} / {gallery.length}
                        </span>
                        <button
                            ref={closeBtnRef}
                            onClick={() => setPopupIndex(null)}
                            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
                            aria-label="Close Gallery"
                        >
                            <X size={24} strokeWidth={1} />
                        </button>
                    </div>

                    {/* Main Content Area - Maximized */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-2 sm:p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Swiper
                            initialSlide={popupIndex}
                            modules={[Navigation, Pagination, EffectFade]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.lux-next',
                                prevEl: '.lux-prev',
                            }}
                            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                            className="w-full h-full"
                        >
                            {gallery.map((img, i) => (
                                <SwiperSlide key={`lux-${i}`} className="flex items-center justify-center">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="relative w-full h-full max-w-5xl max-h-[85vh] transition-transform duration-500">
                                            <Image
                                                src={img}
                                                alt={`Full view ${i + 1}`}
                                                fill
                                                unoptimized
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Minimal Floating Nav - Side (Desktop/Tablet) */}
                    {gallery.length > 1 && (
                        <>
                            <button className="lux-prev absolute left-4 top-1/2 -translate-y-1/2 z-[10002] p-4 text-white/30 hover:text-white transition-all hidden md:block hover:bg-white/5 rounded-full">
                                <ChevronLeft size={36} strokeWidth={0.5} />
                            </button>
                            <button className="lux-next absolute right-4 top-1/2 -translate-y-1/2 z-[10002] p-4 text-white/30 hover:text-white transition-all hidden md:block hover:bg-white/5 rounded-full">
                                <ChevronRight size={36} strokeWidth={0.5} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </SectionContainer>
    );
}
