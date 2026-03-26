'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'motion/react';
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
        <div
          className={cn(styles.tagline, styles.animateIn, styles['delay-1'])}
        >
          {tagline}
        </div>

        <h1
          className={cn(
            styles.title,
            typeof title !== 'string' && styles.animateIn,
            typeof title !== 'string' && styles['delay-2']
          )}
        >
          {typeof title === 'string'
            ? title.split(' ').map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={cn(styles.word, styles.animateIn)}
                  style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                >
                  {word}&nbsp;
                </span>
              ))
            : title}
        </h1>

        <p
          className={cn(styles.description, styles.animateIn, styles['delay-3'])}
        >
          {description}
        </p>

        <motion.div
          className={cn(styles.ctaWrap, styles.animateIn, styles['delay-4'])}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ActionButton href={ctaHref}>{ctaText}</ActionButton>
        </motion.div>
      </div>

      <div className={cn(styles.marquee, styles.animateIn, styles['delay-5'])}>
        <div className={styles.marqueeTrack}>
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
        </div>
      </div>
    </section>
  );
}
