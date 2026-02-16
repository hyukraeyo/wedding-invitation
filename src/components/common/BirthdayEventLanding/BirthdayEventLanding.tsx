'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { isIOS, isMobile } from '@/lib/utils';

import styles from './BirthdayEventLanding.module.scss';

interface StoryStep {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  closing: string;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  rotate: number;
}

type NonEmptyArray<T> = readonly [T, ...T[]];

const IOS_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STORY_STEPS: NonEmptyArray<StoryStep> = [
  {
    id: 'first-look',
    eyebrow: '첫 번째 장면',
    title: '처음 널 만난 날부터',
    description: '평범하던 하루가 네 웃음 하나로 특별해졌어.',
    closing: '네가 있다는 사실만으로도 나는 더 좋은 사람이 돼.',
  },
  {
    id: 'daily-light',
    eyebrow: '두 번째 장면',
    title: '네가 내 하루를 바꿔',
    description: '지친 날에도 네 목소리 들으면 다시 웃게 돼.',
    closing: '내가 가장 편안한 곳은 결국 네 곁이야.',
  },
  {
    id: 'gratitude',
    eyebrow: '세 번째 장면',
    title: '고마운 마음을 꼭 말할게',
    description: '내 서툰 순간까지 품어줘서 진심으로 고마워.',
    closing: '너의 다정함 덕분에 나는 사랑을 제대로 배우는 중이야.',
  },
  {
    id: 'promise',
    eyebrow: '네 번째 장면',
    title: '앞으로의 시간도',
    description: '오늘처럼 따뜻한 장면을 더 많이 만들고 싶어.',
    closing: '좋은 날도, 힘든 날도 네 손 놓지 않을게.',
  },
  {
    id: 'before-finale',
    eyebrow: '다섯 번째 장면',
    title: '그래서 오늘은',
    description: '네 생일을 핑계로, 내 진심을 천천히 전하고 싶었어.',
    closing: '다음 버튼을 누르면 내가 준비한 마지막 고백이 나와.',
  },
];

const STORY_STEP_COUNT = STORY_STEPS.length;

const BURST_PARTICLES = [
  { id: 1, x: 0, y: -120, delay: 0.03, duration: 0.8, rotate: -10 },
  { id: 2, x: 88, y: -88, delay: 0.08, duration: 0.82, rotate: 20 },
  { id: 3, x: 120, y: 0, delay: 0.13, duration: 0.86, rotate: 30 },
  { id: 4, x: 88, y: 88, delay: 0.18, duration: 0.9, rotate: 50 },
  { id: 5, x: 0, y: 124, delay: 0.22, duration: 0.86, rotate: 70 },
  { id: 6, x: -88, y: 88, delay: 0.26, duration: 0.88, rotate: 100 },
  { id: 7, x: -120, y: 0, delay: 0.3, duration: 0.82, rotate: 126 },
  { id: 8, x: -88, y: -88, delay: 0.34, duration: 0.9, rotate: 150 },
  { id: 9, x: 56, y: -132, delay: 0.38, duration: 0.84, rotate: 170 },
  { id: 10, x: 132, y: -48, delay: 0.42, duration: 0.9, rotate: 190 },
  { id: 11, x: 132, y: 48, delay: 0.46, duration: 0.84, rotate: 220 },
  { id: 12, x: 56, y: 132, delay: 0.5, duration: 0.88, rotate: 240 },
] as const satisfies readonly BurstParticle[];

function getProgressLabel(activeStep: number): string {
  if (activeStep >= STORY_STEP_COUNT) {
    return 'FINAL';
  }

  return `${activeStep + 1}/${STORY_STEP_COUNT}`;
}

