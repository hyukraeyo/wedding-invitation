'use client';

import React from 'react';
import { sendKakaoShare, normalizeImageUrl } from '@/lib/kakao-share';

interface KakaoShareButtonProps {
    children: React.ReactNode;
    invitationUrl: string;
    invitationTitle?: string;
    invitationDescription?: string;
    invitationImageUrl?: string;
    slug: string;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({
    children,
    invitationUrl,
    invitationTitle = '',
    invitationDescription = '',
    invitationImageUrl = '',
    slug,
    onSuccess,
    onError,
}) => {
    const handleClick = () => {
        const origin = window.location.origin;
        
        // Default values for robustness
        const shareTitle = (invitationTitle || '결혼식에 초대합니다').trim();
        const shareDesc = (invitationDescription || '소중한 날에 초대합니다').trim();
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
            onSuccess: onSuccess || (() => {}),
            onError: onError || (() => {}),
        });
    };

    return (
        <div onClick={handleClick}>
            {children}
        </div>
    );
};