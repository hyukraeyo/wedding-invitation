import React, { useState } from 'react';
import { MessageSquare, Sparkles, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import { BuilderField } from '../BuilderField';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderModal } from '@/components/common/BuilderModal';
import RichTextEditor from '@/components/common/RichTextEditor';
import { ImageUploader } from '../ImageUploader';
import { Section, Stack, Row, Card } from '../BuilderLayout';
import commonStyles from '../Builder.module.scss';
import styles from './GreetingSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const GREETING_SAMPLES = [
    {
        subtitle: 'INVITATION',
        title: '소중한 분들을 초대합니다',
        message: '<p>저희 두 사람의 작은 만남이<br>사랑의 결실을 이루어<br>소중한 결혼식을 올리게 되었습니다.</p><p>평생 서로 귀하게 여기며<br>첫 마음 그대로 존중하고 배려하며 살겠습니다.</p><p>오로지 믿음과 사랑을 약속하는 날<br>오셔서 축복해 주시면 더 없는 기쁨으로<br>간직하겠습니다.</p>'
    },
    {
        subtitle: 'Our Wedding',
        title: '함께 걸어가는 길',
        message: '<p>서로의 빛이 되어<br>평생을 함께 걸어가겠습니다.</p><p>저희 두 사람의 시작을<br>축복해 주시면 감사하겠습니다.</p><p>바쁘시더라도 부디 오셔서<br>저희의 앞날을 지켜봐 주시면<br>더할 나위 없는 영광이겠습니다.</p>'
    },
    {
        subtitle: 'Hello & Welcome',
        title: '초대합니다',
        message: '<p>곁에 있을 때 가장 나다운 모습이 되게 하는 사람<br>꿈을 꾸게 하고 그 꿈을 함께 나누는 사람<br>그런 사람을 만나 이제 하나가 되려 합니다.</p><p>저희의 뜻깊은 시작을 함께 나누어 주시고<br>따뜻한 마음으로 축복해 주시면 감사하겠습니다.</p>'
    },
    {
        subtitle: 'The Marriage',
        title: '저희의 시작을 함께해주세요',
        message: '<p>오랜 시간 서로를 지켜온<br>두 사람이 이제 부부의 연을 맺습니다.</p><p>언제나 지금 이 마음 잊지 않고<br>서로를 아끼고 보듬으며 예쁘게 살겠습니다.</p><p>저희의 행복한 시작을 축복해 주시면<br>더 없는 기쁨으로 간직하겠습니다.</p>'
    },
    {
        subtitle: 'Love Story',
        title: '두 사람이 하나가 됩니다',
        message: '<p>각자 다른 공간에서 지내온 저희 두 사람이<br>이제는 한 곳을 바라보며 나아가려 합니다.</p><p>서로를 깊이 신뢰하고 사랑하는 마음으로<br>이 자리에 섰습니다.</p><p>저희의 복된 앞날을 함께 지켜봐 주시고<br>따뜻한 격려 부탁드립니다.</p>'
    },
    {
        subtitle: 'Save the Date',
        title: '약속합니다',
        message: '<p>기쁠 때나 슬플 때나 언제나 함께하며<br>서로의 버팀목이 되겠습니다.</p><p>서로가 서로에게 선물이 되는<br>그런 인연으로 살아가겠습니다.</p><p>귀한 걸음 하시어 저희의 앞날을<br>축복해 주시면 감사하겠습니다.</p>'
    }
];

