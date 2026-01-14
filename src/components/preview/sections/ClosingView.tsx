'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInvitationStore } from '@/store/useInvitationStore';
import SectionContainer from '../SectionContainer';
import { AspectRatio } from '@/components/ui/AspectRatio';
import SectionHeader from '../SectionHeader';
import styles from './ClosingView.module.scss';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';

interface ClosingViewProps {
    id?: string | undefined;
    title?: string;
    subtitle?: string;
    closingMessage?: string;
    imageUrl?: string | null;
    ratio?: 'fixed' | 'auto';
    effect?: 'none' | 'mist' | 'ripple' | 'paper';
    accentColor: string;
}

/**
 * Presentational Component for the Closing / Footer section.
 * Provides social sharing and final remarks.
 */
const ClosingView = memo(({
    id,
    title,
    subtitle,
    closingMessage,
    imageUrl,
    ratio = 'fixed',
    effect = 'none',
    accentColor,
}: ClosingViewProps) => {
    const { toast } = useToast();
    const { kakaoShare, groom, bride, imageUrl: mainImageUrl, date, time } = useInvitationStore();

    const handleLinkShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast({
            description: '청첩장 주소가 복사되었습니다.',
        });
    };

    const handleKakaoShare = () => {
        if (!window.Kakao) {
            toast({ description: '카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해 주세요.', variant: 'destructive' });
            return;
        }

        const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
        if (!window.Kakao.isInitialized() && kakaoAppKey) {
            window.Kakao.init(kakaoAppKey);
        }

        const baseUrl = window.location.origin;
        const groomName = `${groom.lastName}${groom.firstName}`;
        const brideName = `${bride.lastName}${bride.firstName}`;

        const shareTitle = kakaoShare.title || `${groomName} ♥ ${brideName} 결혼식에 초대합니다`;
        const shareDesc = kakaoShare.description || `${date} ${time}`;
        let shareImageUrl = kakaoShare.imageUrl || mainImageUrl || `${baseUrl}/logo.png`;

        if (shareImageUrl.startsWith('/')) {
            shareImageUrl = `${baseUrl}${shareImageUrl}`;
        }

        try {
            if (!window.Kakao.Share?.sendDefault) {
                toast({ description: '카카오 공유 기능을 사용할 수 없습니다.', variant: 'destructive' });
                return;
            }
            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: shareTitle,
                    description: shareDesc,
                    imageUrl: shareImageUrl,
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: kakaoShare.buttonType !== 'none' ? [
                    {
                        title: kakaoShare.buttonType === 'location' ? '위치 보기' : '참석 여부',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ] : [],
            });
        } catch (error) {
            console.error('Kakao Share Error:', error);
            toast({ description: '공유 중 오류가 발생했습니다.', variant: 'destructive' });
        }
    };

    return (
        <SectionContainer id={id}>
            <div className={styles.footer}>
                <SectionHeader
                    title={title || ''}
                    subtitle={subtitle}
                    accentColor={accentColor}
                />

                {imageUrl && (
                    <div className={clsx(styles.imageSection, styles[ratio])}>
                        <div className={styles.imageContainer}>
                            {ratio === 'fixed' ? (
                                <AspectRatio ratio={16 / 9}>
                                    <Image
                                        src={imageUrl}
                                        alt="Ending Illustration"
                                        fill
                                        sizes={IMAGE_SIZES.section}
                                        className={styles.endingImage}
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                        unoptimized={isBlobUrl(imageUrl)}
                                    />
                                    {/* Effects Overlay */}
                                    {effect === 'mist' && <div className={clsx(styles.effectLayer, styles.mist)}></div>}
                                    {effect === 'ripple' && <div className={clsx(styles.effectLayer, styles.ripple)}></div>}
                                    {effect === 'paper' && <div className={clsx(styles.effectLayer, styles.paper)}></div>}
                                </AspectRatio>
                            ) : (
                                <>
                                    <Image
                                        src={imageUrl}
                                        alt="Ending Illustration"
                                        width={800}
                                        height={600}
                                        sizes={IMAGE_SIZES.section}
                                        className={styles.endingImage}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
                                        unoptimized={isBlobUrl(imageUrl)}
                                    />
                                    {/* Effects Overlay */}
                                    {effect === 'mist' && <div className={clsx(styles.effectLayer, styles.mist)}></div>}
                                    {effect === 'ripple' && <div className={clsx(styles.effectLayer, styles.ripple)}></div>}
                                    {effect === 'paper' && <div className={clsx(styles.effectLayer, styles.paper)}></div>}
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div
                    className={clsx(styles.message, "rich-text-content", !imageUrl && styles.noImage)}
                    dangerouslySetInnerHTML={{
                        __html: closingMessage || "<p>서로가 마주보며 다져온 사랑을<br>이제 함께 한 곳을 바라보며 걸어가려 합니다.<br>저희의 새 출발을 축복해 주세요.</p>"
                    }}
                />

                <div className={styles.shareContainer}>
                    <button
                        className={clsx(styles.shareButton, styles.kakaoShare)}
                        onClick={handleKakaoShare}
                    >
                        <MessageCircle size={18} fill="currentColor" />
                        카카오톡 공유하기
                    </button>
                    <button
                        className={clsx(styles.shareButton, styles.linkShare)}
                        onClick={handleLinkShare}
                    >
                        <Share2 size={18} />
                        링크 주소 복사하기
                    </button>
                </div>
            </div>
        </SectionContainer>
    );
});

ClosingView.displayName = 'ClosingView';

export default ClosingView;
