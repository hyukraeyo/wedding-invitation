'use client';

import * as React from 'react';
import { Button, ButtonProps } from '@/components/ui/Button';

export type CTAButtonProps = Omit<ButtonProps, 'size' | 'fullWidth'>;

/**
 * CTAButton - Call-to-Action 버튼 컴포넌트
 *
 * TDS 패턴을 따라 항상 lg 사이즈, fullWidth로 렌더링되며,
 * variant와 color는 커스터마이징 가능합니다.
 *
 * @example
 * ```tsx
 * <CTAButton>확인</CTAButton>
 * <CTAButton variant="secondary" color="grey">취소</CTAButton>
 * ```
 */
const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ variant = 'primary', color = 'primary', ...props }, ref) => {
    return <Button size="lg" fullWidth variant={variant} color={color} {...props} ref={ref} />;
  }
);

CTAButton.displayName = 'CTAButton';

export { CTAButton };
