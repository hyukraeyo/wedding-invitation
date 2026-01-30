import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), { ssr: false });
import { Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { ImageUploader } from '@/components/common/ImageUploader';
import { SampleList } from '@/components/common/SampleList';
import { Button } from '@/components/ui/Button';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { Modal } from '@/components/ui/Modal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import styles from './ClosingSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { CLOSING_SAMPLES } from '@/constants/samples';
import { SectionAccordion } from '@/components/ui/Accordion';

export default function ClosingSection(props: SectionProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const closing = useInvitationStore(useShallow(state => state.closing));
    const setClosing = useInvitationStore(state => state.setClosing);

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const updateClosing = (data: Partial<typeof closing>) => setClosing(data);

    const handleSelectSample = (sample: SamplePhraseItem) => {
        updateClosing({
            subtitle: sample.subtitle || '',
            title: sample.title,
            content: sample.content
        });
        setIsSampleModalOpen(false);
    };

    const renderSampleList = () => (
        <SampleList
            items={CLOSING_SAMPLES}
            onSelect={handleSelectSample}
        />
    );

    return (
        <>
            <SectionAccordion
                title="마무리"
                value="closing"
                isOpen={props.isOpen}
                onToggle={props.onToggle}
            >
                <div className={styles.container}>
                    <div className={styles.sampleActionRow}>
                        <span className={styles.rowTitle}>추천 문구</span>
                        <Button
                            type="button"
                            variant="weak"
                            size="sm"
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSampleModalOpen(true);
                            }}
                        >
                            <Sparkles size={14} className={styles.sparkleIcon} />
                            <span>선택하기</span>
                        </Button>
                    </div>

                    <div className={styles.optionItem}>
                        <TextField
                            variant="line"
                            label="소제목"
                            placeholder="예: CLOSING"
                            value={closing.subtitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateClosing({ subtitle: e.target.value })}
                        />
                    </div>
                    <div className={styles.optionItem}>
                        <TextField
                            variant="line"
                            label="제목"
                            placeholder="예: 저희의 시작을 함께해주셔서 감사합니다"
                            value={closing.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateClosing({ title: e.target.value })}
                        />
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.rowTitle}>내용</div>
                        {props.isOpen ? (
                            <RichTextEditor
                                content={closing.content}
                                onChange={(val: string) => updateClosing({ content: val })}
                                placeholder="감사의 마음을 담은 짧은 인사말"
                            />
                        ) : null}
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.rowTitle}>사진</div>
                        <div className={styles.optionWrapper}>
                            <ImageUploader
                                value={closing.imageUrl}
                                onChange={(url) => updateClosing({ imageUrl: url })}
                                placeholder="마무리 사진 추가"
                                ratio={closing.ratio}
                                onRatioChange={(val) => updateClosing({ ratio: val })}
                            />
                        </div>
                    </div>
                </div>
            </SectionAccordion>

            {isDesktop ? (
                <Modal
                    open={isSampleModalOpen}
                    onOpenChange={setIsSampleModalOpen}
                >
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header title="마무리 추천 문구" />
                        <Modal.Body>
                            {renderSampleList()}
                        </Modal.Body>
                        <Modal.Footer>

                            <BottomCTA.Single
                                fixed={false}
                                onClick={() => setIsSampleModalOpen(false)}
                            >
                                닫기
                            </BottomCTA.Single>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal >
            ) : (
                <BottomSheet
                    open={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    header="마무리 추천 문구"
                    cta={
                        <BottomCTA.Single
                            fixed={false}
                            onClick={() => setIsSampleModalOpen(false)}
                        >
                            닫기
                        </BottomCTA.Single>
                    }
                >
                    <BottomSheet.Body>
                        {renderSampleList()}
                    </BottomSheet.Body>
                </BottomSheet>
            )
            }
        </>
    );
}
