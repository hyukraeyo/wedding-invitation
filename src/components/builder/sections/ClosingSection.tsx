import React from 'react';
import { Heart } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Field } from '../Field';
import { ImageUploader } from '../ImageUploader';
import styles from './ClosingSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function ClosingSection({ isOpen, onToggle }: SectionProps) {
    const {
        closing, setClosing
    } = useInvitationStore();

    const updateClosing = (data: Partial<typeof closing>) => setClosing(data);

    return (
        <AccordionItem
            title="마무리"
            icon={Heart}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!closing.title}
        >
            <div className={styles.container}>
                {/* Titles */}
                <Field label="문구 설정">
                    <div className={styles.optionWrapper}>
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
                    </div>
                </Field>

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
        </AccordionItem>
    );
}
