'use client';

import { LayoutGroup, motion } from 'framer-motion';
import { TextRotate } from '@/components/ui/text-rotate';
import styles from './HomeTextRotateHero.module.scss';

const HERO_PREFIX = 'Make your invite';
const ROTATE_TEXTS = [
  'beautiful',
  'personal',
  'shareable',
  'timeless',
  'effortless',
  'unforgettable',
];

export function HomeTextRotateHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.backgroundLayer} aria-hidden="true" />

      <div className={styles.content}>
        <LayoutGroup>
          <motion.p
            className={styles.rotateLine}
            layout
            aria-label="Create your mobile wedding invitation"
          >
            <motion.span
              className={styles.rotatePrefix}
              layout
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            >
              {HERO_PREFIX}{' '}
            </motion.span>
            <TextRotate
              texts={ROTATE_TEXTS}
              mainClassName={styles.rotateMain}
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitLevelClassName={styles.rotateSplitLevel}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </motion.p>
        </LayoutGroup>
      </div>
    </div>
  );
}
