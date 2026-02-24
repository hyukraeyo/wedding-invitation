'use client';

import React, { memo, useRef, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { Dialog } from '@/components/ui/Dialog';
import { IconButton } from '@/components/ui/IconButton';
import { useZoomGesture } from '@/hooks/useZoomGesture';
import { useLightboxEffects } from '@/hooks/useLightboxEffects';
import styles from './GalleryView.module.scss';
import type { GalleryItem } from './gallery/types';

interface GalleryLightboxProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: GalleryItem[];
  activeIndex: number;
  onSlideChange: (index: number) => void;
  /** Stop pointer-down propagation so Swiper owns swipe over Vaul Drawer */
  blockDrawerGestureStart: (e: React.PointerEvent) => void;
  /** Release pointer capture grabbed by Vaul to let child gestures work */
  releaseVaulPointerCapture: (e: React.PointerEvent) => void;
}

const LIGHTBOX_MODULES = [Navigation, Pagination];

const GalleryLightbox = memo(function GalleryLightbox({
  isOpen,
  onOpenChange,
  gallery,
  activeIndex,
  onSlideChange,
  blockDrawerGestureStart,
  releaseVaulPointerCapture,
}: GalleryLightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const [isModalZoomed, setIsModalZoomed] = useState(false);
  const [modalSwiper, setModalSwiper] = useState<SwiperClass | null>(null);

  const handleModalZoomStateChange = useCallback((zoomed: boolean) => {
    setIsModalZoomed((prev) => (prev === zoomed ? prev : zoomed));
  }, []);

  const { resetZoom, isZoomed } = useZoomGesture(zoomContainerRef, handleModalZoomStateChange);

  // Body-level effects (fullscreen attr, scroll lock)
  useLightboxEffects(isOpen);

  // Focus close button on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Sync modal swiper to activeIndex
  useEffect(() => {
    if (!isOpen || !modalSwiper || modalSwiper.destroyed) return;
    if (modalSwiper.activeIndex !== activeIndex) {
      modalSwiper.slideTo(activeIndex, 0);
    }
  }, [isOpen, activeIndex, modalSwiper]);

  const handleModalSlideChange = useCallback(
    (swiper: SwiperClass) => {
      resetZoom();
      onSlideChange(swiper.activeIndex);
    },
    [resetZoom, onSlideChange]
  );

  const handleClose = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsModalZoomed(false);
        resetZoom();
      }
      onOpenChange(open);
    },
    [onOpenChange, resetZoom]
  );

  const safeActiveIndex = gallery.length > 0 ? Math.min(activeIndex, gallery.length - 1) : 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      type="fullScreen"
      className={styles.lightboxDialogContent}
      aria-label="갤러리 전체화면"
    >
      <div className={styles.lightbox}>
        {/* Header */}
        <div className={styles.lightboxHeader}>
          <div className={styles.lightboxHeaderCenter}>
            <span className={styles.lightboxCount} aria-live="polite">
              {safeActiveIndex + 1} / {gallery.length}
            </span>
          </div>
        </div>

        {/* Swiper for slide navigation + custom zoom */}
        <div
          ref={zoomContainerRef}
          className={styles.lightboxBody}
          data-vaul-no-drag
          data-preview-gesture-bypass
          onPointerDown={blockDrawerGestureStart}
          onGotPointerCapture={releaseVaulPointerCapture}
        >
          <Swiper
            initialSlide={safeActiveIndex}
            modules={LIGHTBOX_MODULES}
            slidesPerView={1}
            spaceBetween={0}
            observer={true}
            observeParents={true}
            nested={true}
            // Mobile touch: allow swipe only when not zoomed
            touchEventsTarget="container"
            touchRatio={1}
            touchAngle={30}
            threshold={10}
            resistance={true}
            resistanceRatio={0.85}
            followFinger={true}
            allowTouchMove={!isModalZoomed}
            onSwiper={setModalSwiper}
            onSlideChange={handleModalSlideChange}
            onTouchStart={(swiper) => {
              swiper.allowTouchMove = !isZoomed();
            }}
            className={styles.lightboxSwiper}
          >
            {gallery.map((img, i) => (
              <SwiperSlide key={img.id} className={styles.lightboxSlide}>
                <div data-zoom-target className={styles.lightboxImageWrapper}>
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={i === safeActiveIndex}
                    loading={i === safeActiveIndex ? 'eager' : 'lazy'}
                    quality={90}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <Dialog.Close asChild>
          <IconButton
            ref={closeBtnRef}
            type="button"
            variant="secondary"
            size="xl"
            className={styles.lightboxCloseFloating}
            aria-label="갤러리 닫기"
            title="닫기"
          >
            <X size={24} aria-hidden />
          </IconButton>
        </Dialog.Close>
      </div>
    </Dialog>
  );
});

export { GalleryLightbox };
