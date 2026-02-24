'use client';

import React, { memo, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { clsx } from 'clsx';
import type { GalleryItem } from './types';
import { IMAGE_SIZES } from '@/constants/image';
import styles from '../GalleryView.module.scss';

const THUMB_MAIN_MODULES = [FreeMode, Navigation, Thumbs];
const THUMB_NAV_MODULES = [FreeMode, Thumbs];

interface ThumbnailGalleryProps {
  gallery: GalleryItem[];
  galleryPopup: boolean;
  activeIndex: number;
  onSwiper: (swiper: SwiperClass) => void;
  onSlideChange: (index: number) => void;
  onImageClick: (index: number) => void;
  blockDrawerGestureStart: (e: React.PointerEvent) => void;
  releaseVaulPointerCapture: (e: React.PointerEvent) => void;
}

const ThumbnailGallery = memo(function ThumbnailGallery({
  gallery,
  galleryPopup,
  activeIndex,
  onSwiper,
  onSlideChange,
  onImageClick,
  blockDrawerGestureStart,
  releaseVaulPointerCapture,
}: ThumbnailGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const safeActiveIndex = gallery.length > 0 ? Math.min(activeIndex, gallery.length - 1) : 0;

  return (
    <div
      className={styles.swiperContainerLimited}
      data-vaul-no-drag
      data-preview-gesture-bypass
      onPointerDown={blockDrawerGestureStart}
      onGotPointerCapture={releaseVaulPointerCapture}
    >
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={THUMB_MAIN_MODULES}
        onSwiper={onSwiper}
        onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        nested={true}
        touchEventsTarget="container"
        touchRatio={1}
        touchAngle={45}
        grabCursor={true}
        threshold={5}
        className={styles.swiperThumbMain}
      >
        {gallery.map((img, index) => (
          <SwiperSlide key={img.id} onClick={() => onImageClick(index)}>
            <div className={clsx(styles.imageSlide, galleryPopup && styles.cursorPointer)}>
              <Image
                src={img.url}
                alt=""
                fill
                priority={index === 0}
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
        modules={THUMB_NAV_MODULES}
        nested={true}
        className={styles.swiperThumbNav}
      >
        {gallery.map((img, index) => (
          <SwiperSlide key={img.id}>
            <div className={clsx(styles.thumbItem, index === safeActiveIndex && styles.active)}>
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
});

export { ThumbnailGallery };