export function BirthdayEventLanding() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isIphoneOnly, setIsIphoneOnly] = React.useState(false);
  const [isEventStarted, setIsEventStarted] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const isFinale = activeStep >= STORY_STEP_COUNT;
  const currentStep = STORY_STEPS[Math.min(activeStep, STORY_STEP_COUNT - 1)]!;

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent ?? '';
    const isIphoneAgent = /iPhone/i.test(userAgent);

    setIsIphoneOnly(isMobile() && isIOS() && isIphoneAgent);
    setIsHydrated(true);
  }, []);

  const handleStartEvent = React.useCallback(() => {
    setIsEventStarted(true);
    setActiveStep(0);
  }, []);

  const handleNextStep = React.useCallback(() => {
    setActiveStep((previous) => Math.min(previous + 1, STORY_STEP_COUNT));
  }, []);

  const handleRestart = React.useCallback(() => {
    setActiveStep(0);
  }, []);

  if (!isHydrated) {
    return (
      <section className={styles.page}>
        <div className={styles.centerContainer}>
          <p className={styles.loadingText}>🎀 우리 이야기 준비 중...</p>
        </div>
      </section>
    );
  }

  if (!isIphoneOnly) {
    return (
      <section className={styles.page}>
        <div className={styles.centerContainer}>
          <p className={styles.badgeLine}>Private Love Story</p>
          <h1 className={styles.gateTitle}>아이폰에서 가장 예쁘게 보여줄게</h1>
          <p className={styles.gateDescription}>
            세로 모바일 화면(iPhone)에서
            <br />
            감동 연출이 가장 완벽하게 실행돼.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.bgDecorTop} aria-hidden="true" />
      <div className={styles.bgDecorBottom} aria-hidden="true" />

      <AnimatePresence mode="wait">
        {!isEventStarted ? (
          <motion.div
            key="intro-view"
            className={styles.containerFrame}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: IOS_EASE }}
          >
            <article className={styles.introSection}>
              <div className={styles.introContent}>
                <div className={styles.introHeader}>
                  <span className={styles.pillBadge}>
                    <Sparkles className={styles.badgeIcon} />
                    To. My Girlfriend
                  </span>
                  <h1 className={styles.introTitle}>
                    오늘은 너를 위해
                    <br />
                    마음을 준비했어
                  </h1>
                  <p className={styles.introDesc}>
                    다음 버튼을 누를 때마다
                    <br />
                    내가 너에게 하고 싶던 말을 들려줄게.
                  </p>
                </div>
              </div>

              <div className={styles.bottomAction}>
                <Button className={styles.startButton} size="lg" onClick={handleStartEvent}>
                  이야기 시작하기
                </Button>
              </div>
            </article>
          </motion.div>
        ) : (
          <motion.div
            key="story-view"
            className={styles.containerFrame}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: IOS_EASE }}
          >
            <article className={styles.mainSection}>
              <header className={styles.mainHeader}>
                <p className={styles.pillBadge}>
                  <Sparkles className={styles.badgeIcon} />
                  Love Letter Sequence
                </p>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>우리 이야기</span>
                  <span className={styles.progressValue}>{getProgressLabel(activeStep)}</span>
                </div>
                <div className={styles.progressDots} aria-hidden="true">
                  {STORY_STEPS.map((step, index) => (
                    <span
                      key={step.id}
                      className={index <= activeStep ? styles.progressDotActive : styles.progressDot}
                    />
                  ))}
                </div>
              </header>

              <div className={styles.storyStage}>
                <AnimatePresence mode="wait" initial={false}>
                  {!isFinale ? (
                    <motion.section
                      key={currentStep.id}
                      className={styles.storyCard}
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: IOS_EASE }}
                    >
                      <p className={styles.storyEyebrow}>{currentStep.eyebrow}</p>
                      <h2 className={styles.storyTitle}>{currentStep.title}</h2>
                      <p className={styles.storyBody}>{currentStep.description}</p>
                      <p className={styles.storyFootnote}>{currentStep.closing}</p>
                    </motion.section>
                  ) : (
                    <motion.section
                      key="finale"
                      className={styles.finaleCard}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.58, ease: IOS_EASE }}
                    >
                      <motion.div
                        className={styles.finalePulse}
                        initial={{ opacity: 0.45, scale: 0.3 }}
                        animate={{ opacity: 0, scale: 1.28 }}
                        transition={{ duration: 0.72, ease: IOS_EASE }}
                        aria-hidden="true"
                      />
                      <div className={styles.finaleBurst} aria-hidden="true">
                        {BURST_PARTICLES.map((particle) => (
                          <motion.span
                            key={particle.id}
                            className={styles.burstParticle}
                            initial={{ opacity: 0, x: 0, y: 0, scale: 0.35, rotate: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              x: particle.x,
                              y: particle.y,
                              scale: [0.35, 1, 0.8],
                              rotate: particle.rotate,
                            }}
                            transition={{
                              duration: particle.duration,
                              delay: particle.delay,
                              ease: IOS_EASE,
                            }}
                          />
                        ))}
                      </div>

                      <div className={styles.finaleIconWrap}>
                        <Heart className={styles.finaleIcon} fill="currentColor" />
                      </div>
                      <p className={styles.storyEyebrow}>마지막 고백</p>
                      <h2 className={styles.finaleTitle}>내 인생 최고의 선물은 너야.</h2>
                      <p className={styles.finaleBody}>
                        네가 웃으면 세상이 부드러워지고,
                        <br />
                        네가 내 옆에 있으면 모든 내일이 기대돼.
                      </p>
                      <p className={styles.finaleSub}>사랑해. 오늘도, 내일도, 오래오래.</p>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.actionRow}>
                {!isFinale ? (
                  <Button className={styles.nextButton} size="lg" onClick={handleNextStep}>
                    {activeStep === STORY_STEP_COUNT - 1 ? '마지막 고백 보기' : '다음'}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className={styles.restartButton}
                    size="lg"
                    onClick={handleRestart}
                  >
                    처음부터 다시 보기
                  </Button>
                )}
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default BirthdayEventLanding;
