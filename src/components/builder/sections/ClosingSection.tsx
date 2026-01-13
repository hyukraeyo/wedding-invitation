import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Field } from '../FormPrimitives';
import { ImageUploader } from '../ImageUploader';
import { ExampleSelectorModal } from '@/components/builder/ExampleSelectorModal';
import styles from './ClosingSection.module.scss';

interface SectionProps {
    value: string;
    isOpen: boolean;
    onToggle: () => void;
}

const SAMPLE_PHRASES = [
    {
        subtitle: 'CLOSING',
        title: '감사의 마음을 전합니다',
        content: '저희의 새로운 시작을 함께 축복해 주셔서 진심으로 감사합니다. 보내주신 소중한 마음 평생 잊지 않고 예쁘게 잘 살겠습니다.'
    },
    {
        subtitle: 'THANK YOU',
        title: '함께해주셔서 감사합니다',
        content: '귀한 걸음으로 저희의 앞날을 빛내주셔서 감사합니다. 서로 아끼고 배려하며 행복한 가정 이루며 살겠습니다.'
    },
    {
        subtitle: 'GRATITUDE',
        title: '소중한 인연에 감사합니다',
        content: '오늘 이 자리를 빛내주신 한 분 한 분의 따뜻한 마음을 마음속 깊이 간직하겠습니다. 항상 행복하시길 기원합니다.'
    }
];

export default function ClosingSection({ isOpen, onToggle, value }: SectionProps) {
    const closing = useInvitationStore(state => state.closing);
    const setClosing = useInvitationStore(state => state.setClosing);

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const updateClosing = (data: Partial<typeof closing>) => setClosing(data);

    const handleSelectSample = (sample: typeof SAMPLE_PHRASES[0]) => {
        updateClosing({
            subtitle: sample.subtitle,
            title: sample.title,
            content: sample.content
        });
        setIsSampleModalOpen(false);
    };

    return (
        <AccordionItem
            value={value}
            title="마무리"
            icon={Heart}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!closing.title}
        >
            <div className={styles.container}>
                {/* Header: Sample Phrases Button */}
                <div className={styles.sampleBtnWrapper}>
                    <button
                        onClick={() => setIsSampleModalOpen(true)}
                        className={styles.sampleBtn}
                    >
                        <Sparkles size={14} className={styles.sparkleIcon} />
                        <span>예시 문구</span>
                    </button>
                </div>

                <TextField
                    label="소제목"
                    placeholder="예: CLOSING"
                    value={closing.subtitle}
                    onChange={(e) => updateClosing({ subtitle: e.target.value })}
                />
                <TextField
                    label="제목"
                    placeholder="예: 저희의 시작을 함께해주셔서 감사합니다"
                    value={closing.title}
                    onChange={(e) => updateClosing({ title: e.target.value })}
                />
                <TextField
                    label="내용"
                    placeholder="감사의 마음을 담은 짧은 인사말"
                    value={closing.content}
                    onChange={(e) => updateClosing({ content: e.target.value })}
                    multiline
                    rows={3}
                />

                {/* Photo Upload */}
                <Field label="사진">
                    <div className={styles.optionWrapper}>
                        <ImageUploader
                            value={closing.imageUrl}
                            onChange={(url) => updateClosing({ imageUrl: url })}
                            placeholder="마무리 사진 추가"
                            ratio={closing.ratio}
                            onRatioChange={(val) => updateClosing({ ratio: val })}
                        />
                    </div>
                </Field>
            </div>

            {/* Sample Phrases Modal */}
            {isSampleModalOpen && (
                <ExampleSelectorModal
                    isOpen={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    title="마무리 문구 예시"
                    items={SAMPLE_PHRASES.map(s => ({
                        ...s,
                        content: s.content
                    }))}
                    onSelect={(item) => handleSelectSample(item)}
                />
            )}
        </AccordionItem>
    );
}
