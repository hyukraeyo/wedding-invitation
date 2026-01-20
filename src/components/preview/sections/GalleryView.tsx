'use client';

import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Image as ImageIcon } from 'lucide-react';
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
    galleryFade: boolean;
    galleryAutoplay: boolean;
    galleryPopup: boolean;
    accentColor: string;
    animateEntrance?: boolean;
}

const SWIPER_MODULES = [Navigation, Pagination, EffectFade, Autoplay];

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

    // if (!gallery.length) return <div id={id} />; // 삭제: 빈 상태라도 영역을 렌더링해야 함
    if (!portalElement) return null;

    const renderGallery = () => {
        switch (galleryType) {
            case 'swiper':
                const isFade = galleryFade;

                return (
                    <div ref={swiperContainerRef} className={clsx(styles.swiperContainer, isFade && styles.fullBleed)}>
                        <div className={clsx(styles.galleryWrapper) || ''}>
                            <Swiper
                                key={`${galleryType}-${gallery.length}-${isFade}`}
                                modules={SWIPER_MODULES}
                                spaceBetween={isFade ? 0 : 20}
                                slidesPerView={isFade ? 1 : 1.18}
                                centeredSlides={!isFade}
                                observer={true}
                                observeParents={true}
                                effect={isFade ? "fade" : "slide"}
                                {...(isFade ? { fadeEffect: { crossFade: true } } : {})}
                                autoplay={galleryAutoplay ? { delay: 3000, disableOnInteraction: false } : false}
                                loop={false}
                                onSwiper={setMainSwiper}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                                className={clsx(styles.swiperMain) || ''}
                            >
                                {gallery.map((img, index) => (
                                    <SwiperSlide key={img.id}>
                                        <div
                                            className={clsx(
                                                styles.imageSlide,
                                                galleryPopup ? styles.cursorPointer : ''
                                            ) || ''}
                                            style={{ borderRadius: isFade ? '0' : undefined }}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image
                                                src={img.url}
                                                alt=""
                                                fill
                                                priority={index === 0}
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                sizes={'(max-width: 768px) calc(100vw - 48px), 500px'}
                                                quality={85}
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
                                            loading={index < 3 ? 'eager' : 'lazy'}
                                            sizes="(max-width: 768px) calc(100vw - 64px), 50vw"
                                            quality={85}
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
                                        <Image 
                                            src={img.url} 
                                            alt="" 
                                            fill 
                                            loading={index < 5 ? 'eager' : 'lazy'}
                                            sizes={IMAGE_SIZES.galleryThumb} 
                                            quality={75}
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
                    <div className={clsx(styles.gridContainer) || ''}>
                        {gallery.map((img, i) => (
                            <div
                                key={img.id}
                                className={clsx(styles.gridItem, galleryPopup ? styles.cursorPointer : '') || ''}
                                onClick={() => handleImageClick(i)}
                            >
                                <AspectRatio ratio={1 / 1} className={clsx(styles.fullSize) || ''}>
                                    <Image 
                                        src={img.url} 
                                        alt="" 
                                        fill 
                                        loading={i < 6 ? 'eager' : 'lazy'}
                                        sizes={IMAGE_SIZES.galleryGrid} 
                                        quality={85}
                                    />
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
            animateEntrance={animateEntrance}
        >
            <SectionHeader
                title={galleryTitle}
                subtitle={gallerySubtitle}
                accentColor={accentColor}
            />

            {gallery.length > 0 ? renderGallery() : (
                <div className={clsx(styles.emptyState) || ''}>
                    <ImageIcon />
                    <span>사진을 등록해주세요</span>
                </div>
            )}

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
                                            loading={img.id === gallery[popupIndex ?? 0]?.id ? 'eager' : 'lazy'}
                                            quality={85}
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
