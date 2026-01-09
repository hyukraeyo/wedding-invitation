'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
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
    const {
        gallery: rawGallery,
        galleryTitle,
        galleryType,
        galleryPreview,
        galleryFade,
        galleryAutoplay,
        galleryPopup,
        theme
    } = useInvitationStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [popupIndex, setPopupIndex] = useState<number | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
    const [modalSwiper, setModalSwiper] = useState<SwiperClass | null>(null);
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // Normalize gallery data
    const gallery = useMemo(() => {
        if (!rawGallery) return [];
        return (rawGallery as (string | { id: string; url: string })[]).map((item, index) => {
            if (typeof item === 'string') {
                return { id: `legacy-${index}-${item.substring(0, 10)}`, url: item };
            }
            return item;
        });
    }, [rawGallery]);

    useEffect(() => {
        // Use a slight delay or next tick to avoid synchronous setState warning
        const timer = setTimeout(() => {
            setIsMounted(true);
            const root = document.getElementById('invitation-modal-root');
            setPortalElement(root || document.body);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // 1. Scroll Lock & Autoplay Control
    useEffect(() => {
        if (popupIndex !== null) {
            if (mainSwiper && !mainSwiper.destroyed) {
                mainSwiper.autoplay?.stop();
            }

            const scrollY = window.scrollY;
            document.body.setAttribute('data-scroll-y', scrollY.toString());
            document.body.style.cssText = `
                position: fixed; 
                top: -${scrollY}px;
                left: 0;
                width: 100%;
                overflow: hidden;
            `;
            document.documentElement.style.overflow = 'hidden';

            const mockupContainer = document.getElementById('invitation-modal-root')?.previousElementSibling as HTMLElement;
            if (mockupContainer) {
                mockupContainer.style.overflowY = 'hidden';
            }

            setTimeout(() => closeBtnRef.current?.focus(), 100);
        } else {
            if (mainSwiper && !mainSwiper.destroyed && galleryAutoplay) {
                mainSwiper.autoplay?.start();
            }

            const scrollY = document.body.getAttribute('data-scroll-y');
            document.body.style.cssText = '';
            document.documentElement.style.overflow = '';
            document.body.removeAttribute('data-scroll-y');

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0'));
            }

            const mockupContainer = document.getElementById('invitation-modal-root')?.previousElementSibling as HTMLElement;
            if (mockupContainer) {
                mockupContainer.style.overflowY = 'auto';
            }
        }
        return () => {
            document.body.style.cssText = '';
            document.documentElement.style.overflow = '';
            const mockupContainer = document.getElementById('invitation-modal-root')?.previousElementSibling as HTMLElement;
            if (mockupContainer) {
                mockupContainer.style.overflowY = 'auto';
            }
        };
    }, [popupIndex, mainSwiper, galleryAutoplay]);

    // 2. Sync Logic
    useEffect(() => {
        if (popupIndex !== null && modalSwiper && !modalSwiper.destroyed) {
            modalSwiper.slideTo(popupIndex, 0);
        }
    }, [popupIndex, modalSwiper]);

    if (!gallery || gallery.length === 0) return <div id={id} />;
    if (!isMounted) return null;

    const handleImageClick = (index: number) => {
        if (galleryPopup) {
            setPopupIndex(index);
        }
    };

    const renderGallery = () => {
        switch (galleryType) {
            case 'swiper':
                return (
                    <div className={`w-full ${galleryPreview ? 'overflow-visible' : 'max-w-[340px] mx-auto'}`}>
                        <div className="relative group">
                            <Swiper
                                key={`${gallery.length}-${galleryType}-${galleryPreview}-${galleryFade}`}
                                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={galleryPreview ? 1.25 : 1}
                                centeredSlides={galleryPreview}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom',
                                    prevEl: '.swiper-button-prev-custom',
                                }}
                                effect={galleryFade ? "fade" : "slide"}
                                {...(galleryFade && { fadeEffect: { crossFade: true } })}
                                autoplay={galleryAutoplay ? { delay: 3000, disableOnInteraction: false } : false}
                                loop={gallery.length > 1}
                                onSwiper={setMainSwiper}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                                className="w-full aspect-[4/3] overflow-visible"
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={img.id}>
                                        <div
                                            className={`relative w-full h-full rounded-2xl overflow-hidden ${galleryPopup ? 'cursor-pointer' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {gallery.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full z-10 text-[10px] font-medium tracking-tight">
                                    {currentIndex + 1} / {gallery.length}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'thumbnail':
                return (
                    <div className="w-full max-w-[340px] mx-auto">
                        <Swiper
                            spaceBetween={10}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            onSwiper={setMainSwiper}
                            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                            className={`w-full aspect-[16/10] overflow-visible`}
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                                    <div className={`relative w-full h-full rounded-2xl overflow-hidden ${galleryPopup ? 'cursor-pointer' : ''}`}>
                                        <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={8}
                            slidesPerView={5}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Thumbs]}
                            className="mt-3"
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} className="cursor-pointer">
                                    <div
                                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${index === currentIndex ? 'ring-2 ring-offset-1 opacity-100' : 'opacity-40'}`}
                                        style={index === currentIndex ? { '--tw-ring-color': theme.accentColor } as React.CSSProperties : {}}
                                    >
                                        <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                );
            case 'grid':
            default:
                return (
                    <div className="grid grid-cols-3 gap-1 max-w-[340px] mx-auto">
                        {gallery.map((img, i) => (
                            <div
                                key={img.id}
                                className={`relative aspect-square rounded-lg overflow-hidden ${galleryPopup ? 'cursor-pointer' : ''}`}
                                onClick={() => handleImageClick(i)}
                            >
                                <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <SectionContainer id={id} className="!px-0 overflow-visible">
            <div className="text-center mb-10 max-w-[340px] mx-auto px-4">
                <span className="text-[10px] tracking-[0.3em] font-medium opacity-40 uppercase" style={{ color: theme.accentColor }}>GALLERY</span>
                <h2 className="text-xl font-serif text-gray-800 mt-2 font-medium">{galleryTitle}</h2>
                <div className="w-6 h-[1px] mx-auto mt-4 opacity-20" style={{ backgroundColor: theme.accentColor }} />
            </div>

            {renderGallery()}

            {/* Lightbox Modal */}
            {popupIndex !== null && portalElement && createPortal(
                <div
                    className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex flex-col pointer-events-auto animate-modal-bg"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setPopupIndex(null);
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 z-[10001]">
                        <span className="text-white/60 text-[10px] tracking-widest pl-2">
                            {currentIndex + 1} / {gallery.length}
                        </span>
                        <button
                            ref={closeBtnRef}
                            onClick={() => setPopupIndex(null)}
                            className="p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative w-full h-full overflow-hidden">
                        <Swiper
                            initialSlide={popupIndex}
                            modules={[EffectFade]}
                            slidesPerView={1}
                            observer={true}
                            observeParents={true}
                            onSwiper={setModalSwiper}
                            onSlideChange={(swiper) => {
                                setCurrentIndex(swiper.activeIndex);
                                if (mainSwiper && !mainSwiper.destroyed) {
                                    if (galleryType === 'swiper') {
                                        mainSwiper.slideToLoop(swiper.activeIndex, 0);
                                    } else {
                                        mainSwiper.slideTo(swiper.activeIndex, 0);
                                    }
                                }
                            }}
                            className="w-full h-full"
                        >
                            {gallery.map((img) => (
                                <SwiperSlide key={img.id} className="flex items-center justify-center p-4">
                                    <div className="relative w-full h-full max-w-full max-h-full">
                                        <Image
                                            src={img.url}
                                            alt=""
                                            fill
                                            unoptimized
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>,
                portalElement
            )}
        </SectionContainer>
    );
}
