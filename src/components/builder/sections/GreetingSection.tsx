import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import RichTextEditor from '@/components/common/RichTextEditor';
import dynamic from 'next/dynamic';
const ExampleSelectorModal = dynamic(() => import('@/components/common/ExampleSelectorModal').then(mod => mod.ExampleSelectorModal), {
    ssr: false
});
import type { ExampleItem } from '@/components/common/ExampleSelectorModal';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { TextField } from '@/components/common/TextField';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { HeaderAction } from '@/components/common/HeaderAction';
import { ImageUploader } from '@/components/common/ImageUploader';
import styles from './GreetingSection.module.scss';
import { useShallow } from 'zustand/shallow';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

const SAMPLE_PHRASES = [
    {
        subtitle: 'Hello & Welcome',
        title: '초대합니다',
        message: '<p>곁에 있을 때 가장 나다운 모습이 되게 하는 사람<br>꿈을 꾸게 하고 그 꿈을 함께 나누는 사람<br>그런 사람을 만나 이제 하나가 되려 합니다.</p><p>저희의 뜻깊은 시작을 함께 나누어 주시고<br>따뜻한 마음으로 축복해 주시면 감사하겠습니다.</p>'
    },
    {
        subtitle: 'The Marriage',
        title: '소중한 분들을 초대합니다',
        message: '<p>함께 있으면 기분이 좋아지는 사람을 만났습니다.<br>이제 그 사람과 함께 인생의 먼 길을 떠나려 합니다.</p><p>저희의 앞날을 축복해 주시는 소중한 마음 잊지 않고<br>예쁘게 잘 살겠습니다.</p>'
    },
    {
        subtitle: 'Our Wedding Day',
        title: '저희 결혼합니다',
        message: '<p>서로가 마주 보며 다져온 사랑을<br>이제 함께 한 곳을 바라보며 걸어가려 합니다.</p><p>새로운 인생의 출발점에 선 저희 두 사람,<br>격려와 축복으로 함께해 주시면 큰 기쁨이겠습니다.</p>'
    }
];

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

    const handleSelectSample = (sample: typeof SAMPLE_PHRASES[0]) => {
        setGreetingSubtitle(sample.subtitle);
        setGreetingTitle(sample.title);
        setMessage(sample.message);
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
            <AccordionItem
                value={value}
                title="인사말"
                icon={MessageSquare}
                isOpen={isOpen}
                isCompleted={message.length > 0}
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
                            <SegmentedControl
                                value={nameOptionValue}
                                onChange={handleNameOptionChange}
                                options={[
                                    { label: '하단 표기', value: 'bottom' },
                                    { label: '직접 입력', value: 'custom' },
                                    { label: '표시 안 함', value: 'none' },
                                ]}
                            />

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

            </AccordionItem>

            {/* Sample Phrases Modal */}
            <ExampleSelectorModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                title="인사말 추천 문구"
                items={SAMPLE_PHRASES.map(s => ({
                    ...s,
                    content: s.message // Map message to content for the generic component
                }))}
                onSelect={(item: ExampleItem) => handleSelectSample(item as unknown as typeof SAMPLE_PHRASES[0])}
            />
        </>
    );
}
