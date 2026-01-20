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
import { AspectRatio } from '@/components/ui/AspectRatio';
import { IconButton } from '@/components/ui/IconButton/IconButton';
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
    animateEntrance?: boolean;
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
    accentColor,
    animateEntrance
}: GalleryViewProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popupIndex, setPopupIndex] = useState<number | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
    const [modalSwiper, setModalSwiper] = useState<SwiperClass | null>(null);
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    const swiperContainerRef = useRef<HTMLDivElement>(null);

    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const focusTrapRef = useFocusTrap<HTMLDivElement>(popupIndex !== null);

    useScrollLock(popupIndex !== null, {
        containerSelector: '#invitation-modal-root',
        usePreviousSibling: true,
    });

    // Normalize gallery data
    const gallery = useMemo(() => {
        if (!rawGallery) return [];
        return rawGallery.map((item, index) => {
            if (typeof item === 'string') {
                return { id: `img-${index}-${item.substring(0, 8)}`, url: item };
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
            setPortalElement(document.getElementById('invitation-modal-root') || document.body);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Intersection Observer for Autoplay
    useEffect(() => {
        if (galleryType !== 'swiper') return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]) {
                    setIsIntersecting(entries[0].isIntersecting);
                }
            },
            { threshold: 0.1 }
        );

        if (swiperContainerRef.current) {
            observer.observe(swiperContainerRef.current);
        }

        return () => observer.disconnect();
    }, [galleryType]); // Re-run when type changes

    // Autoplay Control
    useEffect(() => {
        if (!mainSwiper || mainSwiper.destroyed) return;

        if (popupIndex !== null) {
            mainSwiper.autoplay?.stop();
            setTimeout(() => closeBtnRef.current?.focus(), 100);
            return;
        }

        // Only autoplay if enabled AND visible
        if (galleryAutoplay && isIntersecting) {
            mainSwiper.autoplay?.start();
        } else {
            mainSwiper.autoplay?.stop();
        }
    }, [popupIndex, mainSwiper, galleryAutoplay, isIntersecting]);

    // Modal Slide Sync
    useEffect(() => {
        if (popupIndex !== null && modalSwiper && !modalSwiper.destroyed) {
            modalSwiper.slideTo(popupIndex, 0);
        }
    }, [popupIndex, modalSwiper]);

    if (!gallery.length) return <div id={id} />;
    if (!portalElement) return null;

    const renderGallery = () => {
        switch (galleryType) {
            case 'swiper':
                return (
                    <div ref={swiperContainerRef} className={clsx(styles.swiperContainer, !galleryPreview ? styles.swiperContainerLimited : '') || ''}>
                        <div className={clsx(styles.galleryWrapper) || ''}>
                            <Swiper
                                key={`${galleryType}-${gallery.length}-${galleryFade}-${galleryPreview}`}
                                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={galleryFade ? 1 : (galleryPreview ? 1.25 : 1)}
                                centeredSlides={!galleryFade && galleryPreview}
                                observer={true}
                                observeParents={true}
                                effect={galleryFade ? "fade" : "slide"}
                                {...(galleryFade ? { fadeEffect: { crossFade: true } } : {})}
                                autoplay={galleryAutoplay ? { delay: 3000, disableOnInteraction: false } : false}
                                loop={false}
                                onSwiper={setMainSwiper}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                                className={clsx(styles.swiperMain) || ''}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={img.id}>
                                        <div
                                            className={clsx(styles.imageSlide, galleryPopup ? styles.cursorPointer : '') || ''}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image
                                                src={img.url}
                                                alt=""
                                                fill
                                                sizes={galleryPreview
                                                    ? IMAGE_SIZES.gallery
                                                    : '(max-width: 768px) calc(100vw - 64px), 50vw'
                                                }
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {gallery.length > 1 ? (
                                <div className={clsx(styles.counter) || ''}>
                                    {currentIndex + 1} / {gallery.length}
                                </div>
                            ) : null}
                        </div>
                    </div>
                );
            case 'thumbnail':
                return (
                    <div className={clsx(styles.swiperContainerLimited) || ''}>
                        <Swiper
                            spaceBetween={10}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            onSwiper={setMainSwiper}
                            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                            className={clsx(styles.swiperThumbMain) || ''}
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                                    <div className={clsx(styles.imageSlide, galleryPopup ? styles.cursorPointer : '') || ''}>
                                        <Image
                                            src={img.url}
                                            alt=""
                                            fill
                                            sizes="(max-width: 768px) calc(100vw - 64px), 50vw"
                                        />
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
                            className={clsx(styles.swiperThumbNav) || ''}
                        >
                            {gallery.map((img, index) => (
                                <SwiperSlide key={img.id} className={clsx(styles.cursorPointer) || ''}>
                                    <div
                                        className={clsx(styles.thumbItem, index === currentIndex ? styles.active : '') || ''}
                                        style={index === currentIndex ? { '--active-ring-color': accentColor } as React.CSSProperties : {}}
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
                    <div className={clsx(styles.gridContainer) || ''}>
                        {gallery.map((img, i) => (
                            <div
                                key={img.id}
                                className={clsx(styles.gridItem, galleryPopup ? styles.cursorPointer : '') || ''}
                                onClick={() => handleImageClick(i)}
                            >
                                <AspectRatio ratio={1 / 1} className={clsx(styles.fullSize) || ''}>
                                    <Image src={img.url} alt="" fill sizes={IMAGE_SIZES.galleryGrid} />
                                </AspectRatio>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <SectionContainer
            id={id}
            fullWidth={galleryPreview && galleryType === 'swiper'}
            style={{ paddingInline: (galleryPreview && galleryType === 'swiper') ? '0' : undefined }}
            animateEntrance={animateEntrance}
        >
            <SectionHeader
                title={galleryTitle}
                subtitle={gallerySubtitle}
                accentColor={accentColor}
            />

            {renderGallery()}

            {/* Lightbox Modal */}
            {(popupIndex !== null && portalElement) ? createPortal(
                <div
                    className={clsx(styles.modalBackdrop, MOTION_CLASSES.overlay) || ''}
                    ref={focusTrapRef}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setPopupIndex(null);
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className={clsx(styles.modalHeader) || ''}>
                        <span className={clsx(styles.count) || ''}>
                            {currentIndex + 1} / {gallery.length}
                        </span>
                        <IconButton
                            ref={closeBtnRef}
                            icon={X}
                            variant="ghost"
                            onClick={() => setPopupIndex(null)}
                            className={clsx(styles.closeBtn) || ''}
                            aria-label="창 닫기"
                        />
                    </div>

                    <div className={clsx(styles.modalSwiperContainer, MOTION_CLASSES.dialog) || ''}>
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
                                <SwiperSlide key={img.id} className={clsx(styles.modalSlide) || ''}>
                                    <div className={clsx(styles.imageWrapper) || ''}>
                                        <Image
                                            src={img.url}
                                            alt=""
                                            fill
                                            sizes="calc(100vw - 32px)"
                                            priority={img.id === gallery[popupIndex ?? 0]?.id}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>,
                portalElement
            ) : null}
        </SectionContainer>
    );
});

GalleryView.displayName = 'GalleryView';

export default GalleryView;