export default function GreetingSection({ isOpen, onToggle }: SectionProps) {
    const {
        greetingTitle, setGreetingTitle,
        greetingSubtitle, setGreetingSubtitle,
        message, setMessage,
        greetingImage, setGreetingImage,
        greetingRatio, setGreetingRatio,
        showNamesAtBottom, setShowNamesAtBottom,
        enableFreeformNames, setEnableFreeformNames,
        groomNameCustom, setGroomNameCustom
    } = useInvitationStore();

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    return (
        <AccordionItem
            title="인사말"
            icon={MessageSquare}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={message.length > 0}
        >
            <Section>
                {/* Header: Sample Phrases Button */}
                <Row align="end">
                    <button
                        onClick={() => setIsSampleModalOpen(true)}
                        className={styles.exampleButton ?? ''}
                    >
                        <Sparkles size={14} className={styles.sparkle ?? ''} />
                        <span>예시 문구</span>
                    </button>
                </Row>

                {/* Subtitle */}
                <BuilderField label="상단 소제목">
                    <BuilderInput
                        type="text"
                        value={greetingSubtitle}
                        onChange={(e) => setGreetingSubtitle(e.target.value)}
                        placeholder="예: INVITATION"
                    />
                </BuilderField>

                {/* Title */}
                <BuilderField label="제목">
                    <BuilderInput
                        type="text"
                        value={greetingTitle}
                        onChange={(e) => setGreetingTitle(e.target.value)}
                        placeholder="예: 소중한 분들을 초대합니다"
                    />
                </BuilderField>

                {/* Content */}
                <BuilderField label="내용">
                    <RichTextEditor
                        content={message}
                        onChange={setMessage}
                        placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                    />
                </BuilderField>

                {/* Photo Upload */}
                <BuilderField label="사진">
                    <Stack gap="md">
                        <ImageUploader
                            value={greetingImage}
                            onChange={setGreetingImage}
                            placeholder="인사말 사진 추가"
                        />
                        {greetingImage && (
                            <BuilderButtonGroup
                                value={greetingRatio}
                                options={[
                                    { label: '고정 (기본)', value: 'fixed' },
                                    { label: '자동 (원본 비율)', value: 'auto' },
                                ]}
                                onChange={(val: 'fixed' | 'auto') => setGreetingRatio(val)}
                            />
                        )}
                    </Stack>
                </BuilderField>

                {/* Name Options */}
                <BuilderField label="성함 표기">
                    <Stack gap="md">
                        <Stack gap="sm">
                            <label className={commonStyles.radioLabel}>
                                <input
                                    type="radio"
                                    name="greeting-name-type"
                                    className={commonStyles.radio}
                                    checked={!showNamesAtBottom && !enableFreeformNames}
                                    onChange={() => {
                                        setShowNamesAtBottom(false);
                                        setEnableFreeformNames(false);
                                    }}
                                />
                                <span className={commonStyles.text}>표시 안 함</span>
                            </label>
                            <label className={commonStyles.radioLabel}>
                                <input
                                    type="radio"
                                    name="greeting-name-type"
                                    className={commonStyles.radio}
                                    checked={showNamesAtBottom}
                                    onChange={() => {
                                        setShowNamesAtBottom(true);
                                        setEnableFreeformNames(false);
                                    }}
                                />
                                <span className={commonStyles.text}>인사말 하단에 신랑신부&혼주 성함 표시</span>
                            </label>
                            <label className={commonStyles.radioLabel}>
                                <input
                                    type="radio"
                                    name="greeting-name-type"
                                    className={commonStyles.radio}
                                    checked={enableFreeformNames}
                                    onChange={() => {
                                        setShowNamesAtBottom(false);
                                        setEnableFreeformNames(true);
                                    }}
                                />
                                <span className={commonStyles.text}>성함 자유 입력</span>
                            </label>
                        </Stack>

                        {enableFreeformNames && (
                            <Stack gap="sm">
                                <RichTextEditor
                                    content={groomNameCustom}
                                    onChange={setGroomNameCustom}
                                    placeholder="신랑측 혼주 성함 신랑 이름&#10;신부측 혼주 성함 신부 이름"
                                />
                                <div className={commonStyles.notice}>
                                    <Info size={14} className={commonStyles.icon} />
                                    <span>인사말 하단 성함부분을 자유롭게 입력할 수 있습니다.</span>
                                </div>
                            </Stack>
                        )}
                    </Stack>
                </BuilderField>

                {/* Sample Phrases Modal */}
                <BuilderModal
                    isOpen={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    title="샘플 문구"
                >
                    <div className={styles.modalGrid ?? ''}>
                        {GREETING_SAMPLES.map((sample, idx) => (
                            <Card
                                key={idx}
                                hoverable
                                className={styles.sampleCard ?? ''}
                            >
                                <button
                                    onClick={() => {
                                        setGreetingSubtitle(sample.subtitle);
                                        setGreetingTitle(sample.title);
                                        setMessage(sample.message);
                                        setIsSampleModalOpen(false);
                                    }}
                                    className={styles.sampleButton ?? ''}
                                >
                                    <div className={styles.sampleSubtitle ?? ''}>{sample.subtitle}</div>
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
