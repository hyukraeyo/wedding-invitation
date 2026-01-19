import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { TextField } from '@/components/common/TextField';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { ImageUploader } from '@/components/common/ImageUploader';
import { HeaderAction } from '@/components/common/HeaderAction';
import { cn } from '@/lib/utils';
import styles from './KakaoShareSection.module.scss';
import { CLOSING_SAMPLES, KAKAO_SHARE_SAMPLES } from '@/constants/samples';
import type { ExampleItem } from '@/components/common/ExampleSelectorModal';
import type { SectionProps } from '@/types/builder';

const ResponsiveModal = dynamic(() => import('@/components/common/ResponsiveModal').then(mod => mod.ResponsiveModal), {
    ssr: false
});

const ExampleSelectorModal = dynamic(() => import('@/components/common/ExampleSelectorModal').then(mod => mod.ExampleSelectorModal), {
    ssr: false
});

export default function KakaoShareSection({ isOpen, value }: SectionProps) {
    const kakao = useInvitationStore(useShallow(state => state.kakaoShare));
    const setKakao = useInvitationStore(state => state.setKakao);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const handleSelectSample = (sample: ExampleItem) => {
        setKakao({
            title: sample.title,
            description: sample.content // Map content to description
        });
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <AccordionItem
                value={value}
                title="카카오 초대장 썸네일"
                icon={MessageCircle}
                isOpen={isOpen}
                isCompleted={!!kakao.title}
                action={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <HeaderAction
                            icon={Sparkles}
                            label="추천 문구"
                            onClick={() => setIsSampleModalOpen(true)}
                        />
                        <HeaderAction
                            icon={MessageCircle}
                            label="미리보기"
                            onClick={() => setPreviewOpen(true)}
                        />
                    </div>
                }
            >
                <SectionContainer>
                    {/* Photo Upload */}
                    <Field label="사진">
                        <ImageUploader
                            value={kakao.imageUrl}
                            onChange={(url) => setKakao({ imageUrl: url })}
                            aspectRatio={kakao.imageRatio === 'portrait' ? '3/4' : '16/9'}
                            placeholder="썸네일 추가"
                        />
                    </Field>

                    <Field label="사진 비율">
                        <SegmentedControl
                            value={kakao.imageRatio}
                            options={[
                                { label: '세로형', value: 'portrait' },
                                { label: '가로형', value: 'landscape' },
                            ]}
                            onChange={(val: 'portrait' | 'landscape') => setKakao({ imageRatio: val })}
                        />
                        <InfoMessage>카카오톡 공유 메시지에서 보여질 사진의 비율입니다.</InfoMessage>
                    </Field>

                    <TextField
                        label="제목"
                        type="text"
                        placeholder="예: 우리 결혼합니다"
                        value={kakao.title}
                        onChange={(e) => setKakao({ title: e.target.value })}
                        maxLength={25}
                    />

                    <TextField
                        label="설명"
                        type="text"
                        placeholder="예: 2024년 10월 12일"
                        value={kakao.description}
                        onChange={(e) => setKakao({ description: e.target.value })}
                        maxLength={35}
                    />

                    <Field label="버튼 스타일">
                        <SegmentedControl
                            value={kakao.buttonType}
                            options={[
                                { label: '위치 안내', value: 'location' },
                                { label: '참석 여부', value: 'rsvp' },
                                { label: '사용 안함', value: 'none' },
                            ]}
                            onChange={(val) => setKakao({ buttonType: val as 'location' | 'rsvp' | 'none' })}
                        />
                    </Field>

                </SectionContainer>
            </AccordionItem>

            {/* Simple Preview Modal */}
            <ResponsiveModal
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                title="카카오톡 공유 미리보기"
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
                        <div className={styles.cardFooter}>
                            <span className={styles.footerText}>모바일 초대장</span>
                        </div>
                        <div className={styles.btnGroup}>
                            <div className={styles.cardBtn}>모바일 초대장</div>
                            {kakao.buttonType !== 'none' && (
                                <div className={styles.cardBtn}>
                                    {kakao.buttonType === 'location' ? '위치 안내' : '참석 여부'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ResponsiveModal>

            {/* Sample Phrases Modal */}
            <ExampleSelectorModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                title="카카오 공유 추천 문구"
                items={KAKAO_SHARE_SAMPLES}
                onSelect={handleSelectSample}
            />
        </>
    );
}
