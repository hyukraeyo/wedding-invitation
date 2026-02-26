'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import styles from './ScrollMorphHero.module.scss';

// --- Types ---
export type AnimationPhase =
  | 'fullscreen'
  | 'stack'
  | 'scatter'
  | 'line'
  | 'circle'
  | 'bottom-strip';

interface FlipCardProps {
  src: string;
  index: number;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 80; // Increased base width
const IMG_HEIGHT = 115; // Increased base height

function FlipCard({ src, index, target }: FlipCardProps) {
  return (
    <motion.div
      // Smoothly animate to the coordinates defined by the parent
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: 'spring',
        stiffness: 40,
        damping: 15,
      }}
      // Initial style
      style={{
        position: 'absolute',
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: 'preserve-3d', // Essential for the 3D hover effect
        perspective: '1000px',
      }}
      className={styles.flipCard}
    >
      <motion.div
        className={styles.cardInner}
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className={`${styles.cardFace} ${styles.frontFace}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={src}
            alt={`hero-${index}`}
            fill
            sizes="(max-width: 768px) 60px, 80px"
            className={styles.cardImage}
          />
          <div className={styles.imageOverlay} />
        </div>

        {/* Back Face */}
        <div
          className={`${styles.cardFace} ${styles.backFace}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={styles.backTextCenter}>
            <p className={styles.backTitle}>View</p>
            <p className={styles.backSubtitle}>Details</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000; // Virtual scroll range

// Unsplash Images
const IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80',
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80',
  'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80',
  'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=80',
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80',
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80',
  'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80',
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const getDeterministicRandom = (index: number, seed: number) => {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
};
const scatterPositions = IMAGES.map((_, index) => ({
  x: (getDeterministicRandom(index, 1) - 0.5) * 1500,
  y: (getDeterministicRandom(index, 2) - 0.5) * 1000,
  rotation: (getDeterministicRandom(index, 3) - 0.5) * 180,
  scale: 0.6,
  opacity: 0,
}));

export function ScrollMorphHero() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>('scatter');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    // Initial set
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  // --- Virtual Scroll Logic ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0); // Keep track of scroll value without re-renders

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent default to stop browser overscroll/bounce
      e.preventDefault();

      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    // Touch support
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    // Attach listeners to container instead of window for portability
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [virtualScroll]);

  // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
  // Happens between scroll 0 and 600
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  // 2. Scroll Rotation (Shuffling): Starts after morph (e.g., > 600)
  // Rotates the bottom arc as user continues scrolling
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // --- Mouse Parallax ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      // Normalize -1 to 1
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      // Move +/- 100px
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence ---
  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase('line'), 500);
    const timer2 = setTimeout(() => setIntroPhase('circle'), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // --- Render Loop (Manual Calculation for Morph) ---
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on('change', setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on('change', setRotateValue);
    const unsubscribeParallax = smoothMouseX.on('change', setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  // --- Content Opacity ---
  // Fade in content when arc is formed (morphValue > 0.8)
  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Container */}
      <div className={styles.wrapper}>
        {/* Intro Text (Fades out) */}
        <div className={styles.introTextWrapper}>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={
              introPhase === 'circle' && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, filter: 'blur(10px)' }
            }
            transition={{ duration: 1 }}
            className={styles.introTitle}
          >
            The future is built on AI.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === 'circle' && morphValue < 0.5
                ? { opacity: 0.5 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.introSubtitle}
          >
            SCROLL TO EXPLORE
          </motion.p>
        </div>

        {/* Arc Active Content (Fades in) */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className={styles.activeContent}
        >
          <h2 className={styles.activeTitle}>Explore Our Vision</h2>
          <p className={styles.activeText}>
            Discover a world where technology meets creativity. <br className={styles.brDesktop} />
            Scroll through our curated collection of innovations designed to shape the future.
          </p>
        </motion.div>

        {/* Main Container */}
        <div className={styles.imagesContainer}>
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            const isMobile = containerSize.width > 0 && containerSize.width < 768;

            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            // 1. Intro Phases (Scatter -> Line)
            if (introPhase === 'scatter') {
              target = scatterPositions[i] || target;
            } else if (introPhase === 'line') {
              const activeTotal = TOTAL_IMAGES;
              const activeIndex = i;

              const lineSpacing = isMobile ? 40 : 70; // Adjusted for smaller images
              const lineTotalWidth = activeTotal * lineSpacing;
              const lineX = activeIndex * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: isMobile ? 0.65 : 1, opacity: 1 };
            } else {
              // 2. Circle Phase & Morph Logic

              // Responsive Calculations
              const minDimension = Math.min(containerSize.width, containerSize.height);

              // A. Calculate Circle Position
              const circleRadius = isMobile
                ? Math.min(minDimension * 0.45, 180)
                : Math.min(minDimension * 0.35, 350);

              const activeTotal = TOTAL_IMAGES;
              const activeIndex = i;

              const circleAngle = (activeIndex / activeTotal) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
                scale: isMobile ? 0.65 : 1.2,
              };

              // B. Calculate Bottom Arc Position
              // "Rainbow" Arch: Convex up. Center is highest point.

              // Radius:
              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

              // Position:
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;

              // Spread angle:
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (activeTotal - 1);

              // Apply Scroll Rotation (Shuffle) with Bounds
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8; // Don't go all the way, keep last item visible
              const boundedRotation = -scrollProgress * maxRotation;

              const currentArcAngle = startAngle + activeIndex * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 0.8 : 1.8, // Increased scale for active state
              };

              // C. Interpolate (Morph)
              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(circlePos.scale, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return <FlipCard key={i} src={src} index={i} target={target} />;
          })}
        </div>
      </div>
    </div>
  );
}

// Ensure proper displayName for the component
ScrollMorphHero.displayName = 'ScrollMorphHero';
