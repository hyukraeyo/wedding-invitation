'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './CustomScrollbar.module.scss';
import { cn } from '@/lib/utils';

/**
 * iOS 스타일의 커스텀 스크롤바 컴포넌트
 * 페이지 전체 스크롤을 감지하여 얇고 투명한 스크롤바를 표시합니다.
 */
export const CustomScrollbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTrackerRef = useRef<{ startY: number; startScrollTop: number } | null>(null);

  const updateScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 스크롤이 필요 없는 경우 숨김
    if (scrollHeight <= clientHeight + 1) {
      setIsVisible(false);
      return;
    }

    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    const minHeight = 36;
    const calculatedHeight = Math.max((clientHeight / scrollHeight) * clientHeight, minHeight);
    const availableSpace = clientHeight - calculatedHeight - 8; // 상하 여백 4px씩
    const calculatedTop = 4 + scrollRatio * availableSpace;

    setThumbHeight(calculatedHeight);
    setThumbTop(calculatedTop);

    setIsVisible(true);

    // 스크롤 정지 후 1.5초 뒤에 숨김
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isDragging) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }
  }, [isDragging]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    // 초기 부하 분산을 위한 지연 실행
    const initialTimer = setTimeout(updateScroll, 100);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [updateScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    scrollTrackerRef.current = {
      startY: e.clientY,
      startScrollTop: document.documentElement.scrollTop,
    };
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollTrackerRef.current) return;

      const { startY, startScrollTop } = scrollTrackerRef.current;
      const deltaY = e.clientY - startY;

      const { scrollHeight, clientHeight } = document.documentElement;
      const availableScroll = scrollHeight - clientHeight;
      const availableSpace = clientHeight - thumbHeight - 8;

      const scrollMoved = (deltaY / availableSpace) * availableScroll;
      window.scrollTo(0, startScrollTop + scrollMoved);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      scrollTrackerRef.current = null;
      document.body.style.userSelect = '';

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  return (
    <div
      className={cn(styles.wrapper, (isVisible || isDragging) && styles.visible)}
      aria-hidden="true"
    >
      <div
        className={cn(styles.thumb, isDragging && styles.dragging)}
        style={{
          height: `${thumbHeight}px`,
          transform: `translateY(${thumbTop}px)`,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

CustomScrollbar.displayName = 'CustomScrollbar';
