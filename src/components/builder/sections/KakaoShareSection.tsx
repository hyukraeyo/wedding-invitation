import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BoardRow } from '@/components/ui/BoardRow';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { List, ListRow, ListFooter } from '@/components/ui/List';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { ImageUploader } from '@/components/common/ImageUploader';
import { HeaderAction } from '@/components/common/HeaderAction';
import { SampleList } from '@/components/common/SampleList';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import styles from './KakaoShareSection.module.scss';
import { KAKAO_SHARE_SAMPLES } from '@/constants/samples';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';

const ResponsiveModal = dynamic(() => import('@/components/common/ResponsiveModal').then(mod => mod.ResponsiveModal), {
    ssr: false
});



export default function KakaoShareSection(props: SectionProps) {
    const kakao = useInvitationStore(useShallow(state => state.kakaoShare));
    const setKakao = useInvitationStore(state => state.setKakao);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const handleSelectSample = (sample: SamplePhraseItem) => {
        setKakao({
            title: sample.title,
            description: sample.content // Map content to description
        });
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <BoardRow
                title="카카오 초대장 썸네일"
                isOpened={props.isOpen}
                onOpen={() => props.onToggle?.(true)}
                onClose={() => props.onToggle?.(false)}
                icon={<BoardRow.ArrowIcon />}
            >
                <List>
                    {/* Sample Trigger */}
                    <div style={{ padding: '0 24px 12px', display: 'flex', justifyContent: 'flex-end' }}>
                        <HeaderAction
                            icon={Sparkles}
                            label="추천 문구"
                            onClick={() => {
                                setIsSampleModalOpen(true);
                            }}
                        />
                    </div>

                    {/* Photo Upload */}
                    <ListRow
                        title="사진"
                        contents={
                            <ImageUploader
                                value={kakao.imageUrl}
                                onChange={(url) => setKakao({ imageUrl: url })}
                                aspectRatio={kakao.imageRatio === 'portrait' ? '3/4' : '16/9'}
                                placeholder="썸네일 추가"
                            />
                        }
                    />

                    <ListRow
                        title="사진 비율"
                        contents={
                            <SegmentedControl
                                alignment="fluid"
                                value={kakao.imageRatio || 'landscape'}
                                onChange={(val: string) => setKakao({ imageRatio: val as 'portrait' | 'landscape' })}
                            >
                                <SegmentedControl.Item value="portrait">
                                    세로형
                                </SegmentedControl.Item>
                                <SegmentedControl.Item value="landscape">
                                    가로형
                                </SegmentedControl.Item>
                            </SegmentedControl>
                        }
                    />
                    <ListFooter>
                        <InfoMessage>카카오톡 공유 메시지에서 보여질 사진의 비율입니다.</InfoMessage>
                    </ListFooter>

                    <ListRow
                        contents={
                            <TextField
                                label="제목"
                                variant="line"
                                type="text"
                                placeholder="예: 우리 결혼합니다"
                                value={kakao.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKakao({ title: e.target.value })}
                                maxLength={25}
                            />
                        }
                    />

                    <ListRow
                        contents={
                            <TextField
                                label="설명"
                                variant="line"
                                type="text"
                                placeholder="예: 2024년 10월 12일"
                                value={kakao.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKakao({ description: e.target.value })}
                                maxLength={35}
                            />
                        }
                    />

                    <ListRow
                        title="버튼 스타일"
                        contents={
                            <SegmentedControl
                                alignment="fluid"
                                value={kakao.buttonType || 'location'}
                                onChange={(val: string) => setKakao({ buttonType: val as 'location' | 'rsvp' | 'none' })}
                            >
                                <SegmentedControl.Item value="location">
                                    위치 안내
                                </SegmentedControl.Item>
                                <SegmentedControl.Item value="rsvp">
                                    참석 여부
                                </SegmentedControl.Item>
                                <SegmentedControl.Item value="none">
                                    사용 안함
                                </SegmentedControl.Item>
                            </SegmentedControl>
                        }
                    />

                    <div className={styles.bottomActions}>
                        <ResponsiveModal
                            open={previewOpen}
                            onOpenChange={setPreviewOpen}
                            title="카카오톡 공유 미리보기"
                            trigger={
                                <Button
                                    type="button"
                                    variant="weak"
                                    className={styles.fullPreviewBtn}
                                >
                                    <MessageCircle size={16} />
                                    미리보기
                                </Button>
                            }
                        >
                            <div className={styles.modalBody}>
                                <div className={styles.card}>
                                    {kakao.imageUrl ? (
                                        <div className={cn(
                                            styles.imageWrapper,
                                            kakao.imageRatio === 'portrait' ? styles.portrait : styles.landscape
                                        )}>
                                            <Image
                                                src={kakao.imageUrl}
                                                alt="Kakao Preview"
                                                fill
                                                sizes="(max-width: 768px) 100vw, 400px"
                                                className={styles.cardImage}
                                            />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            styles.imageWrapper,
                                            kakao.imageRatio === 'portrait' ? styles.portrait : styles.landscape
                                        )}>
                                            <div className={styles.placeholder}>
                                                <MessageCircle size={32} style={{ opacity: 0.2 }} />
                                            </div>
                                        </div>
                                    )}
                                    <div className={styles.cardContent}>
                                        <h4 className={styles.cardTitle}>
                                            {kakao.title || '우리 결혼합니다'}
                                        </h4>
                                        <p className={styles.cardDescription}>
                                            {kakao.description || '초대장을 보내드립니다.'}
                                        </p>
                                    </div>
                                    <div className={styles.btnGroup}>
                                        <div className={styles.cardBtn}>모바일 초대장</div>
                                        {kakao.buttonType !== 'none' && (
                                            <div className={styles.cardBtn}>
                                                {kakao.buttonType === 'location' ? '위치 안내' : '참석 여부'}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.footerText}>바나나 웨딩</span>
                                        <ChevronRight size={12} className={styles.footerChevron} />
                                    </div>
                                </div>
                            </div>
                        </ResponsiveModal>
                    </div>
                </List>
            </BoardRow>

            {/* Sample Phrases Modal */}
            <ResponsiveModal
                open={isSampleModalOpen}
                onOpenChange={setIsSampleModalOpen}
                title="카카오 공유 추천 문구"
                useScrollFade={true}
            >
                <SampleList
                    items={KAKAO_SHARE_SAMPLES}
                    onSelect={handleSelectSample}
                />
            </ResponsiveModal>
        </>
    );
}
