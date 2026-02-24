'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
// Reusing SCSS from ScrollMorphHero
import styles from '../ScrollMorphHero/ScrollMorphHero.module.scss';
import { type AnimationPhase } from '../ScrollMorphHero/ScrollMorphHero';

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 60; // Base width
const IMG_HEIGHT = 85; // Base height

function FlipCard({ src, index, target, phase }: FlipCardProps) {
  return (
    <motion.div
      // Set initial values so it doesn't animate from { scale: 1 } on initial mount
      initial={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      // Smoothly animate to the coordinates defined by the parent
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={
        phase === 'fullscreen' ? { duration: 0 } : { type: 'spring', stiffness: 40, damping: 15 }
      }
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
          <img src={src} alt={`hero-${index}`} className={styles.cardImage} />
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
const TOTAL_IMAGES = 11;

// Unsplash Images (Replaced with local images for test-2)
const IMAGES = [
  '/images/test-2/image-01.png',
  '/images/test-2/image-02.png',
  '/images/test-2/image-03.png',
  '/images/test-2/image-04.jpg',
  '/images/test-2/image-05.jpg',
  '/images/test-2/image-06.jpg',
  '/images/test-2/image-07.jpg',
  '/images/test-2/image-08.jpg',
  '/images/test-2/image-09.jpg',
  '/images/test-2/image-10.png',
  '/images/test-2/image-11.png',
];

export function StaticMorphHero() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>('fullscreen');
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
    // 1. Start as fullscreen, hold briefly, then shrink to stack
    const timer1 = setTimeout(() => setIntroPhase('stack'), 1000);
    // 2. Explode outwards
    const timer2 = setTimeout(() => setIntroPhase('scatter'), 1800);
    // 3. Form a line
    const timer3 = setTimeout(() => setIntroPhase('line'), 2800);
    // 4. Form a circle
    const timer4 = setTimeout(() => setIntroPhase('circle'), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // --- Random Scatter Positions ---
  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeParallax = smoothMouseX.on('change', setParallaxValue);
    return () => {
      unsubscribeParallax();
    };
  }, [smoothMouseX]);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Container */}
      <div className={styles.wrapper}>
        {/* Intro Text */}
        <div className={styles.introTextWrapper}>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={
              introPhase === 'circle'
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, filter: 'blur(10px)' }
            }
            transition={{ duration: 1 }}
            className={styles.introTitle}
          >
            3분 완성 모바일 청첩장
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={introPhase === 'circle' ? { opacity: 0.5 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.introSubtitle}
          >
            바나나웨딩과 함께 시작하세요
          </motion.p>
        </div>

        {/* Main Container */}
        <div className={styles.imagesContainer}>
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            const isMobile = containerSize.width > 0 && containerSize.width < 768;

            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            // 1. Intro Phases
            if (introPhase === 'fullscreen') {
              // Only scale up the front-most image to save performance
              const isFrontCard = i === TOTAL_IMAGES - 1;
              let fillScale = 20; // safe fallback for SSR
              if (containerSize.width > 0 && containerSize.height > 0) {
                fillScale = Math.max(containerSize.width / 60, containerSize.height / 85);
              }

              target = {
                x: 0,
                y: 0,
                rotation: 0,
                scale: isFrontCard ? fillScale : isMobile ? 0.65 : 1.2,
                opacity: isFrontCard ? 1 : 0,
              };
            } else if (introPhase === 'stack') {
              // Shrink naturally to center
              const randomRot = (scatterPositions[i]?.rotation || 0) * 0.05;
              target = {
                x: 0,
                y: 0,
                rotation: randomRot,
                scale: isMobile ? 0.65 : 1.2,
                opacity: 1,
              };
            } else if (introPhase === 'scatter') {
              target = scatterPositions[i] || target;
            } else if (introPhase === 'line') {
              const activeTotal = TOTAL_IMAGES;
              const activeIndex = i;

              const lineSpacing = isMobile ? 40 : 70; // Tightened for 20 small images
              const lineTotalWidth = activeTotal * lineSpacing;
              const lineX = activeIndex * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: isMobile ? 0.65 : 1, opacity: 1 };
            } else {
              // 2. Circle Phase (Static, no Scroll morph)

              // Responsive Calculations
              const minDimension = Math.min(containerSize.width, containerSize.height);

              // Calculate Circle Position
              const circleRadius = isMobile
                ? Math.min(minDimension * 0.45, 180)
                : Math.min(minDimension * 0.35, 350);

              const activeTotal = TOTAL_IMAGES;
              const activeIndex = i;

              const circleAngle = (activeIndex / activeTotal) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;

              target = {
                x: Math.cos(circleRad) * circleRadius + parallaxValue * 0.2,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
                scale: isMobile ? 0.65 : 1.2, // Drastically reduced for 20 cards on mobile
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase} // Pass intro phase for initial animations
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Ensure proper displayName for the component
StaticMorphHero.displayName = 'StaticMorphHero';
