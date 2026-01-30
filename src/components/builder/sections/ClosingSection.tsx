import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), { ssr: false });
import { Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BoardRow } from '@/components/ui/BoardRow';
import { TextField } from '@/components/ui/TextField';
import { List, ListRow } from '@/components/ui/List';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Button } from '@/components/ui/Button';
import { SampleList } from '@/components/common/SampleList';
import styles from './ClosingSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { CLOSING_SAMPLES } from '@/constants/samples';

import { ResponsiveModal } from '@/components/common/ResponsiveModal';



export default function ClosingSection(props: SectionProps) {
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
            <>
                <BoardRow
                    title="마무리"
                    isOpened={props.isOpen}
                    onOpen={() => props.onToggle?.(true)}
                    onClose={() => props.onToggle?.(false)}
                    icon={<BoardRow.ArrowIcon />}
                >
                    <List>
                        {/* Sample Trigger */}
                        <div className={styles.sampleBtnWrapper}>
                            <Button
                                className={styles.sampleBtn}
                                onClick={() => setIsSampleModalOpen(true)}
                            >
                                <Sparkles size={14} className={styles.sparkleIcon} />
                                <span>추천 문구</span>
                            </Button>
                        </div>

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
                                props.isOpen ? (
                                    <RichTextEditor
                                        content={closing.content}
                                        onChange={(val: string) => updateClosing({ content: val })}
                                        placeholder="감사의 마음을 담은 짧은 인사말"
                                    />
                                ) : null
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
                </BoardRow>

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
        </>
    );
}
