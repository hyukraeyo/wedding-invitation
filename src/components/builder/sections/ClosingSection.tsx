import React, { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { Field } from '../Field';
import { ImageUploader } from '../ImageUploader';
import { SegmentedControl } from '../SegmentedControl';
import { BuilderModal } from '@/components/common/BuilderModal';
import RichTextEditor from '@/components/common/RichTextEditor';
import { Section, Row, Card } from '../Layout';
import styles from './ClosingSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const CLOSING_SAMPLES = [
    {
        title: '봄처럼 따뜻하게',
        message: '<p>장담하건대, 세상이 다 겨울이어도<br>우리 사랑은 늘 봄처럼 따뜻하고<br>간혹, 여름처럼 뜨거울 겁니다.</p><p>이수동, 사랑가</p>'
    },
    {
        title: '아름다운 동행',
        message: '<p>서로가 서로에게 가장 아름다운<br>풍경이 되어 평생을 함께하겠습니다.</p><p>저희의 첫걸음을 축복해 주셔서 감사합니다.</p>'
    },
    {
        title: '감사의 인사',
        message: '<p>바쁘신 중에 먼 길 발걸음 해주셔서<br>진심으로 감사드립니다.</p><p>전해주신 따뜻한 마음 간직하며<br>행복하게 잘 살겠습니다.</p>'
    },
    {
        title: '새로운 시작',
        message: '<p>한 곳을 바라보며 첫발을 떼는 날,<br>함께해주신 모든 분들께 감사드립니다.</p><p>그 마음 잊지 않고 예쁘게 살겠습니다.</p>'
    },
    {
        title: '여정의 시작',
        message: '<p>저희 두 사람의 새로운 시작을<br>함께 해주셔서 감사합니다.</p><p>보내주신 축복 속에 지혜롭고 현명한 부부로<br>성장하겠습니다.</p>'
    }
];

export default function ClosingSection({ isOpen, onToggle }: SectionProps) {
    const { closing, setClosing } = useInvitationStore();
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

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
                <Field label="사진">
                    <ImageUploader
                        value={closing.imageUrl}
                        onChange={(url) => setClosing({ imageUrl: url })}
                        placeholder="마무리 사진 추가"
                        ratio={closing.ratio}
                        onRatioChange={(val) => setClosing({ ratio: val })}
                        aspectRatio="4/5"
                    />
                </Field>

                {/* Effect Selection */}
                <Field label="이펙트">
                    <SegmentedControl
                        value={closing.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '안개', value: 'mist' },
                            { label: '물결', value: 'ripple' },
                            { label: '페이퍼', value: 'paper' },
                        ]}
                        onChange={(val: 'none' | 'mist' | 'ripple' | 'paper') => setClosing({ effect: val })}
                    />
                </Field>

                {/* Content Editor */}
                <Field
                    label={
                        <Row align="between" className={styles.contentHeader ?? ''}>
                            <span className={styles.contentLabel}>문구 내용</span>
                            <button
                                onClick={() => setIsSampleModalOpen(true)}
                                className={styles.exampleButton ?? ''}
                            >
                                <Sparkles size={14} className={styles.sparkle ?? ''} />
                                <span>예시 문구</span>
                            </button>
                        </Row>
                    }
                >
                    <RichTextEditor
                        content={closing.content}
                        onChange={(content) => setClosing({ content })}
                        placeholder="마무리 문구를 입력하세요..."
                    />
                </Field>

                {/* Sample Phrases Modal */}
                <BuilderModal
                    isOpen={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    title="추천 문구"
                >
                    <div className={styles.modalGrid ?? ''}>
                        {CLOSING_SAMPLES.map((sample, idx) => (
                            <Card
                                key={idx}
                                hoverable
                                className={styles.sampleCard ?? ''}
                            >
                                <button
                                    onClick={() => {
                                        setClosing({ content: sample.message });
                                        setIsSampleModalOpen(false);
                                    }}
                                    className={styles.sampleButton ?? ''}
                                >
                                    <div className={styles.sampleTitle ?? ''}>{sample.title}</div>
                                    <div
                                        className={styles.sampleMessage ?? ''}
                                        dangerouslySetInnerHTML={{ __html: sample.message }}
                                    />
                                </button>
                            </Card>
                        ))}
                    </div>
                </BuilderModal>
            </Section>
        </AccordionItem>
    );
}
