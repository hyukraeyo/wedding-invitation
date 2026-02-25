'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Text } from '@/components/ui/Text';
import { Copy, MessageCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { KakaoShareButton } from '../KakaoShareButton/KakaoShareButton';
import { clsx } from 'clsx';
import styles from './ShareModal.module.scss';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationUrl: string;
  invitationTitle?: string | undefined;
  invitationDescription?: string | undefined;
  invitationImageUrl?: string | undefined;
  buttonType?: 'none' | 'location' | 'rsvp' | undefined;
  imageRatio?: 'portrait' | 'landscape' | undefined;
  address?: string | undefined;
  locationName?: string | undefined;
  slug: string;
}

export function ShareModal({
  open,
  onOpenChange,
  invitationUrl,
  invitationTitle,
  invitationDescription,
  invitationImageUrl,
  buttonType,
  imageRatio,
  address,
  locationName,
  slug,
}: ShareModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleLinkShare = () => {
    navigator.clipboard.writeText(invitationUrl);
    toast({
      description: '청첩장 주소가 복사되었어요.',
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      mobileBottomSheet
      mobileBottomSheetDirection="bottom"
    >
      <Dialog.Header title="청첩장 공유하기">
        <Text
          typography="t6"
          color="var(--color-grey-600)"
          style={{ textAlign: 'center', marginTop: '4px', display: 'block' }}
        >
          원하는 방법으로 청첩장을 공유해보세요
        </Text>
      </Dialog.Header>
      <Dialog.Body>
        <div className={styles.shareContainer}>
          <div className={styles.shareMethod}>
            <button
              onClick={handleLinkShare}
              className={clsx(styles.iconWrapper, styles.linkWrap)}
              aria-label="링크 복사"
            >
              {copied ? <Check size={28} /> : <Copy size={24} />}
            </button>
            <span className={styles.shareLabel}>링크 복사</span>
          </div>

          <div className={styles.shareMethod}>
            <KakaoShareButton
              invitationUrl={invitationUrl}
              invitationTitle={invitationTitle || ''}
              invitationDescription={invitationDescription || ''}
              invitationImageUrl={invitationImageUrl || ''}
              {...(buttonType ? { buttonType } : {})}
              {...(imageRatio ? { imageRatio } : {})}
              {...(address ? { address } : {})}
              {...(locationName ? { locationName } : {})}
              slug={slug}
              onSuccess={() => onOpenChange(false)}
              className={clsx(styles.iconWrapper, styles.kakaoWrap)}
              aria-label="카카오톡 공유"
            >
              <MessageCircle size={28} fill="currentColor" />
            </KakaoShareButton>
            <span className={styles.shareLabel}>카카오톡</span>
          </div>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
