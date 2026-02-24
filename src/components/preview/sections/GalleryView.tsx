'use client';

import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import type { Swiper as SwiperClass } from 'swiper';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import { Placeholder } from '@/components/ui/Placeholder';
import { GalleryLightbox } from './GalleryLightbox';
import { SwiperGallery } from './gallery/SwiperGallery';
import { ThumbnailGallery } from './gallery/ThumbnailGallery';
import { GridGallery } from './gallery/GridGallery';
import type { GalleryItem } from './gallery/types';

interface GalleryViewProps {
  id?: string;
  gallery: (GalleryItem | string)[];
  galleryTitle: string;
  gallerySubtitle: string;
  galleryType: 'swiper' | 'thumbnail' | 'grid';
  galleryFade: boolean;
  galleryAutoplay: boolean;
  galleryPopup: boolean;
  accentColor: string;
  animateEntrance?: boolean;
  isEditing?: boolean;
}

/**
 * Presentational Component for Gallery View.
 * Orchestrates gallery renderers (Swiper/Thumbnail/Grid) and lightbox.
 * Each renderer and lightbox are separate memoized components.
 */
const GalleryView = memo(
  ({
    id,
    gallery: rawGallery,
    galleryTitle,
    gallerySubtitle,
    galleryType,
    galleryFade,
    galleryAutoplay,
    galleryPopup,
    accentColor,
    animateEntrance,
    isEditing = false,
  }: GalleryViewProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    const swiperContainerRef = useRef<HTMLDivElement>(null);

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

    const safeActiveIndex = gallery.length > 0 ? Math.min(activeIndex, gallery.length - 1) : 0;

    // ─── Swiper sync helpers ───

    const syncMainSwiperToIndex = useCallback(
      (index: number) => {
        if (!mainSwiper || mainSwiper.destroyed) return;
        if (mainSwiper.activeIndex !== index) {
          mainSwiper.slideTo(index, 0);
        }
      },
      [mainSwiper]
    );

    const handleMainSlideChange = useCallback((index: number) => {
      setActiveIndex(index);
    }, []);

    // ─── Lightbox open/close ───

    const openLightbox = useCallback(
      (index: number) => {
        if (!galleryPopup) return;
        setActiveIndex(index);
        syncMainSwiperToIndex(index);
        setIsLightboxOpen(true);
      },
      [galleryPopup, syncMainSwiperToIndex]
    );

    const handleLightboxOpenChange = useCallback(
      (open: boolean) => {
        if (open) {
          setIsLightboxOpen(true);
          return;
        }
        syncMainSwiperToIndex(safeActiveIndex);
        setIsLightboxOpen(false);
      },
      [safeActiveIndex, syncMainSwiperToIndex]
    );

    const handleLightboxSlideChange = useCallback(
      (index: number) => {
        setActiveIndex(index);
        syncMainSwiperToIndex(index);
      },
      [syncMainSwiperToIndex]
    );

    // ─── Intersection Observer for Autoplay ───

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
    }, [galleryType]);

    // Autoplay Control
    useEffect(() => {
      if (!mainSwiper || mainSwiper.destroyed) return;

      if (isLightboxOpen) {
        mainSwiper.autoplay?.stop();
        return;
      }

      if (galleryAutoplay && isIntersecting) {
        mainSwiper.autoplay?.start();
      } else {
        mainSwiper.autoplay?.stop();
      }
    }, [isLightboxOpen, mainSwiper, galleryAutoplay, isIntersecting]);

    // Sync main swiper when lightbox opens
    useEffect(() => {
      if (!isLightboxOpen) return;
      syncMainSwiperToIndex(safeActiveIndex);
    }, [isLightboxOpen, safeActiveIndex, syncMainSwiperToIndex]);

    // ─── Vaul Drawer gesture blockers ───

    const blockDrawerGestureStart = useCallback((e: React.PointerEvent) => {
      e.stopPropagation();
    }, []);

    const releaseVaulPointerCapture = useCallback((e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    }, []);

    // ─── Early return ───

    if (gallery.length === 0 && !isEditing) {
      return null;
    }

    // ─── Render ───

    const renderGallery = () => {
      switch (galleryType) {
        case 'swiper':
          return (
            <SwiperGallery
              gallery={gallery}
              galleryFade={galleryFade}
              galleryAutoplay={galleryAutoplay}
              galleryPopup={galleryPopup}
              activeIndex={safeActiveIndex}
              containerRef={swiperContainerRef}
              onSwiper={setMainSwiper}
              onSlideChange={handleMainSlideChange}
              onImageClick={openLightbox}
              blockDrawerGestureStart={blockDrawerGestureStart}
              releaseVaulPointerCapture={releaseVaulPointerCapture}
            />
          );
        case 'thumbnail':
          return (
            <ThumbnailGallery
              gallery={gallery}
              galleryPopup={galleryPopup}
              activeIndex={safeActiveIndex}
              onSwiper={setMainSwiper}
              onSlideChange={handleMainSlideChange}
              onImageClick={openLightbox}
              blockDrawerGestureStart={blockDrawerGestureStart}
              releaseVaulPointerCapture={releaseVaulPointerCapture}
            />
          );
        case 'grid':
        default:
          return (
            <GridGallery
              gallery={gallery}
              galleryPopup={galleryPopup}
              onImageClick={openLightbox}
              blockDrawerGestureStart={blockDrawerGestureStart}
              releaseVaulPointerCapture={releaseVaulPointerCapture}
            />
          );
      }
    };

    return (
      <SectionContainer id={id} animateEntrance={animateEntrance}>
        <SectionHeader title={galleryTitle} subtitle={gallerySubtitle} accentColor={accentColor} />

        {gallery.length > 0 ? renderGallery() : <Placeholder />}

        <GalleryLightbox
          isOpen={isLightboxOpen}
          onOpenChange={handleLightboxOpenChange}
          gallery={gallery}
          activeIndex={safeActiveIndex}
          onSlideChange={handleLightboxSlideChange}
          blockDrawerGestureStart={blockDrawerGestureStart}
          releaseVaulPointerCapture={releaseVaulPointerCapture}
        />
      </SectionContainer>
    );
  }
);

GalleryView.displayName = 'GalleryView';

export default GalleryView;
