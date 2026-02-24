'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
// Reusing SCSS from ScrollMorphHero
import styles from '../ScrollMorphHero/ScrollMorphHero.module.scss';
import { type AnimationPhase } from '../ScrollMorphHero/ScrollMorphHero';

interface FlipCardProps {
  src: string;
  index: number;
  phase: AnimationPhase;
  target: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
    borderRadius?: string;
  };
  isFront?: boolean;
}

// --- FlipCard Component ---
const IMG_WIDTH = 60; // Base width
const IMG_HEIGHT = 85; // Base height

function FlipCard({ src, index, target, phase, isFront = false }: FlipCardProps) {
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
      <motion.div className={styles.cardInner}>
        {/* Front Face */}
        <motion.div
          className={`${styles.cardFace} ${styles.frontFace}`}
          initial={{ borderRadius: target.borderRadius || '16px' }}
          animate={{ borderRadius: target.borderRadius || '16px' }}
          transition={
            phase === 'fullscreen'
              ? { duration: 0 }
              : { type: 'spring', stiffness: 40, damping: 15 }
          }
        >
          <Image
            src={src}
            alt={`hero-${index}`}
            fill
            sizes={isFront ? '100vw' : '200px'}
            priority={isFront}
            quality={isFront ? 100 : 75}
            className={styles.cardImage}
          />
          <div className={styles.imageOverlay} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 11;
const SCALE_MOBILE = 0.75;
const SCALE_PC = 1.8;

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

  const [scatterPositions, setScatterPositions] = useState<
    { x: number; y: number; rotation: number }[]
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScatterPositions(
      IMAGES.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
      }))
    );
  }, []);

  const parallaxX = useTransform(smoothMouseX, (v) => v * 0.2);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Container */}
      <div className={styles.wrapper}>
        {/* Intro Text */}
        <div className={styles.introTextWrapper} style={{ zIndex: 20 }}>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={introPhase === 'circle' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.introSubtitle}
            style={{ pointerEvents: introPhase === 'circle' ? 'auto' : 'none', marginTop: '24px' }}
          >
            <Button radius="full" size="lg" style={{ padding: '0 32px' }} asChild>
              <Link href="/builder?mode=new">만들기</Link>
            </Button>
          </motion.div>
        </div>

        {/* Parallax Wrapper */}
        <motion.div
          style={{ x: parallaxX, width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          {/* Main Container */}
          <motion.div
            className={styles.imagesContainer}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{
              opacity: 1,
              rotate: introPhase === 'circle' ? 360 : 0,
            }}
            transition={{
              opacity: { duration: 1.2, ease: 'easeOut' },
              rotate:
                introPhase === 'circle'
                  ? { duration: 80, repeat: Infinity, ease: 'linear' }
                  : { duration: 1, ease: 'easeInOut' },
            }}
          >
            {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
              const isMobile = containerSize.width > 0 && containerSize.width < 768;

              let target: FlipCardProps['target'] = {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
                borderRadius: '16px',
              };

              // 1. Intro Phases
              if (introPhase === 'fullscreen') {
                // Only scale up the front-most image to save performance
                const isFrontCard = i === TOTAL_IMAGES - 1;
                let fillScale = 10; // safe fallback for SSR (prevents huge flicker on PC/Mobile)
                if (containerSize.width > 0 && containerSize.height > 0) {
                  const maxScale = Math.max(containerSize.width / 60, containerSize.height / 85);
                  // On PC, cap the initial size to avoid pixelation (e.g., max scale of 10 = 600x850)
                  fillScale = isMobile ? maxScale : Math.min(maxScale, 10);
                }

                target = {
                  ...target,
                  scale: isFrontCard ? fillScale : isMobile ? SCALE_MOBILE : SCALE_PC,
                  opacity: isFrontCard ? 1 : 0,
                  borderRadius: isFrontCard ? '0px' : '16px',
                };
              } else if (introPhase === 'stack') {
                // Shrink naturally to center
                const randomRot = (scatterPositions[i]?.rotation || 0) * 0.05;
                target = {
                  x: 0,
                  y: 0,
                  rotation: randomRot,
                  scale: isMobile ? SCALE_MOBILE : SCALE_PC,
                  opacity: 1,
                  borderRadius: '16px',
                };
              } else if (introPhase === 'scatter') {
                target = {
                  ...target,
                  ...scatterPositions[i],
                  scale: isMobile ? SCALE_MOBILE : SCALE_PC,
                  opacity: 1,
                  borderRadius: '16px',
                };
              } else if (introPhase === 'line') {
                const activeTotal = TOTAL_IMAGES;
                const activeIndex = i;

                const lineSpacing = isMobile ? 40 : SCALE_PC * 64; // Spaced based on scale
                const lineTotalWidth = activeTotal * lineSpacing;
                const lineX = activeIndex * lineSpacing - lineTotalWidth / 2;
                target = {
                  x: lineX,
                  y: 0,
                  rotation: 0,
                  scale: isMobile ? SCALE_MOBILE : SCALE_PC,
                  opacity: 1,
                  borderRadius: '16px',
                };
              } else {
                // 2. Circle Phase (Static, no Scroll morph)

                // Responsive Calculations
                const minDimension = Math.min(containerSize.width, containerSize.height);

                // Calculate Circle Position
                const circleRadius = isMobile
                  ? Math.min(minDimension * 0.45, 180)
                  : Math.min(minDimension * 0.35, SCALE_PC * 170); // Wider circle for larger PC cards

                const activeTotal = TOTAL_IMAGES;
                const activeIndex = i;

                const circleAngle = (activeIndex / activeTotal) * 360;
                const circleRad = (circleAngle * Math.PI) / 180;

                target = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                  scale: isMobile ? SCALE_MOBILE : SCALE_PC,
                  opacity: 1,
                  borderRadius: '16px',
                };
              }

              return (
                <FlipCard
                  key={i}
                  src={src}
                  index={i}
                  phase={introPhase} // Pass intro phase for initial animations
                  target={target}
                  isFront={i === TOTAL_IMAGES - 1}
                />
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Ensure proper displayName for the component
StaticMorphHero.displayName = 'StaticMorphHero';
