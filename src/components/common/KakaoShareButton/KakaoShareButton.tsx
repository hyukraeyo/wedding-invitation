'use client';

import * as React from 'react';
import { normalizeImageUrl, sendKakaoShare } from '@/lib/kakao-share';

interface KakaoShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  invitationUrl: string;
  invitationTitle?: string;
  invitationDescription?: string;
  invitationImageUrl?: string;
  slug: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function KakaoShareButton({
  invitationUrl,
  invitationTitle = '',
  invitationDescription = '',
  invitationImageUrl = '',
  slug,
  onSuccess,
  onError,
  children,
  type = 'button',
  ...buttonProps
}: KakaoShareButtonProps) {
  const handleClick = React.useCallback(() => {
    const origin = window.location.origin;
    const shareTitle = (invitationTitle || '결혼식에 초대해요').trim();
    const shareDesc = (invitationDescription || '소중한 날에 초대해요').trim();
    const shareImageUrl = invitationImageUrl || `${origin}/logo.png`;

    sendKakaoShare({
      invitationUrl,
      options: {
        title: shareTitle,
        description: shareDesc,
        imageUrl: normalizeImageUrl(shareImageUrl, origin),
        buttonType: 'location',
      },
      slug,
      onSuccess: onSuccess || (() => undefined),
      onError: onError || (() => undefined),
    });
  }, [
    invitationDescription,
    invitationImageUrl,
    invitationTitle,
    invitationUrl,
    onError,
    onSuccess,
    slug,
  ]);

  return (
    <button type={type} onClick={handleClick} {...buttonProps}>
      {children}
    </button>
  );
}
