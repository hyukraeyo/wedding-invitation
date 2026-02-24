'use client';

import * as React from 'react';
import { normalizeImageUrl, sendKakaoShare } from '@/lib/kakao-share';

interface KakaoShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  invitationUrl: string;
  invitationTitle?: string | undefined;
  invitationDescription?: string | undefined;
  invitationImageUrl?: string | undefined;
  buttonType?: 'none' | 'location' | 'rsvp' | undefined;
  address?: string | undefined;
  locationName?: string | undefined;
  slug: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function KakaoShareButton({
  invitationUrl,
  invitationTitle = '',
  invitationDescription = '',
  invitationImageUrl = '',
  buttonType = 'location',
  address,
  locationName,
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
        buttonType,
        address,
        location: locationName,
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
    buttonType,
    address,
    locationName,
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
