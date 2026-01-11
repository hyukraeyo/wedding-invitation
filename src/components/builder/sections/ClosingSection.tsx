import React from 'react';
import { Camera } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderField } from '../BuilderField';
import { ImageUploader } from '../ImageUploader';
import RichTextEditor from '@/components/common/RichTextEditor';
import { Section, Row } from '../BuilderLayout';
import styles from './ClosingSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const RECOMMENDED_TEXT = `<p>장담하건대, 세상이 다 겨울이어도<br>우리 사랑은 늘 봄처럼 따뜻하고<br>간혹, 여름처럼 뜨거울 겁니다.</p><p>이수동, 사랑가</p>`;

export default function ClosingSection({ isOpen, onToggle }: SectionProps) {
    const { closing, setClosing } = useInvitationStore();



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
                    <ImageUploader
                        value={closing.imageUrl}
                        onChange={(url) => setClosing({ imageUrl: url })}
                        placeholder="마무리 사진 추가"
                        ratio={closing.ratio}
                        onRatioChange={(val) => setClosing({ ratio: val })}
                    />
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



                {/* Content Editor */}
                <BuilderField
                    label={
                        <Row align="between" className={styles.contentHeader ?? ''}>
                            <span className={styles.contentLabel}>문구 내용</span>
                            <button
                                onClick={() => setClosing({ content: RECOMMENDED_TEXT })}
                                className={styles.recommendButton ?? ''}
                            >
                                <span>✨ 추천 문구 넣기</span>
                            </button>
                        </Row>
                    }
                >
                    <RichTextEditor
                        content={closing.content}
                        onChange={(content) => setClosing({ content })}
                        placeholder="마무리 문구를 입력하세요..."
                    />
                </BuilderField>
            </Section>
        </AccordionItem>
    );
}
