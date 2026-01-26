'use client';

import React, { useState } from 'react';
import { ResponsiveModal } from '../ResponsiveModal';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
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

export const ShareModal: React.FC<ShareModalProps> = ({
    open,
    onOpenChange,
    invitationUrl,
    invitationTitle,
    invitationDescription,
    invitationImageUrl,
    slug,
}) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleLinkShare = () => {
        navigator.clipboard.writeText(invitationUrl);
        toast({
            description: '청첩장 주소가 복사되었습니다.',
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="청첩장 공유하기"
            description="원하는 방법으로 청첩장을 공유해보세요"
            showCancel={false}
        >
            <div className={styles.shareContainer}>
                <div className={styles.shareMethod}>
                    <IconButton 
                        onClick={handleLinkShare}
                        className={styles.shareButton}
                        aria-label="링크 복사"
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
                    >
                        <IconButton 
                            className={styles.shareButton}
                            aria-label="카카오톡 공유"
                        >
                            <Share2 size={20} />
                        </IconButton>
                    </KakaoShareButton>
                    <span className={styles.shareLabel}>카카오톡</span>
                </div>
                
                <div className={styles.shareButtonRow}>
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className={styles.cancelButton}
                    >
                        닫기
                    </Button>
                </div>
            </div>
        </ResponsiveModal>
    );
};