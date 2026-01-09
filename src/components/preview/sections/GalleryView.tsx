'use client';

import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
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
import SectionContainer from '../SectionContainer';
import styles from './GalleryView.module.css';
import { clsx } from 'clsx';

interface GalleryItem {
    id: string;
    url: string;
}

interface GalleryViewProps {
    id?: string | undefined;
    gallery: (GalleryItem | string)[];
    galleryTitle: string;
    galleryType: 'swiper' | 'thumbnail' | 'grid';
    galleryPreview: boolean;
    galleryFade: boolean;
    galleryAutoplay: boolean;
    galleryPopup: boolean;
    accentColor: string;
}

/**
 * Presentational Component for Gallery View.
 * Receives all data via props as per Container/Presentational pattern.
 * Uses CSS Modules for styling.
 */
const GalleryView = memo(({
    id,
    gallery: rawGallery,
    galleryTitle,
    galleryType,
    galleryPreview,
    galleryFade,
    galleryAutoplay,
    galleryPopup,
    accentColor
}: GalleryViewProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [popupIndex, setPopupIndex] = useState<number | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
    const [modalSwiper, setModalSwiper] = useState<SwiperClass | null>(null);
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // Normalize gallery data (handling potential legacy string arrays)
    const gallery = useMemo(() => {
        if (!rawGallery) return [];
        return rawGallery.map((item, index) => {
            if (typeof item === 'string') {
                return { id: `legacy-${index}-${item.substring(0, 10)}`, url: item };
            }
            return item;
        });
    }, [rawGallery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
            const root = document.getElementById('invitation-modal-root');
            setPortalElement(root || document.body);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Scroll Lock & Autoplay Control
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
    }, [popupIndex, mainSwiper, galleryAutoplay]);

    // Sync Logic
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
                    <div className={clsx(styles.swiperContainer, !galleryPreview && styles.swiperContainerLimited)}>
                        <div className="relative group">
                            <Swiper
                                key={`${gallery.length}-${galleryType}-${galleryPreview}-${galleryFade}`}
                                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={galleryPreview ? 1.25 : 1}
                                centeredSlides={galleryPreview}
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
                                            className={clsx(styles.imageSlide, galleryPopup && styles.cursorPointer)}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {gallery.length > 1 && (
                                <div className={styles.counter}>
                                    {currentIndex + 1} / {gallery.length}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'thumbnail':
                return (
                    <div className={styles.swiperContainerLimited}>
                        <Swiper
                            spaceBetween={10}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            onSwiper={setMainSwiper}
                            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                            className="w-full aspect-[16/10] overflow-visible"
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                                    <div className={clsx(styles.imageSlide, galleryPopup && styles.cursorPointer)}>
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
                                        className={clsx(
                                            "relative aspect-square rounded-lg overflow-hidden transition-all",
                                            index === currentIndex ? 'ring-2 ring-offset-1 opacity-100' : 'opacity-40'
                                        )}
                                        style={index === currentIndex ? { '--tw-ring-color': accentColor } as React.CSSProperties : {}}
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
                    <div className="grid grid-cols-3 gap-1 max-w-[340px] mx-auto px-1">
                        {gallery.map((img, i) => (
                            <div
                                key={img.id}
                                className={clsx(
                                    "relative aspect-square rounded-lg overflow-hidden shadow-sm",
                                    galleryPopup && styles.cursorPointer
                                )}
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
        <SectionContainer id={id} fullWidth={galleryPreview && galleryType === 'swiper'} className="!px-0">
            <div className={styles.header}>
                <span className="text-[10px] tracking-[0.3em] font-medium opacity-40 uppercase" style={{ color: accentColor }}>GALLERY</span>
                <h2 className={styles.galleryTitle}>{galleryTitle}</h2>
                <div className={styles.titleLine} style={{ backgroundColor: accentColor }} />
            </div>

            {renderGallery()}

            {/* Lightbox Modal */}
            {popupIndex !== null && portalElement && createPortal(
                <div
                    className={clsx(styles.modalBackdrop, "animate-modal-bg")}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setPopupIndex(null);
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className={styles.modalHeader}>
                        <span className="text-white/60 text-[10px] tracking-widest pl-2">
                            {currentIndex + 1} / {gallery.length}
                        </span>
                        <button
                            ref={closeBtnRef}
                            onClick={() => setPopupIndex(null)}
                            className="p-2 text-white/50 hover:text-white transition-colors"
                            aria-label="창 닫기"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>

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
});

GalleryView.displayName = 'GalleryView';

export default GalleryView;
