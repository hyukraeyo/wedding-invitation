'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { isIOS, isMobile } from '@/lib/utils';

import styles from './BirthdayEventLanding.module.scss';

const ESCAPE_EDGE_PADDING = 10;
const ESCAPE_BOTTOM_GUARD = 100;
const ESCAPE_MIN_DISTANCE = 92;
const ESCAPE_MAX_DISTANCE = 220;
const ESCAPE_POINTER_THROTTLE_MS = 180;
const ESCAPE_JITTER = 42;
const ESCAPE_MIN_DURATION_MS = 240;
const ESCAPE_MAX_DURATION_MS = 460;
const ESCAPE_ROTATION_LIMIT = 16;
const ESCAPE_SCALE_MIN = 0.94;
const ESCAPE_SCALE_VARIATION = 0.12;

interface NoButtonPosition {
  left: number;
  top: number;
}

interface EscapePointerPosition {
  clientX: number;
  clientY: number;
}

interface NoButtonMotion {
  durationMs: number;
  rotateDeg: number;
  scale: number;
}

const INITIAL_NO_BUTTON_POSITION: NoButtonPosition = {
  left: 0,
  top: 0,
};

const INITIAL_NO_BUTTON_MOTION: NoButtonMotion = {
  durationMs: ESCAPE_MIN_DURATION_MS,
  rotateDeg: 0,
  scale: 1,
};

const ESCAPE_HINTS = [
  '뭐해?',
  '누르고 싶어?',
  'Yes 눌러.',
  'No는 오늘 도망 모드야.',
  '거의 잡았는데? 아쉽다.',
  '정답 버튼은 아래쪽이야.',
  'No 버튼: 오늘도 무사히 탈출.',
  '힌트 하나 더. 노란 버튼 확인해.',
  '지금은 Yes가 정답이야.',
] as const;

const QUICK_MISSIONS = ['카페 데이트', '쇼핑 타임', '디너 코스'] as const;

function getAttemptMessage(attemptCount: number): string {
  return ESCAPE_HINTS[attemptCount % ESCAPE_HINTS.length] ?? ESCAPE_HINTS[0];
}

function randomInRange(maxValue: number): number {
  return Math.random() * maxValue;
}

function clampValue(value: number, minValue: number, maxValue: number): number {
  return Math.min(Math.max(value, minValue), maxValue);
}

