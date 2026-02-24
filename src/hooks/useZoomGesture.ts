'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom zoom gesture hook for pinch-to-zoom, double-tap, and pan.
 * Replaces broken Swiper Zoom + Next/Image fill combination.
 *
 * Manages zoom state internally via refs for jank-free 60fps transforms.
 * Communicates zoom state changes to parent via optional callback.
 */
export function useZoomGesture(
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
