import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), { ssr: false });
import { Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { TextField } from '@/components/ui/TextField';
import { List, ListRow } from '@/components/ui/List';
import { ImageUploader } from '@/components/common/ImageUploader';
import { HeaderAction } from '@/components/common/HeaderAction';
import { SampleList } from '@/components/ui/SampleList';
import styles from './ClosingSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { CLOSING_SAMPLES } from '@/constants/samples';

import { ResponsiveModal } from '@/components/common/ResponsiveModal';



export default function ClosingSection({ value }: SectionProps) {
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

    return (
        <>
            <AccordionItem value={value} autoScroll>
                <AccordionTrigger
                    action={
                        <HeaderAction
                            icon={Sparkles}
                            label="추천 문구"
                            onClick={() => setIsSampleModalOpen(true)}
                        />
                    }
                >
                    마무리
                </AccordionTrigger>
                <AccordionContent>
                    <List>
                        <ListRow
                            contents={
                                <TextField
                                    variant="line"
                                    label="소제목"
                                    placeholder="예: CLOSING"
                                    value={closing.subtitle}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateClosing({ subtitle: e.target.value })}
                                />
                            }
                        />
                        <ListRow
                            contents={
                                <TextField
                                    variant="line"
                                    label="제목"
                                    placeholder="예: 저희의 시작을 함께해주셔서 감사합니다"
                                    value={closing.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateClosing({ title: e.target.value })}
                                />
                            }
                        />

                        <ListRow
                            title="내용"
                            contents={
                                <RichTextEditor
                                    content={closing.content}
                                    onChange={(val: string) => updateClosing({ content: val })}
                                    placeholder="감사의 마음을 담은 짧은 인사말"
                                />
                            }
                        />

                        {/* Photo Upload */}
                        <ListRow
                            title="사진"
                            contents={
                                <div className={styles.optionWrapper}>
                                    <ImageUploader
                                        value={closing.imageUrl}
                                        onChange={(url) => updateClosing({ imageUrl: url })}
                                        placeholder="마무리 사진 추가"
                                        ratio={closing.ratio}
                                        onRatioChange={(val) => updateClosing({ ratio: val })}
                                    />
                                </div>
                            }
                        />
                    </List>
                </AccordionContent>
            </AccordionItem>

            {/* Sample Phrases Modal */}
            <ResponsiveModal
                open={isSampleModalOpen}
                onOpenChange={setIsSampleModalOpen}
                title="마무리 추천 문구"
                useScrollFade={true}
            >
                <SampleList
                    items={CLOSING_SAMPLES}
                    onSelect={handleSelectSample}
                />
            </ResponsiveModal>
        </>
    );
}
