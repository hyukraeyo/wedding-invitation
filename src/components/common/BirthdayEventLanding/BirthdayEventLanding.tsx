'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { isIOS, isMobile } from '@/lib/utils';

import styles from './BirthdayEventLanding.module.scss';

interface StoryStep {
  id: string;
  chapter: string;
  title: string;
  salutation: string;
  paragraphOne: string;
  paragraphTwo: string;
  postscript: string;
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
    id: 'letter-one',
    chapter: 'LETTER 01',
    title: '가장 먼저, 너에게 고마워.',
    salutation: '사랑하는 내 여자친구에게,',
    paragraphOne:
      '처음 널 만난 이후로 내 평범한 하루는 작은 기념일처럼 바뀌었어. 별일 없는 날에도 네 이름을 떠올리면 이상하게 마음이 환해졌어.',
    paragraphTwo:
      '누군가를 좋아한다는 말이 이렇게 따뜻한 일이구나, 네가 알려줬어. 그래서 오늘은 생일 축하보다 먼저, 내 진심부터 천천히 전하고 싶어.',
    postscript: '다음 장에서는 내가 왜 너를 더 존중하게 됐는지 말해줄게.',
  },
  {
    id: 'letter-two',
    chapter: 'LETTER 02',
    title: '너는 내 하루의 온도야.',
    salutation: '그리고 말이야,',
    paragraphOne:
      '지치고 예민했던 날에도 네 목소리 한 번이면 마음이 부드러워졌어. 괜찮다고 건네는 네 짧은 한마디가 생각보다 오래 나를 버티게 했어.',
    paragraphTwo:
      '나를 다그치지 않고 기다려주는 사람을 만난 건 큰 행운이더라. 네 옆에서는 나도 누군가에게 다정한 사람이 되고 싶어져.',
    postscript: '다음 장은 네가 모를 수도 있는 내 속마음이야.',
  },
  {
    id: 'letter-three',
    chapter: 'LETTER 03',
    title: '너를 보며 사랑을 배워.',
    salutation: '조심스럽게 고백하자면,',
    paragraphOne:
      '나는 완벽한 사람이 아니고, 아직도 서툰 순간이 많아. 그런데 너는 내 부족한 모습을 탓하기보다 함께 웃어주고, 천천히 맞춰가자고 말해줬어.',
    paragraphTwo:
      '그 다정함 덕분에 나는 관계가 이기는 게 아니라 지켜주는 거라는 걸 알게 됐어. 네가 내 곁에 있다는 사실이 요즘의 나를 더 단단하게 만들어.',
    postscript: '다음 장에서 오늘 이후의 약속을 전할게.',
  },
  {
    id: 'letter-four',
    chapter: 'LETTER 04',
    title: '앞으로의 날들을 약속해.',
    salutation: '이제는 확신해,',
    paragraphOne:
      '좋은 날에는 더 크게 웃게 해주고, 힘든 날에는 조용히 기대어도 되는 사람이 되고 싶어. 네 앞에서는 멋있는 척보다 진짜 마음으로 오래 남고 싶어.',
    paragraphTwo:
      '오늘의 설렘이 지나도, 계절이 바뀌어도, 우리는 더 좋은 팀이 될 거라고 믿어. 네 손을 잡은 채로 같은 방향을 보는 삶을 꿈꾸고 있어.',
    postscript: '마지막 장에는 내가 준비한 진짜 고백이 기다리고 있어.',
  },
  {
    id: 'letter-five',
    chapter: 'LETTER 05',
    title: '생일을 빌려 전하는 한 문장.',
    salutation: '마지막으로,',
    paragraphOne:
      '네 생일은 단순히 축하하는 날을 넘어, 내가 너를 얼마나 소중히 생각하는지 다시 확인하는 날이야. 오늘도 나는 네 덕분에 더 좋은 내일을 상상해.',
    paragraphTwo:
      '지금까지의 모든 문장은 사실 한 문장으로 이어져 있었어. 다음 버튼을 누르면 그 문장을 가장 크게, 가장 환하게 보여줄게.',
    postscript: '준비됐으면 마지막 장을 열어줘.',
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
          <p className={styles.loadingText}>💌 편지를 정성껏 펼치는 중...</p>
        </div>
      </section>
    );
  }

  if (!isIphoneOnly) {
    return (
      <section className={styles.page}>
        <div className={styles.centerContainer}>
          <p className={styles.badgeLine}>Private Love Letter</p>
          <h1 className={styles.gateTitle}>아이폰에서 가장 선명하게 전할게</h1>
          <p className={styles.gateDescription}>
            세로 iPhone 화면에서
            <br />
            스크롤 없는 편지 연출이 가장 예쁘게 보이도록 만들었어.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.bgDecorTop} aria-hidden="true" />
      <div className={styles.bgDecorBottom} aria-hidden="true" />
      <div className={styles.grainLayer} aria-hidden="true" />

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
                    For My Lovely Girl
                  </span>
                  <h1 className={styles.introTitle}>
                    오늘은 선물 대신
                    <br />
                    마음을 길게 적어봤어
                  </h1>
                  <p className={styles.introDesc}>
                    각 페이지는 스크롤 없이 한 번에 읽히도록 만들었어.
                    <br />
                    다음 버튼으로 내 편지를 한 장씩 넘겨줘.
                  </p>
                </div>
              </div>

              <div className={styles.bottomAction}>
                <Button className={styles.startButton} size="lg" onClick={handleStartEvent}>
                  편지 펼치기
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
                  <span className={styles.progressLabel}>편지 진행도</span>
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

              <div className={styles.letterViewport}>
                <AnimatePresence mode="wait" initial={false}>
                  {!isFinale ? (
                    <motion.section
                      key={currentStep.id}
                      className={styles.letterShell}
                      initial={{ opacity: 0, y: 24, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18, scale: 0.985 }}
                      transition={{ duration: 0.48, ease: IOS_EASE }}
                    >
                      <div className={styles.letterHalo} aria-hidden="true" />
                      <div className={styles.letterPaper}>
                        <p className={styles.chapterBadge}>{currentStep.chapter}</p>
                        <p className={styles.letterSalutation}>{currentStep.salutation}</p>
                        <h2 className={styles.letterTitle}>{currentStep.title}</h2>
                        <div className={styles.letterBodyGroup}>
                          <p className={styles.letterParagraph}>{currentStep.paragraphOne}</p>
                          <p className={styles.letterParagraph}>{currentStep.paragraphTwo}</p>
                        </div>
                        <p className={styles.letterPostscript}>{currentStep.postscript}</p>
                      </div>
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
                        animate={{ opacity: 0, scale: 1.3 }}
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
                              scale: [0.35, 1, 0.78],
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
                      <p className={styles.chapterBadge}>FINAL LETTER</p>
                      <h2 className={styles.finaleTitle}>내가 오래 사랑하고 싶은 사람은 너야.</h2>
                      <p className={styles.finaleBody}>
                        생일 축하해, 내 사랑.
                        <br />
                        네가 내 삶에 들어온 이후로 평범한 날도 반짝였고,
                        <br />
                        나는 매일 네가 있는 쪽으로 마음이 걸어가.
                      </p>
                      <p className={styles.finaleSub}>
                        오늘의 고백을 시작으로, 내일도 네 편에서 오래 웃게 해줄게.
                      </p>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.actionRow}>
                {!isFinale ? (
                  <Button className={styles.nextButton} size="lg" onClick={handleNextStep}>
                    {activeStep === STORY_STEP_COUNT - 1 ? '마지막 편지 열기' : '다음 편지 읽기'}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className={styles.restartButton}
                    size="lg"
                    onClick={handleRestart}
                  >
                    처음부터 다시 읽기
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
