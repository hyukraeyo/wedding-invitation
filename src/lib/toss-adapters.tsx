'use client';

/**
 * 토스 앱인토스 환경에서 TDS 컴포넌트를 사용하기 위한 어댑터 모듈.
 *
 * 일반 웹에서는 기존 프로젝트 컴포넌트를 사용하고,
 * 토스 환경에서만 TDS 컴포넌트로 전환됩니다.
 *
 * @note TDS 컴포넌트는 lazy-load 되므로 일반 웹 번들에 영향 없음
 * @note TDS는 로컬 브라우저에서 동작하지 않음. 샌드박스앱에서 테스트 필요
 *
 * @example
 * ```tsx
 * import { TossButton, TossConfirmDialog } from '@/lib/toss-adapters';
 *
 * // 토스 환경: TDS 컴포넌트, 일반 웹: 기존 컴포넌트
 * <TossButton onClick={handleClick}>확인</TossButton>
 * ```
 */

import React, { lazy, Suspense, type ReactNode } from 'react';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';

// 기존 프로젝트 컴포넌트
import { Button as WebButton, type ButtonProps as WebButtonProps } from '@/components/ui/Button';
import { ConfirmDialog as WebConfirmDialog } from '@/components/ui/AlertDialog';

// TDS 컴포넌트 (lazy-load — 토스 환경에서만 로드됨)
const TDSButtonLazy = lazy(() =>
  import('@toss/tds-mobile').then((mod) => ({
    default: mod.Button,
  }))
);

const TDSConfirmDialogLazy = lazy(() =>
  import('@toss/tds-mobile').then((mod) => ({
    default: mod.ConfirmDialog,
  }))
);

// ─────────────────────────────────────────
// TossButton: Button 어댑터
// ─────────────────────────────────────────

export interface TossButtonProps extends Omit<WebButtonProps, 'variant' | 'size'> {
  variant?: WebButtonProps['variant'];
  size?: WebButtonProps['size'];
  children?: ReactNode;
}

/**
 * 토스/웹 환경에 따라 자동으로 Button을 전환하는 어댑터.
 *
 * - 토스 환경: `@toss/tds-mobile` Button
 * - 일반 웹: 기존 프로젝트 Button
 */
export function TossButton({
  variant = 'primary',
  size = 'lg',
  children,
  disabled,
  onClick,
  className,
  ...rest
}: TossButtonProps) {
  const isToss = useTossEnvironment();

  if (!isToss) {
    return (
      <WebButton
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={onClick}
        className={className}
        {...rest}
      >
        {children}
      </WebButton>
    );
  }

  // TDS Button variant 매핑
  const tdsVariant =
    variant === 'primary' || variant === 'blue'
      ? 'primary'
      : variant === 'secondary' || variant === 'soft'
        ? 'secondary'
        : 'primary';

  const tdsSize = size === 'lg' ? 'large' : size === 'md' ? 'medium' : 'small';

  return (
    <Suspense
      fallback={
        <WebButton
          variant={variant}
          size={size}
          disabled={disabled}
          onClick={onClick}
          className={className}
          {...rest}
        >
          {children}
        </WebButton>
      }
    >
      {/* @ts-expect-error TDS Button variant/size 타입은 런타임에 정상 동작 */}
      <TDSButtonLazy variant={tdsVariant} size={tdsSize} disabled={disabled} onClick={onClick}>
        {children}
      </TDSButtonLazy>
    </Suspense>
  );
}

TossButton.displayName = 'TossButton';

// ─────────────────────────────────────────
// TossConfirmDialog: ConfirmDialog 어댑터
// ─────────────────────────────────────────

export interface TossConfirmDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'primary' | 'danger';
}

/**
 * 토스/웹 환경에 따라 자동으로 ConfirmDialog를 전환하는 어댑터.
 *
 * - 토스 환경: `@toss/tds-mobile` ConfirmDialog (TDS)
 * - 일반 웹: 기존 프로젝트 ConfirmDialog (Radix AlertDialog 기반)
 */
export function TossConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'primary',
}: TossConfirmDialogProps) {
  const isToss = useTossEnvironment();

  const handleClose = () => {
    onOpenChange?.(false);
  };

  if (!isToss) {
    return (
      <WebConfirmDialog
        open={open}
        onOpenChange={onOpenChange ?? handleClose}
        title={title ?? ''}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm ?? handleClose}
        onCancel={onCancel ?? handleClose}
        variant={variant}
      />
    );
  }

  // TDS ConfirmDialog: confirmButton/cancelButton은 ReactNode
  return (
    <Suspense fallback={null}>
      <TDSConfirmDialogLazy
        open={open}
        title={title}
        description={description}
        onClose={handleClose}
        confirmButton={confirmText}
        cancelButton={cancelText}
      />
    </Suspense>
  );
}

TossConfirmDialog.displayName = 'TossConfirmDialog';
