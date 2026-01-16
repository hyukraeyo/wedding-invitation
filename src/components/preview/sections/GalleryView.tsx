'use client';

import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
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
import SectionHeader from '../SectionHeader';
import styles from './GalleryView.module.scss';
import { clsx } from 'clsx';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useFocusTrap } from '@/hooks/useAccessibility';
import { MOTION_CLASSES } from '@/constants/motion';
import { IMAGE_SIZES } from '@/constants/image';

interface GalleryItem {
    id: string;
    url: string;
}

interface GalleryViewProps {
    id?: string | undefined;
    gallery: (GalleryItem | string)[];
    galleryTitle: string;
    gallerySubtitle: string;
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
 * Uses SCSS Modules for styling.
 */
const GalleryView = memo(({
    id,
    gallery: rawGallery,
    galleryTitle,
    gallerySubtitle,
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
    const focusTrapRef = useFocusTrap<HTMLDivElement>(popupIndex !== null);

    useScrollLock(popupIndex !== null, {
        containerSelector: '#invitation-modal-root',
        usePreviousSibling: true,
    });

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

    const handleImageClick = useCallback((index: number) => {
        if (galleryPopup) {
            setPopupIndex(index);
        }
    }, [galleryPopup]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
            const root = document.getElementById('invitation-modal-root');
            setPortalElement(root || document.body);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Autoplay Control
    useEffect(() => {
        if (popupIndex !== null) {
            if (mainSwiper && !mainSwiper.destroyed) {
                mainSwiper.autoplay?.stop();
            }

            setTimeout(() => closeBtnRef.current?.focus(), 100);
            return;
        }

        if (mainSwiper && !mainSwiper.destroyed && galleryAutoplay) {
            mainSwiper.autoplay?.start();
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

    const renderGallery = () => {
        switch (galleryType) {
            case 'swiper':
                return (
                    <div className={clsx(styles.swiperContainer, !galleryPreview && styles.swiperContainerLimited)}>
                        <div className={styles.galleryWrapper}>
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
                                className={styles.swiperMain}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={img.id}>
                                        <div
                                            className={clsx(styles.imageSlide, galleryPopup && styles.cursorPointer)}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image src={img.url} alt="" fill sizes={IMAGE_SIZES.gallery} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {gallery.length > 1 ? (
                                <div className={styles.counter}>
                                    {currentIndex + 1} / {gallery.length}
                                </div>
                            ) : null}
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
                            className={styles.swiperThumbMain}
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                                    <div className={clsx(styles.imageSlide, galleryPopup && styles.cursorPointer)}>
                                        <Image src={img.url} alt="" fill sizes={IMAGE_SIZES.gallery} />
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
                            className={styles.swiperThumbNav}
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} className={styles.cursorPointer}>
                                    <div
                                        className={clsx(
                                            styles.thumbItem,
                                            index === currentIndex && styles.active
                                        )}
                                        style={index === currentIndex ? { '--tw-ring-color': accentColor } as React.CSSProperties : {}}
                                    >
                                        <Image src={img.url} alt="" fill sizes={IMAGE_SIZES.galleryThumb} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                );
            case 'grid':
            default:
                return (
                    <div className={styles.gridContainer}>
                        {gallery.map((img, i) => (
                            <div
                                key={img.id}
                                className={clsx(
                                    styles.gridItem,
                                    galleryPopup && styles.cursorPointer
                                )}
                                onClick={() => handleImageClick(i)}
                            >
                                <AspectRatio ratio={1 / 1}>
                                    <Image src={img.url} alt="" fill sizes={IMAGE_SIZES.galleryGrid} className="object-cover" />
                                </AspectRatio>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <SectionContainer id={id} fullWidth={galleryPreview && galleryType === 'swiper'} style={{ paddingInline: (galleryPreview && galleryType === 'swiper') ? '0' : undefined }}>
            <SectionHeader
                title={galleryTitle}
                subtitle={gallerySubtitle}
                accentColor={accentColor}
            />

            {renderGallery()}

            {/* Lightbox Modal */}
            {popupIndex !== null && portalElement && createPortal(
                <div
                    className={clsx(styles.modalBackdrop, MOTION_CLASSES.overlay)}
                    ref={focusTrapRef}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setPopupIndex(null);
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className={styles.modalHeader}>
                        <span className={styles.count}>
                            {currentIndex + 1} / {gallery.length}
                        </span>
                        <button
                            ref={closeBtnRef}
                            onClick={() => setPopupIndex(null)}
                            className={styles.closeBtn}
                            aria-label="창 닫기"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className={clsx(styles.modalSwiperContainer, MOTION_CLASSES.dialog)}>
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
                        >
                            {gallery.map((img) => (
                                <SwiperSlide key={img.id} className={styles.modalSlide}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={img.url}
                                            alt=""
                                            fill
                                            sizes={IMAGE_SIZES.full}
                                            priority={img.id === gallery[popupIndex ?? 0]?.id}
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
