'use client';

import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
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
import { Dialog } from '@/components/ui/Dialog';
import { IconButton } from '@/components/ui/IconButton';
import { Placeholder } from '@/components/ui/Placeholder';
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
  isEditing?: boolean;
}

const SWIPER_MODULES = [Navigation, Pagination, EffectFade, Autoplay];
const THUMB_MAIN_MODULES = [FreeMode, Navigation, Thumbs];
const THUMB_NAV_MODULES = [FreeMode, Thumbs];
const LIGHTBOX_MODULES = [Navigation, Pagination];

// ─── Custom Zoom Hook (replaces broken Swiper Zoom + Next/Image fill) ───
function useZoomGesture(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onZoomStateChange?: ((zoomed: boolean) => void) | undefined
) {
  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const initialPinchDistRef = useRef(0);
  const initialScaleRef = useRef(1);
  const isPinchingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const zoomedRef = useRef(false);

  const syncZoomState = useCallback(
    (scale: number) => {
      const zoomed = scale > 1.05;
      if (zoomedRef.current === zoomed) return;
      zoomedRef.current = zoomed;
      onZoomStateChange?.(zoomed);
    },
    [onZoomStateChange]
  );

  const applyTransform = useCallback(() => {
    const el = containerRef.current?.querySelector('[data-zoom-target]') as HTMLElement | null;
    if (!el) return;
    const s = scaleRef.current;
    const t = translateRef.current;
    el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) scale(${s})`;
    el.style.transformOrigin = 'center center';
  }, [containerRef]);

  const resetZoom = useCallback(() => {
    scaleRef.current = 1;
    translateRef.current = { x: 0, y: 0 };
    syncZoomState(1);
    const el = containerRef.current?.querySelector('[data-zoom-target]') as HTMLElement | null;
    if (el) {
      el.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      setTimeout(() => {
        if (el) el.style.transition = '';
      }, 300);
    }
  }, [containerRef, syncZoomState]);

  const isZoomed = useCallback(() => zoomedRef.current, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getTouchDistance = (e: TouchEvent) => {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      if (!t1 || !t2) return 0;
      return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        e.preventDefault();
        isPinchingRef.current = true;
        initialPinchDistRef.current = getTouchDistance(e);
        initialScaleRef.current = scaleRef.current;
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (!touch) return;
        const now = Date.now();
        const last = lastTouchRef.current;

        // Double-tap detection
        if (
          last &&
          now - last.time < 300 &&
          Math.abs(touch.clientX - last.x) < 30 &&
          Math.abs(touch.clientY - last.y) < 30
        ) {
          e.preventDefault();
          if (scaleRef.current > 1.05) {
            resetZoom();
          } else {
            scaleRef.current = 2.5;
            syncZoomState(scaleRef.current);
            const el = containerRef.current?.querySelector(
              '[data-zoom-target]'
            ) as HTMLElement | null;
            if (el) {
              const rect = el.getBoundingClientRect();
              const cx = touch.clientX - rect.left - rect.width / 2;
              const cy = touch.clientY - rect.top - rect.height / 2;
              translateRef.current = { x: -cx * 1.5, y: -cy * 1.5 };
              el.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
              applyTransform();
              setTimeout(() => {
                if (el) el.style.transition = '';
              }, 300);
            }
          }
          lastTouchRef.current = null;
          return;
        }

        lastTouchRef.current = { x: touch.clientX, y: touch.clientY, time: now };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinchingRef.current) {
        e.preventDefault();
        const dist = getTouchDistance(e);
        const newScale = Math.min(
          Math.max(initialScaleRef.current * (dist / initialPinchDistRef.current), 1),
          4
        );
        scaleRef.current = newScale;
        syncZoomState(newScale);

        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(applyTransform);
      } else if (e.touches.length === 1 && scaleRef.current > 1.05) {
        // Pan while zoomed
        e.preventDefault();
        const last = lastTouchRef.current;
        const panTouch = e.touches[0];
        if (last && panTouch) {
          const dx = panTouch.clientX - last.x;
          const dy = panTouch.clientY - last.y;
          translateRef.current = {
            x: translateRef.current.x + dx,
            y: translateRef.current.y + dy,
          };
          lastTouchRef.current = {
            x: panTouch.clientX,
            y: panTouch.clientY,
            time: last.time,
          };
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = requestAnimationFrame(applyTransform);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isPinchingRef.current && e.touches.length < 2) {
        isPinchingRef.current = false;
        if (scaleRef.current < 1.1) {
          resetZoom();
        }
      }
    };

    // Desktop double-click
    const handleDblClick = (e: MouseEvent) => {
      if (scaleRef.current > 1.05) {
        resetZoom();
      } else {
        scaleRef.current = 2.5;
        syncZoomState(scaleRef.current);
        const el = containerRef.current?.querySelector('[data-zoom-target]') as HTMLElement | null;
        if (el) {
          const rect = el.getBoundingClientRect();
          const cx = e.clientX - rect.left - rect.width / 2;
          const cy = e.clientY - rect.top - rect.height / 2;
          translateRef.current = { x: -cx * 1.5, y: -cy * 1.5 };
          el.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
          applyTransform();
          setTimeout(() => {
            if (el) el.style.transition = '';
          }, 300);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('dblclick', handleDblClick);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('dblclick', handleDblClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, applyTransform, resetZoom, syncZoomState]);

  return { resetZoom, isZoomed };
}

/**
 * Presentational Component for Gallery View.
 * Receives all data via props as per Container/Presentational pattern.
 * Uses SCSS Modules for styling.
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
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
    const [modalSwiper, setModalSwiper] = useState<SwiperClass | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [isModalZoomed, setIsModalZoomed] = useState(false);

    const swiperContainerRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const zoomContainerRef = useRef<HTMLDivElement>(null);

    const handleModalZoomStateChange = useCallback(
      (zoomed: boolean) => {
        setIsModalZoomed((prev) => (prev === zoomed ? prev : zoomed));
      },
      [setIsModalZoomed]
    );

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

    const { resetZoom, isZoomed } = useZoomGesture(zoomContainerRef, handleModalZoomStateChange);

    const safeActiveIndex = gallery.length > 0 ? Math.min(activeIndex, gallery.length - 1) : 0;

    const syncMainSwiperToIndex = useCallback(
      (index: number) => {
        if (!mainSwiper || mainSwiper.destroyed) return;
        if (mainSwiper.activeIndex !== index) {
          mainSwiper.slideTo(index, 0);
        }
      },
      [mainSwiper]
    );

    const syncModalSwiperToIndex = useCallback(
      (index: number) => {
        if (!modalSwiper || modalSwiper.destroyed) return;
        if (modalSwiper.activeIndex !== index) {
          modalSwiper.slideTo(index, 0);
        }
      },
      [modalSwiper]
    );

    const handleMainSlideChange = useCallback(
      (index: number) => {
        setActiveIndex(index);
        if (isLightboxOpen) {
          syncModalSwiperToIndex(index);
        }
      },
      [isLightboxOpen, syncModalSwiperToIndex]
    );

    // Open lightbox
    const openLightbox = useCallback(
      (index: number) => {
        if (galleryPopup) {
          setIsModalZoomed(false);
          setActiveIndex(index);
          syncMainSwiperToIndex(index);
          setIsLightboxOpen(true);
        }
      },
      [galleryPopup, syncMainSwiperToIndex]
    );

    const closeLightbox = useCallback(() => {
      setIsModalZoomed(false);
      resetZoom();
      syncMainSwiperToIndex(safeActiveIndex);
      setIsLightboxOpen(false);
    }, [resetZoom, safeActiveIndex, syncMainSwiperToIndex]);

    const handleLightboxOpenChange = useCallback(
      (open: boolean) => {
        if (open) {
          setIsLightboxOpen(true);
          return;
        }

        closeLightbox();
      },
      [closeLightbox]
    );

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
    }, [galleryType]);

    // Autoplay Control
    useEffect(() => {
      if (!mainSwiper || mainSwiper.destroyed) return;

      if (isLightboxOpen) {
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
    }, [isLightboxOpen, mainSwiper, galleryAutoplay, isIntersecting]);

    // Keep modal slide and base gallery slide in sync while the lightbox is open.
    useEffect(() => {
      if (!isLightboxOpen) return;
      syncModalSwiperToIndex(safeActiveIndex);
      syncMainSwiperToIndex(safeActiveIndex);
    }, [isLightboxOpen, safeActiveIndex, syncMainSwiperToIndex, syncModalSwiperToIndex]);

    // Notify outer mobile preview shell (Builder Drawer) that gallery fullscreen is active.
    // This is used to hide shell-level floating controls above the lightbox.
    useEffect(() => {
      if (!isLightboxOpen) return undefined;

      document.body.setAttribute('data-gallery-fullscreen-open', 'true');

      return () => {
        document.body.removeAttribute('data-gallery-fullscreen-open');
      };
    }, [isLightboxOpen]);

    // Lock background scroll while lightbox is open.
    useEffect(() => {
      if (!isLightboxOpen) return undefined;

      const lockTargets = [document.documentElement, document.body];
      const snapshots = lockTargets.map((element) => ({
        element,
        overflow: element.style.overflow,
        overscrollBehavior: element.style.overscrollBehavior,
        touchAction: element.style.touchAction,
      }));

      snapshots.forEach(({ element }) => {
        element.style.overflow = 'hidden';
        element.style.overscrollBehavior = 'none';
        element.style.touchAction = 'none';
      });

      return () => {
        snapshots.forEach(({ element, overflow, overscrollBehavior, touchAction }) => {
          element.style.overflow = overflow;
          element.style.overscrollBehavior = overscrollBehavior;
          element.style.touchAction = touchAction;
        });
      };
    }, [isLightboxOpen]);

    // Reset zoom when changing slides
    const handleModalSlideChange = useCallback(
      (swiper: SwiperClass) => {
        const index = swiper.activeIndex;
        resetZoom();
        setActiveIndex(index);
        syncMainSwiperToIndex(index);
      },
      [resetZoom, syncMainSwiperToIndex]
    );

    /**
     * Vaul handles pointer dragging from Drawer.Content. Stop pointerdown
     * propagation for no-drag regions so Swiper owns swipe gestures.
     */
    const blockDrawerGestureStart = useCallback((e: React.PointerEvent) => {
      e.stopPropagation();
    }, []);

    /**
     * Vaul's onPress can set pointer capture before no-drag checks on some
     * flows. Release capture immediately so child Swiper/zoom gestures keep working.
     */
    const releaseVaulPointerCapture = useCallback((e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    }, []);

    if (gallery.length === 0 && !isEditing) {
      return null;
    }

    const renderGallery = () => {
      switch (galleryType) {
        case 'swiper':
          const isFade = galleryFade;

          return (
            <div
              ref={swiperContainerRef}
              className={clsx(styles.swiperContainer, isFade && styles.fullBleed)}
            >
              <div
                className={clsx(styles.galleryWrapper) || ''}
                data-vaul-no-drag
                data-preview-gesture-bypass
                onPointerDown={blockDrawerGestureStart}
                onGotPointerCapture={releaseVaulPointerCapture}
              >
                <Swiper
                  key={`${galleryType}-${gallery.length}-${isFade}`}
                  modules={SWIPER_MODULES}
                  spaceBetween={isFade ? 0 : 20}
                  slidesPerView={isFade ? 1 : 1.18}
                  centeredSlides={!isFade}
                  observer={true}
                  observeParents={true}
                  effect={isFade ? 'fade' : 'slide'}
                  {...(isFade ? { fadeEffect: { crossFade: true } } : {})}
                  autoplay={galleryAutoplay ? { delay: 3000, disableOnInteraction: false } : false}
                  loop={false}
                  nested={true}
                  // ── Mobile touch optimization ──
                  touchEventsTarget="container"
                  touchRatio={1}
                  touchAngle={45}
                  grabCursor={true}
                  threshold={5}
                  onSwiper={setMainSwiper}
                  onSlideChange={(swiper) => handleMainSlideChange(swiper.realIndex)}
                  className={clsx(styles.swiperMain) || ''}
                >
                  {gallery.map((img, index) => (
                    <SwiperSlide key={img.id}>
                      <div
                        className={
                          clsx(styles.imageSlide, galleryPopup ? styles.cursorPointer : '') || ''
                        }
                        style={{ borderRadius: isFade ? '0' : undefined }}
                        onClick={() => openLightbox(index)}
                      >
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          priority={index === 0}
                          sizes={'(max-width: 768px) calc(100vw - 48px), 500px'}
                          quality={85}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {gallery.length > 1 ? (
                  <div className={clsx(styles.counter) || ''}>
                    {safeActiveIndex + 1} / {gallery.length}
                  </div>
                ) : null}
              </div>
            </div>
          );
        case 'thumbnail':
          return (
            <div
              className={clsx(styles.swiperContainerLimited) || ''}
              data-vaul-no-drag
              data-preview-gesture-bypass
              onPointerDown={blockDrawerGestureStart}
              onGotPointerCapture={releaseVaulPointerCapture}
            >
              <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={THUMB_MAIN_MODULES}
                onSwiper={setMainSwiper}
                onSlideChange={(swiper) => handleMainSlideChange(swiper.activeIndex)}
                nested={true}
                // ── Mobile touch optimization ──
                touchEventsTarget="container"
                touchRatio={1}
                touchAngle={45}
                grabCursor={true}
                threshold={5}
                className={clsx(styles.swiperThumbMain) || ''}
              >
                {gallery.map((img, index) => (
                  <SwiperSlide key={img.id} onClick={() => openLightbox(index)}>
                    <div
                      className={
                        clsx(styles.imageSlide, galleryPopup ? styles.cursorPointer : '') || ''
                      }
                    >
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
                className={clsx(styles.swiperThumbNav) || ''}
              >
                {gallery.map((img, index) => (
                  <SwiperSlide key={img.id}>
                    <div
                      className={
                        clsx(styles.thumbItem, index === safeActiveIndex ? styles.active : '') || ''
                      }
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
            <div
              className={clsx(styles.gridContainer) || ''}
              data-vaul-no-drag
              data-preview-gesture-bypass
              onPointerDown={blockDrawerGestureStart}
              onGotPointerCapture={releaseVaulPointerCapture}
            >
              {gallery.map((img, i) => (
                <div
                  key={img.id}
                  className={clsx(styles.gridItem, galleryPopup ? styles.cursorPointer : '') || ''}
                  onClick={() => openLightbox(i)}
                >
                  <AspectRatio ratio={1 / 1} className={clsx(styles.fullSize) || ''}>
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      priority={i === 0}
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
      <SectionContainer id={id} animateEntrance={animateEntrance}>
        <SectionHeader title={galleryTitle} subtitle={gallerySubtitle} accentColor={accentColor} />

        {gallery.length > 0 ? renderGallery() : <Placeholder />}

        <Dialog
          open={isLightboxOpen}
          onOpenChange={handleLightboxOpenChange}
          type="fullScreen"
          className={styles.lightboxDialogContent}
          aria-label="갤러리 전체화면"
        >
          <div className={styles.lightbox}>
            {/* Header */}
            <div className={clsx(styles.lightboxHeader)}>
              <div className={styles.lightboxHeaderCenter}>
                <span className={clsx(styles.lightboxCount)} aria-live="polite">
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
                // ── Mobile touch: allow swipe only when not zoomed ──
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
                  // Dynamically enable/disable touch based on zoom state
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
      </SectionContainer>
    );
  }
);

GalleryView.displayName = 'GalleryView';

export default GalleryView;