export function BirthdayEventLanding() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isIphoneOnly, setIsIphoneOnly] = React.useState(false);
  const [isEventStarted, setIsEventStarted] = React.useState(false);
  const [isAccepted, setIsAccepted] = React.useState(false);
  const [attemptCount, setAttemptCount] = React.useState(0);
  const [noButtonMotion, setNoButtonMotion] =
    React.useState<NoButtonMotion>(INITIAL_NO_BUTTON_MOTION);
  const [noButtonPosition, setNoButtonPosition] = React.useState<NoButtonPosition>(
    INITIAL_NO_BUTTON_POSITION
  );

  const arenaRef = React.useRef<HTMLDivElement | null>(null);
  const noButtonWrapRef = React.useRef<HTMLDivElement | null>(null);
  const noButtonPositionRef = React.useRef<NoButtonPosition>(INITIAL_NO_BUTTON_POSITION);
  const lastEscapeAtRef = React.useRef(0);

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent ?? '';
    const isIphoneAgent = /iPhone/i.test(userAgent);

    setIsIphoneOnly(isMobile() && isIOS() && isIphoneAgent);
    setIsHydrated(true);
  }, []);

  const updateNoButtonPosition = React.useCallback((nextPosition: NoButtonPosition) => {
    noButtonPositionRef.current = nextPosition;
    setNoButtonPosition(nextPosition);
  }, []);

  const moveNoButton = React.useCallback(
    (pointerPosition?: EscapePointerPosition) => {
      const arenaElement = arenaRef.current;
      const noButtonWrapElement = noButtonWrapRef.current;

      if (!arenaElement || !noButtonWrapElement) {
        return;
      }

      const arenaRect = arenaElement.getBoundingClientRect();
      const arenaWidth = arenaElement.clientWidth;
      const arenaHeight = arenaElement.clientHeight;
      const noButtonWidth = noButtonWrapElement.offsetWidth;
      const noButtonHeight = noButtonWrapElement.offsetHeight;

      const minLeft = ESCAPE_EDGE_PADDING;
      const minTop = ESCAPE_EDGE_PADDING;
      const maxLeft = minLeft + Math.max(arenaWidth - noButtonWidth - ESCAPE_EDGE_PADDING * 2, 0);
      const maxTop =
        minTop +
        Math.max(arenaHeight - noButtonHeight - ESCAPE_EDGE_PADDING - ESCAPE_BOTTOM_GUARD, 0);

      const currentLeft = clampValue(noButtonPositionRef.current.left || minLeft, minLeft, maxLeft);
      const currentTop = clampValue(noButtonPositionRef.current.top || minTop, minTop, maxTop);
      const currentCenterX = currentLeft + noButtonWidth / 2;
      const currentCenterY = currentTop + noButtonHeight / 2;

      const localPointerX =
        pointerPosition?.clientX !== undefined
          ? clampValue(pointerPosition.clientX - arenaRect.left, 0, arenaWidth)
          : arenaWidth / 2;
      const localPointerY =
        pointerPosition?.clientY !== undefined
          ? clampValue(pointerPosition.clientY - arenaRect.top, 0, arenaHeight)
          : arenaHeight / 2;

      let directionX = currentCenterX - localPointerX;
      let directionY = currentCenterY - localPointerY;
      const directionLength = Math.hypot(directionX, directionY);

      if (directionLength < 1) {
        const randomAngle = randomInRange(Math.PI * 2);
        directionX = Math.cos(randomAngle);
        directionY = Math.sin(randomAngle);
      } else {
        directionX /= directionLength;
        directionY /= directionLength;
      }

      let bestLeft = currentLeft;
      let bestTop = currentTop;
      let bestDistance = 0;

      for (let attempt = 0; attempt < 7; attempt += 1) {
        const escapeDistance =
          ESCAPE_MIN_DISTANCE + randomInRange(ESCAPE_MAX_DISTANCE - ESCAPE_MIN_DISTANCE);
        const jitterX = (Math.random() - 0.5) * ESCAPE_JITTER;
        const jitterY = (Math.random() - 0.5) * ESCAPE_JITTER;

        const candidateLeft = clampValue(
          currentLeft + directionX * escapeDistance + jitterX,
          minLeft,
          maxLeft
        );
        const candidateTop = clampValue(
          currentTop + directionY * escapeDistance + jitterY,
          minTop,
          maxTop
        );

        const candidateDistance = Math.hypot(
          candidateLeft - currentLeft,
          candidateTop - currentTop
        );

        if (candidateDistance > bestDistance) {
          bestLeft = candidateLeft;
          bestTop = candidateTop;
          bestDistance = candidateDistance;
        }

        if (candidateDistance >= ESCAPE_MIN_DISTANCE) {
          break;
        }
      }

      if (bestDistance < ESCAPE_MIN_DISTANCE * 0.55) {
        bestLeft = clampValue(minLeft + randomInRange(maxLeft - minLeft), minLeft, maxLeft);
        bestTop = clampValue(minTop + randomInRange(maxTop - minTop), minTop, maxTop);
      }

      const travelDistance = Math.hypot(bestLeft - currentLeft, bestTop - currentTop);
      const durationMs = clampValue(
        ESCAPE_MIN_DURATION_MS + travelDistance * 0.72,
        ESCAPE_MIN_DURATION_MS,
        ESCAPE_MAX_DURATION_MS
      );
      const rotateDeg = (Math.random() - 0.5) * ESCAPE_ROTATION_LIMIT * 2;
      const scale = ESCAPE_SCALE_MIN + randomInRange(ESCAPE_SCALE_VARIATION);

      setNoButtonMotion({
        durationMs,
        rotateDeg,
        scale,
      });

      updateNoButtonPosition({
        left: bestLeft,
        top: bestTop,
      });
    },
    [updateNoButtonPosition]
  );

  React.useEffect(() => {
    if (!isIphoneOnly || isAccepted) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => moveNoButton());

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isAccepted, isIphoneOnly, moveNoButton]);

  React.useEffect(() => {
    if (!isIphoneOnly || isAccepted) {
      return;
    }

    const handleViewportChange = () => {
      window.requestAnimationFrame(() => moveNoButton());
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
    };
  }, [isAccepted, isIphoneOnly, moveNoButton]);

  const runAwayNoButton = React.useCallback(
    (pointerPosition?: EscapePointerPosition) => {
      const now = Date.now();

      if (now - lastEscapeAtRef.current < ESCAPE_POINTER_THROTTLE_MS) {
        return;
      }

      lastEscapeAtRef.current = now;
      setAttemptCount((previous) => previous + 1);
      moveNoButton(pointerPosition);
    },
    [moveNoButton]
  );

  const handleYesClick = React.useCallback(() => {
    setIsAccepted(true);
  }, []);

  const handleStartEvent = React.useCallback(() => {
    setIsEventStarted(true);
  }, []);

  const handleNoPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      runAwayNoButton({
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [runAwayNoButton]
  );

  const handleNoTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const touchPoint = event.touches[0];

      runAwayNoButton(
        touchPoint
          ? {
              clientX: touchPoint.clientX,
              clientY: touchPoint.clientY,
            }
          : undefined
      );
    },
    [runAwayNoButton]
  );

  const handleNoClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      runAwayNoButton({
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [runAwayNoButton]
  );

  const handleNoMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      runAwayNoButton({
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [runAwayNoButton]
  );

  const noButtonStyle = React.useMemo<React.CSSProperties>(
    () => ({
      transform: `translate3d(${noButtonPosition.left}px, ${noButtonPosition.top}px, 0) rotate(${noButtonMotion.rotateDeg}deg) scale(${noButtonMotion.scale})`,
      transitionDuration: `${noButtonMotion.durationMs}ms`,
    }),
    [
      noButtonMotion.durationMs,
      noButtonMotion.rotateDeg,
      noButtonMotion.scale,
      noButtonPosition.left,
      noButtonPosition.top,
    ]
  );

  if (!isHydrated) {
    return (
      <section className={styles.page}>
        <div className={styles.centerContainer}>
          <p className={styles.loadingText}>🎀 비밀 생일 파티 준비 중...</p>
        </div>
      </section>
    );
  }

  if (!isIphoneOnly) {
    return (
      <section className={styles.page}>
        <div className={styles.centerContainer}>
          <p className={styles.badgeLine}>Private Love Link</p>
          <h1 className={styles.gateTitle}>아이폰에서만 열어볼 수 있어</h1>
          <p className={styles.gateDescription}>
            가로 사이즈가 좁은 모바일 환경(iPhone)에서
            <br />
            가장 완벽한 이벤트를 보여줄게.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      {/* Background Decor */}
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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className={styles.introSection}>
              <div className={styles.introContent}>
                <div className={styles.introHeader}>
                  <span className={styles.pillBadge}>To. My Favorite Person</span>
                  <h1 className={styles.introTitle}>
                    오늘 네 건데
                    <br />
                    확인해볼래?
                  </h1>
                  <p className={styles.introDesc}>
                    생일 축하해. 제일 빛나는 하루를 선물할게.
                    <br />
                    준비한 내용을 확인해봐.
                  </p>
                </div>
              </div>

              <div className={styles.bottomAction}>
                <Button className={styles.startButton} size="lg" onClick={handleStartEvent}>
                  선물 확인하기
                </Button>
              </div>
            </article>
          </motion.div>
        ) : (
          <motion.div
            key="main-view"
            className={styles.containerFrame}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <article className={styles.mainSection}>
              <header className={styles.mainHeader}>
                <div className={styles.headerTop}>
                  <p className={styles.pillBadge}>
                    <Sparkles className={styles.badgeIcon} />
                    Happy Birthday
                  </p>
                </div>
                <h1 className={styles.mainTitle}>
                  생일 축하해
                  <span className={styles.mainSubTitle}>오늘의 주인공은 너야</span>
                </h1>

                <div className={styles.benefitRow}>
                  {QUICK_MISSIONS.map((mission) => (
                    <span key={mission} className={styles.benefitChip}>
                      {mission}
                    </span>
                  ))}
                </div>
              </header>

              <div className={styles.contentSpacer} />

              <section className={styles.questionCard}>
                <p className={styles.questionLabel}>LAST QUESTION</p>
                <h2 className={styles.questionTitle}>샤넬백 사줄까?</h2>
                <p className={styles.questionHint}>
                  {!isAccepted
                    ? getAttemptMessage(attemptCount)
                    : '탁월한 선택이야. 바로 결제하러 가자.'}
                </p>

                <div ref={arenaRef} className={styles.interactionArena}>
                  <Button className={styles.yesButton} onClick={handleYesClick} size="lg">
                    Yes, 좋아!
                  </Button>

                  {!isAccepted ? (
                    <div
                      ref={noButtonWrapRef}
                      className={styles.noButtonWrap}
                      style={noButtonStyle}
                    >
                      <Button
                        variant="secondary"
                        className={styles.noButton}
                        onPointerDown={handleNoPointerDown}
                        onTouchStart={handleNoTouchStart}
                        onMouseEnter={handleNoMouseEnter}
                        onClick={handleNoClick}
                      >
                        No
                      </Button>
                    </div>
                  ) : null}
                </div>

                {isAccepted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.successMessage}
                  >
                    <Heart className={styles.heartIcon} fill="currentColor" />
                    <span>접수 완료! 배송지 입력해줘.</span>
                  </motion.div>
                )}
              </section>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default BirthdayEventLanding;
