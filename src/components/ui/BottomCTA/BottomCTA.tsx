'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { CTAButton, CTAButtonProps } from '../CTAButton';
import s from './BottomCTA.module.scss';

/**
 * BottomCTA 컨테이너 Props
 */
export interface BottomCTAContainerProps {
  children: React.ReactNode;
  fixed?: boolean;
  className?: string;
  transparent?: boolean;
  animated?: boolean;
  fixedAboveKeyboard?: boolean;
  hideOnScroll?: boolean;
}

/**
 * BottomCTA 컨테이너 컴포넌트
 * 하단 고정 레이아웃을 제공합니다.
 */
const BottomCTAContainer = ({
  children,
  fixed = false,
  className,
  transparent = false,
  animated = false,
  fixedAboveKeyboard = true,
  hideOnScroll = false,
}: BottomCTAContainerProps) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    if (!hideOnScroll || !fixed) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // 아래로 스크롤 → 숨김
        setIsVisible(false);
      } else {
        // 위로 스크롤 → 표시
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, fixed]);

  return (
    <div
      className={clsx(
        s.container,
        fixed && s.fixed,
        transparent && s.transparent,
        animated && s.animated,
        fixed && fixedAboveKeyboard && s.fixedAboveKeyboard,
        hideOnScroll && !isVisible && s.hidden,
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Single 버튼 Props
 */
export interface BottomCTASingleProps extends BottomCTAContainerProps {
  children: React.ReactNode;
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | (() => void) | undefined;
  loading?: boolean;
  disabled?: boolean;
  buttonClassName?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: CTAButtonProps['variant'];
  color?: CTAButtonProps['color'];
  asChild?: boolean;
}

/**
 * Single - 단일 버튼 CTA
 */
const Single = ({
  children,
  onClick,
  fixed = false,
  loading = false,
  disabled = false,
  className,
  buttonClassName,
  type = 'button',
  transparent = false,
  animated = false,
  variant = 'primary',
  color = 'primary',
  fixedAboveKeyboard = true,
  hideOnScroll = false,
  asChild = false,
}: BottomCTASingleProps) => {
  const button = (
    <CTAButton
      variant={variant}
      color={color}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={buttonClassName}
      type={type}
      asChild={asChild}
    >
      {children}
    </CTAButton>
  );

  // fixed나 transparent가 없으면 컨테이너 없이 버튼만 렌더링
  if (!fixed && !transparent) {
    return button;
  }

  return (
    <BottomCTAContainer
      fixed={fixed}
      transparent={transparent}
      animated={animated}
      fixedAboveKeyboard={fixedAboveKeyboard}
      hideOnScroll={hideOnScroll}
      {...(className && { className })}
    >
      {button}
    </BottomCTAContainer>
  );
};
Single.displayName = 'BottomCTA.Single';

/**
 * Double 버튼 Props
 */
export interface BottomCTADoubleProps extends BottomCTAContainerProps {
  leftButton: React.ReactNode;
  rightButton: React.ReactNode;
  buttonGroupClassName?: string;
}

/**
 * Double - 두 개 버튼 CTA
 */
const Double = ({
  leftButton,
  rightButton,
  fixed = false,
  className,
  buttonGroupClassName,
  transparent = false,
  animated = false,
  fixedAboveKeyboard = true,
  hideOnScroll = false,
}: BottomCTADoubleProps) => {
  const content = (
    <div className={clsx(s.buttonGroup, buttonGroupClassName)}>
      {leftButton}
      {rightButton}
    </div>
  );

  // fixed나 transparent가 없으면 컨테이너 없이 버튼 그룹만 렌더링
  if (!fixed && !transparent) {
    return content;
  }

  return (
    <BottomCTAContainer
      fixed={fixed}
      transparent={transparent}
      animated={animated}
      fixedAboveKeyboard={fixedAboveKeyboard}
      hideOnScroll={hideOnScroll}
      {...(className && { className })}
    >
      {content}
    </BottomCTAContainer>
  );
};
Double.displayName = 'BottomCTA.Double';

/**
 * BottomCTA - 하단 CTA 컴포넌트
 *
 * @example
 * ```tsx
 * // Single 버튼
 * <BottomCTA.Single>확인</BottomCTA.Single>
 *
 * // Double 버튼
 * <BottomCTA.Double
 *   leftButton={<CTAButton variant="secondary" color="grey">취소</CTAButton>}
 *   rightButton={<CTAButton>확인</CTAButton>}
 * />
 *
 * // 고정 + 스크롤 애니메이션
 * <BottomCTA.Single fixed hideOnScroll>확인</BottomCTA.Single>
 * ```
 */
export const BottomCTA = {
  Single,
  Double,
};

/**
 * FixedBottomCTA - 항상 하단에 고정되는 CTA
 * TDS 패턴: BottomCTA의 fixed={true} 래퍼
 */
export const FixedBottomCTA = (props: Omit<BottomCTASingleProps, 'fixed'>) => {
  return <BottomCTA.Single fixed {...props} />;
};
FixedBottomCTA.displayName = 'FixedBottomCTA';

/**
 * FixedBottomCTA.Double - 항상 하단에 고정되는 Double CTA
 */
FixedBottomCTA.Double = function FixedBottomCTADouble(props: Omit<BottomCTADoubleProps, 'fixed'>) {
  return <BottomCTA.Double fixed {...props} />;
};
