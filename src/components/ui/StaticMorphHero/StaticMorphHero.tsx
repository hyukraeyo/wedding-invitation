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
const TOTAL_IMAGES = 20;

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

export function StaticMorphHero() {
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
            The future is built on AI.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={introPhase === 'circle' ? { opacity: 0.5 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.introSubtitle}
          >
            EXPLORE THE VISION
          </motion.p>
        </div>

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
