'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { Copy, Share2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { KakaoShareButton } from '../KakaoShareButton/KakaoShareButton';
import styles from './ShareModal.module.scss';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationUrl: string;
  invitationTitle?: string;
  invitationDescription?: string;
  invitationImageUrl?: string;
  slug: string;
}

export function ShareModal({
  open,
  onOpenChange,
  invitationUrl,
  invitationTitle,
  invitationDescription,
  invitationImageUrl,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <IconButton
              onClick={handleLinkShare}
              className={styles.shareButton}
              aria-label="링크 복사"
              variant="ghost"
              name=""
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </IconButton>
            <span className={styles.shareLabel}>링크 복사</span>
          </div>

          <div className={styles.shareMethod}>
            <KakaoShareButton
              invitationUrl={invitationUrl}
              invitationTitle={invitationTitle || ''}
              invitationDescription={invitationDescription || ''}
              invitationImageUrl={invitationImageUrl || ''}
              slug={slug}
              onSuccess={() => onOpenChange(false)}
              className={styles.shareButton}
              aria-label="카카오톡 공유"
            >
              <Share2 size={20} />
            </KakaoShareButton>
            <span className={styles.shareLabel}>카카오톡</span>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="ghost" onClick={() => onOpenChange(false)} size="lg">
          닫기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
