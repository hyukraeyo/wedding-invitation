import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Camera, X } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderTextarea } from '../BuilderTextarea';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderField } from '../BuilderField';
import { Section, Stack, Row } from '../BuilderLayout';
import styles from './ClosingSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const RECOMMENDED_TEXT = `장담하건대, 세상이 다 겨울이어도
우리 사랑은 늘 봄처럼 따뜻하고
간혹, 여름처럼 뜨거울 겁니다.
이수동, 사랑가`;

export default function ClosingSection({ isOpen, onToggle }: SectionProps) {
    const { closing, setClosing } = useInvitationStore();

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setClosing({ imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AccordionItem
            title="엔딩 사진, 문구"
            icon={Camera}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!closing.imageUrl || !!closing.content}
            badge="강력추천😎"
        >
            <Section>
                {/* Photo Upload */}
                <BuilderField label="사진">
                    <div className={styles.uploadArea ?? ''}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.hiddenInput ?? ''}
                        />

                        {closing.imageUrl ? (
                            <div className={styles.previewContainer ?? ''}>
                                <div className={styles.imageWrapper ?? ''}>
                                    <Image src={closing.imageUrl} alt="Closing" fill className={styles.image ?? ''} />
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); setClosing({ imageUrl: null }); }}
                                    className={styles.removeButton ?? ''}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <Stack gap="sm" className={styles.placeholder ?? ''}>
                                <div className={styles.iconWrapper ?? ''}>
                                    <ImageIcon size={24} />
                                </div>
                                <div className={styles.textWrapper ?? ''}>
                                    <p className={styles.title ?? ''}>사진 업로드</p>
                                    <p className={styles.subtitle ?? ''}>클릭하여 이미지를 선택하세요</p>
                                </div>
                            </Stack>
                        )}
                    </div>
                </BuilderField>

                {/* Effect Selection */}
                <BuilderField label="이펙트">
                    <BuilderButtonGroup
                        value={closing.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '안개', value: 'mist' },
                            { label: '물결', value: 'ripple' },
                            { label: '페이퍼', value: 'paper' },
                        ]}
                        onChange={(val: 'none' | 'mist' | 'ripple' | 'paper') => setClosing({ effect: val })}
                    />
                </BuilderField>

                {/* Ratio Selection */}
                <BuilderField label="사진 비율">
                    <BuilderButtonGroup
                        value={closing.ratio}
                        options={[
                            { label: '고정 (기본)', value: 'fixed' },
                            { label: '자동 (원본 비율)', value: 'auto' },
                        ]}
                        onChange={(val: 'fixed' | 'auto') => setClosing({ ratio: val })}
                    />
                </BuilderField>

                {/* Content Editor */}
                <BuilderField
                    label={
                        <Row align="between" className={styles.contentHeader ?? ''}>
                            <BuilderLabel className="!mb-0">문구 내용</BuilderLabel>
                            <button
                                onClick={() => setClosing({ content: RECOMMENDED_TEXT })}
                                className={styles.recommendButton ?? ''}
                            >
                                <span>✨ 추천 문구 넣기</span>
                            </button>
                        </Row>
                    }
                >
                    <BuilderTextarea
                        value={closing.content}
                        onChange={(e) => setClosing({ content: e.target.value })}
                        className={styles.textarea ?? ''}
                        placeholder="마무리 문구를 입력하세요..."
                    />
                </BuilderField>
            </Section>
        </AccordionItem>
    );
}
