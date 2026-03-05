'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './hero-3.module.scss';

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  ctaHref?: string;
  className?: string;
}

interface ActionButtonProps {
  children: ReactNode;
  href?: string | undefined;
}

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

function ActionButton({ children, href }: ActionButtonProps) {
  if (href) {
    return (
      <Link href={href} className={styles.actionButton}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.actionButton}>
      {children}
    </button>
  );
}

export function AnimatedMarqueeHero({
  tagline,
  title,
  description,
  ctaText,
  images,
  ctaHref,
  className,
}: AnimatedMarqueeHeroProps) {
  const duplicatedImages = [...images, ...images];

  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.content}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className={styles.tagline}
        >
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className={styles.title}
        >
          {typeof title === 'string'
            ? title.split(' ').map((word, index) => (
                <motion.span key={`${word}-${index}`} variants={FADE_IN_ANIMATION_VARIANTS} className={styles.word}>
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.5 }}
          className={styles.description}
        >
          {description}
        </motion.p>

        <motion.div
          className={styles.ctaWrap}
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ActionButton href={ctaHref}>{ctaText}</ActionButton>
        </motion.div>
      </div>

      <div className={styles.marquee}>
        <motion.div
          className={styles.marqueeTrack}
          animate={{
            x: ['0%', '-50%'],
            transition: {
              ease: 'linear',
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={cn(styles.imageCard, index % 2 === 0 ? styles.tiltLeft : styles.tiltRight)}
            >
              <Image
                src={src}
                alt={`Showcase image ${index + 1}`}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 144px, 216px"
                priority={index < 6}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
