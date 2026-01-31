import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor').then(mod => mod.RichTextEditor), {
    ssr: false,
    loading: () => <div style={{ height: '160px', width: '100%', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
});

import { InfoMessage } from '@/components/ui/InfoMessage';
import { SampleList } from '@/components/common/SampleList';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Button } from '@/components/ui/Button';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { ImageUploader } from '@/components/common/ImageUploader';
import styles from './GreetingSection.module.scss';
import { useShallow } from 'zustand/react/shallow';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { GREETING_SAMPLES } from '@/constants/samples';
import { SectionAccordion } from '@/components/ui/Accordion';
import { Dialog } from '@/components/ui/Dialog';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function GreetingSection(props: SectionProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const {
        message,
        setMessage,
        greetingTitle,
        setGreetingTitle,
        greetingSubtitle,
        setGreetingSubtitle,
        greetingImage,
        setGreetingImage,
        greetingRatio,
        setGreetingRatio,
        showNamesAtBottom,
        setShowNamesAtBottom,
        enableFreeformNames,
        setEnableFreeformNames,
        groomNameCustom,
        setGroomNameCustom,
        brideNameCustom,
        setBrideNameCustom,
    } = useInvitationStore(useShallow((state) => ({
        message: state.message,
        setMessage: state.setMessage,
        greetingTitle: state.greetingTitle,
        setGreetingTitle: state.setGreetingTitle,
        greetingSubtitle: state.greetingSubtitle,
        setGreetingSubtitle: state.setGreetingSubtitle,
        greetingImage: state.greetingImage,
        setGreetingImage: state.setGreetingImage,
        greetingRatio: state.greetingRatio,
        setGreetingRatio: state.setGreetingRatio,
        showNamesAtBottom: state.showNamesAtBottom,
        setShowNamesAtBottom: state.setShowNamesAtBottom,
        enableFreeformNames: state.enableFreeformNames,
        setEnableFreeformNames: state.setEnableFreeformNames,
        groomNameCustom: state.groomNameCustom,
        setGroomNameCustom: state.setGroomNameCustom,
        brideNameCustom: state.brideNameCustom,
        setBrideNameCustom: state.setBrideNameCustom,
    })));

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const handleSelectSample = (sample: SamplePhraseItem) => {
        setGreetingSubtitle(sample.subtitle || '');
        setGreetingTitle(sample.title);
        setMessage(sample.content);
        setIsSampleModalOpen(false);
    };

    const nameOptionValue = enableFreeformNames ? 'custom' : (showNamesAtBottom ? 'bottom' : 'none');

    const handleNameOptionChange = (val: string) => {
        if (val === 'custom') {
            setEnableFreeformNames(true);
            setShowNamesAtBottom(false);
        } else if (val === 'bottom') {
            setEnableFreeformNames(false);
            setShowNamesAtBottom(true);
        } else {
            setEnableFreeformNames(false);
            setShowNamesAtBottom(false);
        }
    };

    const renderSampleList = () => (
        <SampleList
            items={GREETING_SAMPLES}
            onSelect={handleSelectSample}
        />
    );

    return (
        <>
            <SectionAccordion
                title="인사말"
                value="greeting"
                isOpen={props.isOpen}
                onToggle={props.onToggle}
            >
                <div className={styles.container}>
                    <div style={{ padding: '0 0 12px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>추천 문구</span>
                        <Button
                            type="button"
                            variant="weak"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSampleModalOpen(true);
                            }}
                        >
                            <Sparkles size={14} style={{ marginRight: '4px' }} />
                            <span>선택하기</span>
                        </Button>
                    </div>

                    <div className={styles.optionItem}>
                        <TextField
                            variant="line"
                            label="소제목"
                            type="text"
                            value={greetingSubtitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGreetingSubtitle(e.target.value)}
                            placeholder="예: INVITATION"
                        />
                    </div>

                    <div className={styles.optionItem}>
                        <TextField
                            variant="line"
                            label="제목"
                            type="text"
                            value={greetingTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGreetingTitle(e.target.value)}
                            placeholder="예: 소중한 분들을 초대합니다"
                        />
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.rowTitle}>내용</div>
                        {props.isOpen ? (
                            <RichTextEditor
                                content={message}
                                onChange={setMessage}
                                placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                            />
                        ) : null}
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.rowTitle}>사진</div>
                        <div className={styles.optionWrapper}>
                            <ImageUploader
                                value={greetingImage}
                                onChange={setGreetingImage}
                                placeholder="인사말 사진 추가"
                                ratio={greetingRatio}
                                onRatioChange={(val) => setGreetingRatio(val)}
                            />
                        </div>
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.rowTitle}>이름 표기</div>
                        <div className={styles.optionWrapper}>
                            <SegmentedControl
                                alignment="fluid"
                                value={nameOptionValue}
                                onChange={(val: string) => handleNameOptionChange(val)}
                            >
                                <SegmentedControl.Item value="bottom">
                                    하단 표기
                                </SegmentedControl.Item>
                                <SegmentedControl.Item value="custom">
                                    직접 입력
                                </SegmentedControl.Item>
                                <SegmentedControl.Item value="none">
                                    표시 안 함
                                </SegmentedControl.Item>
                            </SegmentedControl>

                            {enableFreeformNames && (
                                <div className={styles.nameForm}>
                                    <TextField
                                        variant="line"
                                        label="신랑 측 표기"
                                        value={groomNameCustom}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroomNameCustom(e.target.value)}
                                        placeholder="예: 아버지 홍길동 · 어머니 김철수 의 장남 길동"
                                    />
                                    <TextField
                                        variant="line"
                                        label="신부 측 표기"
                                        value={brideNameCustom}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrideNameCustom(e.target.value)}
                                        placeholder="예: 아버지 임걱정 · 어머니 박순이 의 장녀 순희"
                                    />
                                    <InfoMessage>
                                        기본 이름 표기 대신 사용자가 직접 작성한 문구로 이름을 표시합니다.
                                    </InfoMessage>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SectionAccordion>

            {isDesktop ? (
                <Dialog
                    open={isSampleModalOpen}
                    onOpenChange={setIsSampleModalOpen}
                >
                    <Dialog.Overlay />
                    <Dialog.Content>
                        <Dialog.Header title="인사말 추천 문구" />
                        <Dialog.Body>
                            {renderSampleList()}
                        </Dialog.Body>
                        <Dialog.Footer>

                            <BottomCTA.Single
                                fixed={false}
                                onClick={() => setIsSampleModalOpen(false)}
                            >
                                닫기
                            </BottomCTA.Single>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog >
            ) : (
                <BottomSheet
                    open={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    header="인사말 추천 문구"
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
