'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InvitationData } from '@/store/useInvitationStore';
import SectionContainer from '../SectionContainer';
import { Button } from '@/components/ui/Button';
import SectionHeader from '../SectionHeader';
import styles from './ClosingView.module.scss';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';
import { Placeholder } from '@/components/ui/Placeholder';

interface ClosingViewProps {
  id?: string | undefined;
  title?: string;
  subtitle?: string;
  closingMessage?: string;
  imageUrl?: string | null;
  ratio?: 'fixed' | 'auto';
  accentColor: string;
  kakaoShare?: InvitationData['kakaoShare'];
  groom: InvitationData['groom'];
  bride: InvitationData['bride'];
  date: InvitationData['date'];
  time: InvitationData['time'];
  mainImageUrl: InvitationData['imageUrl'];
  animateEntrance?: boolean;
  address?: string;
  location?: string;
  slug?: string;
}

/**
 * Presentational Component for the Closing / Footer section.
 * Provides social sharing and final remarks.
 */
const ClosingView = memo(
  ({
    id,
    title,
    subtitle,
    closingMessage,
    imageUrl,
    ratio = 'fixed',
    accentColor,
    kakaoShare,
    groom,
    bride,
    date,
    time,
    mainImageUrl,
    animateEntrance,
    address,
    location,
    slug,
  }: ClosingViewProps) => {
    const { toast } = useToast();

    const handleLinkShare = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      toast({
        description: '청첩장 주소가 복사되었어요.',
      });
    };

    const handleKakaoShare = () => {
      const baseUrl = window.location.origin;
      const groomName = `${groom.lastName}${groom.firstName}`;
      const brideName = `${bride.lastName}${bride.firstName}`;

      const shareTitle = kakaoShare?.title || `${groomName} ♥ ${brideName} 결혼식에 초대해요`;
      const shareDesc = kakaoShare?.description || `${date} ${time}`;
      const shareImageUrl = kakaoShare?.imageUrl || mainImageUrl || `${baseUrl}/logo.png`;
      const buttonType = kakaoShare?.buttonType ?? 'location';

      // 카카오 공유 유틸리티 사용
      import('@/lib/kakao-share')
        .then(({ sendKakaoShare, normalizeImageUrl }) => {
          sendKakaoShare({
            invitationUrl: window.location.href,
            options: {
              title: shareTitle,
              description: shareDesc,
              imageUrl: normalizeImageUrl(shareImageUrl, baseUrl),
              buttonType,
              address,
              location,
            },
            slug,
            onError: () => {
              toast({ description: '공유 중 오류가 발생했어요.', variant: 'destructive' });
            },
          });
        })
        .catch(() => {
          toast({
            description: '카카오 SDK 로딩 중이에요. 잠시 후 다시 시도해 주세요.',
            variant: 'destructive',
          });
        });
    };

    return (
      <SectionContainer id={id} animateEntrance={animateEntrance}>
        <div className={styles.footer}>
          <SectionHeader title={title || ''} subtitle={subtitle} accentColor={accentColor} />

          {imageUrl ? (
            <div className={clsx(styles.imageSection, styles[ratio]) || ''}>
              <div className={clsx(styles.imageContainer) || ''}>
                {ratio === 'fixed' ? (
                  <div
                    className={clsx(styles.fullSize) || ''}
                    style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}
                  >
                    <Image
                      src={imageUrl}
                      alt="Ending Illustration"
                      fill
                      sizes={IMAGE_SIZES.section}
                      className={clsx(styles.endingImage) || ''}
                      style={{
                        objectFit: 'cover',
                      }}
                      unoptimized={isBlobUrl(imageUrl)}
                    />
                  </div>
                ) : (
                  <>
                    <Image
                      src={imageUrl}
                      alt="Ending Illustration"
                      width={800}
                      height={600}
                      sizes={IMAGE_SIZES.section}
                      className={clsx(styles.endingImage) || ''}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                      unoptimized={isBlobUrl(imageUrl)}
                    />
                  </>
                )}
              </div>
            </div>
          ) : (
            <Placeholder className={styles.imagePlaceholder} />
          )}

          <div
            className={clsx(styles.message, 'rich-text-content', !imageUrl && styles.noImage) || ''}
            dangerouslySetInnerHTML={{
              __html:
                closingMessage ||
                '<p>서로가 마주보며 다져온 사랑을<br>이제 함께 한 곳을 바라보며 걸어가려고 해요.<br>저희의 새 출발을 축복해 주세요.</p>',
            }}
          />

          <div className={clsx(styles.shareContainer) || ''}>
            <Button
              className={clsx(styles.shareButton, styles.kakaoShare) || ''}
              onClick={handleKakaoShare}
            >
              <MessageCircle size={18} fill="currentColor" />
              카카오톡 공유하기
            </Button>
            <Button
              className={clsx(styles.shareButton, styles.linkShare) || ''}
              onClick={handleLinkShare}
            >
              <Share2 size={18} />
              링크 주소 복사하기
            </Button>
          </div>
        </div>
      </SectionContainer>
    );
  }
);

ClosingView.displayName = 'ClosingView';

export default ClosingView;
