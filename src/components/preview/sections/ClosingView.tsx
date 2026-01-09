'use client';

import React, { memo } from 'react';
import { MessageCircle, Share2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import styles from './ClosingView.module.css';

interface ClosingViewProps {
    id?: string | undefined;
    closingMessage?: string;
    accentColor: string;
}

/**
 * Presentational Component for the Closing / Footer section.
 * Provides social sharing and final remarks.
 */
const ClosingView = memo(({
    id,
    closingMessage,
    accentColor
}: ClosingViewProps) => {

    const handleLinkShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('청첩장 주소가 복사되었습니다.');
    };

    return (
        <SectionContainer id={id}>
            <div className={styles.footer}>
                <div className={styles.decorationLine} style={{ backgroundColor: accentColor, opacity: 0.2 }} />

                <div className={styles.message}>
                    {closingMessage || "서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며 걸어가려 합니다.\n저희의 새 출발을 축복해 주세요."}
                </div>

                <div className={styles.shareContainer}>
                    <button
                        className={`${styles.shareButton} ${styles.kakaoShare}`}
                        onClick={() => alert('카카오톡 공유 기능은 현재 준비 중입니다.')}
                    >
                        <MessageCircle size={18} fill="currentColor" />
                        카카오톡 공유하기
                    </button>
                    <button
                        className={`${styles.shareButton} ${styles.linkShare}`}
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
