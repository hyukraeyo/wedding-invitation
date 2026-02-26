'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  AnimatePresence,
  type AnimatePresenceProps,
  motion,
  type MotionProps,
  type Transition,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './text-rotate.module.scss';

interface TextRotateProps
  extends Omit<MotionProps, 'initial' | 'animate' | 'exit' | 'children' | 'transition'> {
  texts: string[];
  rotationInterval?: number;
  initial?: MotionProps['initial'];
  animate?: MotionProps['animate'];
  exit?: MotionProps['exit'];
  animatePresenceMode?: AnimatePresenceProps['mode'];
  animatePresenceInitial?: boolean;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | number | 'random';
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'words' | 'characters' | 'lines' | string;
  onNext?: (index: number) => void;
  mainClassName?: string | undefined;
  splitLevelClassName?: string | undefined;
  elementLevelClassName?: string | undefined;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }

  return Array.from(text);
};

const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { type: 'spring', damping: 25, stiffness: 300 },
      initial = { y: '100%', opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: '-120%', opacity: 0 },
      animatePresenceMode = 'wait',
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = 'first',
      loop = true,
      auto = true,
      splitBy = 'characters',
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const safeTexts = useMemo(() => (texts.length > 0 ? texts : ['']), [texts]);
    const activeTextIndex =
      currentTextIndex > safeTexts.length - 1 ? 0 : Math.max(0, currentTextIndex);

    const elements = useMemo(() => {
      const currentText = safeTexts[activeTextIndex] ?? '';
      if (splitBy === 'characters') {
        const words = currentText.split(' ');
        return words.map((word, index) => ({
          characters: splitIntoCharacters(word),
          needsSpace: index !== words.length - 1,
        }));
      }

      return splitBy === 'words'
        ? currentText.split(' ')
        : splitBy === 'lines'
          ? currentText.split('\n')
          : currentText.split(splitBy);
    }, [safeTexts, activeTextIndex, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        if (totalChars <= 0) return 0;

        if (staggerFrom === 'first') return index * staggerDuration;
        if (staggerFrom === 'last') return (totalChars - 1 - index) * staggerDuration;
        if (staggerFrom === 'center') {
          const center = Math.floor(totalChars / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === 'random') {
          const randomIndex = Math.floor(Math.random() * totalChars);
          return Math.abs(randomIndex - index) * staggerDuration;
        }

        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [staggerFrom, staggerDuration]
    );

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      if (safeTexts.length <= 1) return;
      const nextIndex =
        activeTextIndex === safeTexts.length - 1
          ? (loop ? 0 : activeTextIndex)
          : activeTextIndex + 1;

      if (nextIndex !== activeTextIndex) {
        handleIndexChange(nextIndex);
      }
    }, [activeTextIndex, safeTexts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      if (safeTexts.length <= 1) return;
      const previousIndex =
        activeTextIndex === 0 ? (loop ? safeTexts.length - 1 : activeTextIndex) : activeTextIndex - 1;

      if (previousIndex !== activeTextIndex) {
        handleIndexChange(previousIndex);
      }
    }, [activeTextIndex, safeTexts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        if (safeTexts.length === 0) return;
        const validIndex = Math.max(0, Math.min(index, safeTexts.length - 1));
        if (validIndex !== activeTextIndex) {
          handleIndexChange(validIndex);
        }
      },
      [safeTexts.length, activeTextIndex, handleIndexChange]
    );

    const reset = useCallback(() => {
      if (activeTextIndex !== 0) {
        handleIndexChange(0);
      }
    }, [activeTextIndex, handleIndexChange]);

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset]
    );

    useEffect(() => {
      if (!auto || safeTexts.length <= 1) return;
      const intervalId = window.setInterval(next, rotationInterval);
      return () => window.clearInterval(intervalId);
    }, [next, rotationInterval, auto, safeTexts.length]);

    return (
      <motion.span
        className={cn(styles.main, mainClassName)}
        {...props}
        layout
        transition={transition}
      >
        <span className={styles.srOnly}>{safeTexts[activeTextIndex]}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.div
            key={activeTextIndex}
            className={cn(styles.group, splitBy === 'lines' && styles.groupLines)}
            layout
            aria-hidden="true"
          >
            {(splitBy === 'characters'
              ? (elements as WordObject[])
              : (elements as string[]).map((element, index) => ({
                  characters: [element],
                  needsSpace: index !== elements.length - 1,
                }))
            ).map((wordObject, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
              const totalChars = array.reduce((sum, word) => sum + word.characters.length, 0);

              return (
                <span key={wordIndex} className={cn(styles.word, splitLevelClassName)}>
                  {wordObject.characters.map((character, charIndex) => (
                    <motion.span
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      key={`${character}-${charIndex}`}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(previousCharsCount + charIndex, totalChars),
                      }}
                      className={cn(styles.character, elementLevelClassName)}
                    >
                      {character}
                    </motion.span>
                  ))}
                  {wordObject.needsSpace && <span className={styles.space}>{' '}</span>}
                </span>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    );
  }
);

TextRotate.displayName = 'TextRotate';

export { TextRotate };
