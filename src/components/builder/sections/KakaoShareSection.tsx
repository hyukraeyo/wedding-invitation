import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SegmentedControl } from '../SegmentedControl';
import { Field, Label, HelpText } from '../FormPrimitives';
import { ImageUploader } from '../ImageUploader';
import styles from './KakaoShareSection.module.scss';
import { cn } from '@/lib/utils';

interface SectionProps {
    value: string;
    isOpen: boolean;
    onToggle: () => void;
}

export default function KakaoShareSection({ isOpen, onToggle, value }: SectionProps) {
    const kakao = useInvitationStore(state => state.kakaoShare);
    const setKakao = useInvitationStore(state => state.setKakao);
    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <AccordionItem
            value={value}
            title="카카오 초대장 썸네일"
            icon={MessageCircle}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!kakao.title}
        >
            <div className={styles.container}>
                {/* Photo Upload with Header Preview Button */}
                <Field
                    label={
                        <div className={styles.previewHeader}>
                            <Label className="!mb-0">사진</Label>
                            <button
                                onClick={() => setPreviewOpen(true)}
                                className={styles.previewBtn}
                            >
                                <Sparkles size={12} />
                                <span>미리보기</span>
                            </button>
                        </div>
                    }
                >
                    <div className={styles.uploaderWrapper}>
                        <ImageUploader
                            value={kakao.imageUrl}
                            onChange={(url) => setKakao({ imageUrl: url })}
                            aspectRatio={kakao.imageRatio === 'portrait' ? '3/4' : '16/9'}
                            placeholder="썸네일 추가"
                        />
                    </div>
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
                    <HelpText>카카오톡 공유 메시지에서 보여질 사진의 비율입니다.</HelpText>
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

                {/* Simple Preview Modal */}
                {previewOpen && (
                    <div
                        className={styles.modalContainer}
                        onClick={() => setPreviewOpen(false)}
                    >
                        <div
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
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
                                        {kakao.buttonType !== 'none' && (
                                            <div className={styles.cardBtn}>
                                                {kakao.buttonType === 'location' ? '위치 보기' : '참석 여부'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AccordionItem>
    );
}
