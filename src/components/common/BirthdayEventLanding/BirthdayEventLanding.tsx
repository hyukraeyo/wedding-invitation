'use client';

import * as React from 'react';
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

const QUICK_MISSIONS = ['🍰 케이크 한 입', '📸 사진 10컷', '🌠 소원 3개'] as const;

function getAttemptMessage(attemptCount: number): string {
  if (attemptCount === 0) {
    return '🙈 No 버튼은 오늘 체험형 장치라서 안 잡혀 :)';
  }

  if (attemptCount < 3) {
    return '💨 No가 또 도망갔어. 거의 다 왔어.';
  }

  if (attemptCount < 6) {
    return '💛 정답은 이미 중앙에 크게 있어.';
  }

  return '✨ 이제 Yes만 누르면 오늘 이벤트 클리어.';
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
  const [isAccepted, setIsAccepted] = React.useState(false);
  const [attemptCount, setAttemptCount] = React.useState(0);
  const [noButtonMotion, setNoButtonMotion] = React.useState<NoButtonMotion>(
    INITIAL_NO_BUTTON_MOTION
  );
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

        const candidateDistance = Math.hypot(candidateLeft - currentLeft, candidateTop - currentTop);

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

  const handleNoMouseEnter = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    runAwayNoButton({
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }, [runAwayNoButton]);

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
        <div className={styles.baseGate}>
          <p className={styles.loadingText}>🎀 비밀 생일 파티 준비 중...</p>
        </div>
      </section>
    );
  }

  if (!isIphoneOnly) {
    return (
      <section className={styles.page}>
        <div className={styles.baseGate}>
          <p className={styles.badgeLine}>💌 Private Birthday Link</p>
          <h1 className={styles.gateTitle}>이 페이지는 아이폰 세로 화면 전용이에요.</h1>
          <p className={styles.gateDescription}>
            사파리에서 이 링크를 아이폰으로 열면 깜짝 이벤트가 시작됩니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <span className={`${styles.orb} ${styles.orbTop}`} aria-hidden="true" />
      <span className={`${styles.orb} ${styles.orbBottom}`} aria-hidden="true" />

      <div className={styles.mobileFrame}>
        <article className={styles.eventCard}>
          <header className={styles.hero}>
            <p className={styles.badgeLine}>
              <Sparkles className={styles.badgeIcon} />✨ Happy Birthday, My Love ✨
            </p>
            <h1 className={styles.heroTitle}>
              생일 축하해 🎂
              <span className={styles.heroSubTitle}>오늘의 주인공은 너야 💖</span>
            </h1>
            <p className={styles.heroDescription}>
              오늘 하루는 쟈기가 하고 싶은 것만 하자. 케이크도, 사진도, 소원도 전부 쟈기 마음대로 🫶
            </p>

            <ul className={styles.missionList}>
              {QUICK_MISSIONS.map((mission) => (
                <li key={mission} className={styles.missionItem}>
                  {mission}
                </li>
              ))}
            </ul>
          </header>

          <section className={styles.proposal}>
            <p className={styles.proposalLabel}>💘 그리고 오늘의 진짜 질문</p>
            <h2 className={styles.proposalTitle}>나랑 결혼해줘~~ 💍</h2>
            <p className={styles.attemptHint}>
              {!isAccepted
                ? getAttemptMessage(attemptCount)
                : '🥹 고마워. 오늘은 평생 기억할 내 최고의 생일이야.'}
            </p>
          </section>

          <div ref={arenaRef} className={styles.choiceArena}>
            <Button className={styles.yesButton} onClick={handleYesClick} size="lg">
              Yes 💛
            </Button>

            {!isAccepted ? (
              <div ref={noButtonWrapRef} className={styles.noButtonWrap} style={noButtonStyle}>
                <Button
                  variant="secondary"
                  className={styles.noButton}
                  onPointerDown={handleNoPointerDown}
                  onTouchStart={handleNoTouchStart}
                  onMouseEnter={handleNoMouseEnter}
                  onClick={handleNoClick}
                >
                  No 🙈
                </Button>
              </div>
            ) : null}
          </div>

          {!isAccepted ? (
            <p className={styles.footNote}>🫶 힌트: No를 잡으려 하지 말고 마음을 따라가.</p>
          ) : (
            <p className={styles.acceptedMessage}>
              <Heart className={styles.acceptedIcon} />
              오래오래 같이 행복하자. 오늘도 내일도 사랑해 💞
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

export default BirthdayEventLanding;
