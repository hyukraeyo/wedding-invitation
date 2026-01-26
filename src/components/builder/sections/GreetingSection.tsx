import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), {
    ssr: false,
    loading: () => <div style={{ height: '160px', width: '100%', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
});

import { ResponsiveModal } from '@/components/common/ResponsiveModal';

import { InfoMessage } from '@/components/ui/InfoMessage';
import { SampleList } from '@/components/ui/SampleList';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { TextField } from '@/components/common/TextField';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { HeaderAction } from '@/components/common/HeaderAction';
import { ImageUploader } from '@/components/common/ImageUploader';
import styles from './GreetingSection.module.scss';
import { useShallow } from 'zustand/react/shallow';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { GREETING_SAMPLES } from '@/constants/samples';

export default function GreetingSection({ isOpen, value }: SectionProps) {
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

    return (
        <>
            <AccordionItem value={value} autoScroll>
                <AccordionTrigger
                    icon={MessageSquare}
                    action={
                        <HeaderAction
                            icon={Sparkles}
                            label="추천 문구"
                            onClick={() => {
                                setIsSampleModalOpen(true);
                            }}
                        />
                    }
                >
                    인사말
                </AccordionTrigger>
                <AccordionContent>
                    <SectionContainer>
                        {/* Subtitle */}
                        <TextField
                            label="소제목"
                            type="text"
                            value={greetingSubtitle}
                            onChange={(e) => setGreetingSubtitle(e.target.value)}
                            placeholder="예: INVITATION"
                        />

                        {/* Title */}
                        <TextField
                            label="제목"
                            type="text"
                            value={greetingTitle}
                            onChange={(e) => setGreetingTitle(e.target.value)}
                            placeholder="예: 소중한 분들을 초대합니다"
                        />

                        {/* Content */}
                        <Field label="내용">
                            {isOpen ? (
                                <RichTextEditor
                                    content={message}
                                    onChange={setMessage}
                                    placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                                />
                            ) : null}
                        </Field>

                        {/* Photo Upload */}
                        <Field label="사진">
                            <div className={styles.optionWrapper}>
                                <ImageUploader
                                    value={greetingImage}
                                    onChange={setGreetingImage}
                                    placeholder="인사말 사진 추가"
                                    ratio={greetingRatio}
                                    onRatioChange={(val) => setGreetingRatio(val)}
                                />
                            </div>
                        </Field>

                        {/* Name Options */}
                        <Field label="성함 표기">
                            <div className={styles.optionWrapper}>
                                <Tabs
                                    value={nameOptionValue}
                                    onValueChange={handleNameOptionChange}
                                >
                                    <TabsList fluid>
                                        <TabsTrigger value="bottom">하단 표기</TabsTrigger>
                                        <TabsTrigger value="custom">직접 입력</TabsTrigger>
                                        <TabsTrigger value="none">표시 안 함</TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                {enableFreeformNames ? (
                                    <div className={styles.optionWrapper}>
                                        <TextField
                                            label="신랑 측 표기"
                                            value={groomNameCustom}
                                            onChange={(e) => setGroomNameCustom(e.target.value)}
                                            placeholder="예: 아버지 홍길동 · 어머니 김철수 의 장남 길동"
                                        />
                                        <TextField
                                            label="신부 측 표기"
                                            value={brideNameCustom}
                                            onChange={(e) => setBrideNameCustom(e.target.value)}
                                            placeholder="예: 아버지 임걱정 · 어머니 박순이 의 장녀 순희"
                                        />
                                        <InfoMessage>
                                            기본 성함 표기 대신 사용자가 직접 작성한 문구로 성함을 표시합니다.
                                        </InfoMessage>
                                    </div>
                                ) : null}
                            </div>
                        </Field>
                    </SectionContainer>
                </AccordionContent>
            </AccordionItem>

            {/* Sample Phrases Modal */}
            <ResponsiveModal
                open={isSampleModalOpen}
                onOpenChange={setIsSampleModalOpen}
                title="인사말 추천 문구"
                useScrollFade={true}
            >
                <SampleList
                    items={GREETING_SAMPLES}
                    onSelect={handleSelectSample}
                />
            </ResponsiveModal>
        </>
    );
}
