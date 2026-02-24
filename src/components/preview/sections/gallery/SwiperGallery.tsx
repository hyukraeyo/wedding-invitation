'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { clsx } from 'clsx';
import type { GalleryItem } from './types';
import styles from '../GalleryView.module.scss';

const SWIPER_MODULES = [Navigation, Pagination, EffectFade, Autoplay];

interface SwiperGalleryProps {
  gallery: GalleryItem[];
  galleryFade: boolean;
  galleryAutoplay: boolean;
  galleryPopup: boolean;
  activeIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSwiper: (swiper: SwiperClass) => void;
  onSlideChange: (index: number) => void;
  onImageClick: (index: number) => void;
  blockDrawerGestureStart: (e: React.PointerEvent) => void;
  releaseVaulPointerCapture: (e: React.PointerEvent) => void;
}

const SwiperGallery = memo(function SwiperGallery({
  gallery,
  galleryFade,
  galleryAutoplay,
  galleryPopup,
  activeIndex,
  containerRef,
  onSwiper,
  onSlideChange,
  onImageClick,
  blockDrawerGestureStart,
  releaseVaulPointerCapture,
}: SwiperGalleryProps) {
  const safeActiveIndex = gallery.length > 0 ? Math.min(activeIndex, gallery.length - 1) : 0;

  return (
    <div
      ref={containerRef}
      className={clsx(styles.swiperContainer, galleryFade && styles.fullBleed)}
    >
      <div
        className={styles.galleryWrapper}
        data-vaul-no-drag
        data-preview-gesture-bypass
        onPointerDown={blockDrawerGestureStart}
        onGotPointerCapture={releaseVaulPointerCapture}
      >
        <Swiper
          key={`swiper-${gallery.length}-${galleryFade}`}
          modules={SWIPER_MODULES}
          spaceBetween={galleryFade ? 0 : 20}
          slidesPerView={galleryFade ? 1 : 1.18}
          centeredSlides={!galleryFade}
          observer={true}
          observeParents={true}
          effect={galleryFade ? 'fade' : 'slide'}
          {...(galleryFade ? { fadeEffect: { crossFade: true } } : {})}
          autoplay={galleryAutoplay ? { delay: 3000, disableOnInteraction: false } : false}
          loop={false}
          nested={true}
          touchEventsTarget="container"
          touchRatio={1}
          touchAngle={45}
          grabCursor={true}
          threshold={5}
          onSwiper={onSwiper}
          onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
          className={styles.swiperMain}
        >
          {gallery.map((img, index) => (
            <SwiperSlide key={img.id}>
              <div
                className={clsx(styles.imageSlide, galleryPopup && styles.cursorPointer)}
                style={galleryFade ? { borderRadius: '0' } : undefined}
                onClick={() => onImageClick(index)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) calc(100vw - 48px), 500px"
                  quality={85}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {gallery.length > 1 ? (
          <div className={styles.counter}>
            {safeActiveIndex + 1} / {gallery.length}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export { SwiperGallery };
