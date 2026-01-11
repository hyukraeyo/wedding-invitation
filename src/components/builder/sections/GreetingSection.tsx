import React, { useState } from 'react';
import { MessageSquare, Sparkles, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Field } from '../Field';
import { Checkbox } from '../Checkbox';
import { BuilderModal } from '@/components/common/BuilderModal';
import RichTextEditor from '@/components/common/RichTextEditor';
import { ImageUploader } from '../ImageUploader';
import styles from './GreetingSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
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

export default function GreetingSection({ isOpen, onToggle }: SectionProps) {
    const {
        message, setMessage,
        greetingTitle, setGreetingTitle,
        greetingSubtitle, setGreetingSubtitle,
        greetingImage, setGreetingImage,
        greetingRatio, setGreetingRatio,
        showNamesAtBottom, setShowNamesAtBottom,
        enableFreeformNames, setEnableFreeformNames,
        groomNameCustom, setGroomNameCustom,
        brideNameCustom, setBrideNameCustom
    } = useInvitationStore();

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    const handleSelectSample = (sample: typeof SAMPLE_PHRASES[0]) => {
        setGreetingSubtitle(sample.subtitle);
        setGreetingTitle(sample.title);
        setMessage(sample.message);
        setIsSampleModalOpen(false);
    };

    return (
        <AccordionItem
            title="인사말"
            icon={MessageSquare}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={message.length > 0}
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

                {/* Subtitle */}
                <Field label="상단 소제목">
                    <TextField
                        type="text"
                        value={greetingSubtitle}
                        onChange={(e) => setGreetingSubtitle(e.target.value)}
                        placeholder="예: INVITATION"
                    />
                </Field>

                {/* Title */}
                <Field label="제목">
                    <TextField
                        type="text"
                        value={greetingTitle}
                        onChange={(e) => setGreetingTitle(e.target.value)}
                        placeholder="예: 소중한 분들을 초대합니다"
                    />
                </Field>

                {/* Content */}
                <Field label="내용">
                    <RichTextEditor
                        content={message}
                        onChange={setMessage}
                        placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                    />
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
                        <div className={styles.checkboxGroup}>
                            <Checkbox
                                id="show-names-bottom"
                                checked={showNamesAtBottom}
                                onChange={(checked) => {
                                    setShowNamesAtBottom(checked);
                                    if (checked) setEnableFreeformNames(false);
                                }}
                            >
                                인사말 하단에 성함 노출
                            </Checkbox>
                            <Checkbox
                                id="enable-freeform-names"
                                checked={enableFreeformNames}
                                onChange={(checked) => {
                                    setEnableFreeformNames(checked);
                                    if (checked) setShowNamesAtBottom(false);
                                }}
                            >
                                직접 입력 사용
                            </Checkbox>
                            <Checkbox
                                id="hide-names"
                                checked={!showNamesAtBottom && !enableFreeformNames}
                                onChange={(checked) => {
                                    if (checked) {
                                        setShowNamesAtBottom(false);
                                        setEnableFreeformNames(false);
                                    }
                                }}
                            >
                                표시 안 함
                            </Checkbox>
                        </div>

                        {enableFreeformNames && (
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
                                <div className={styles.freeformInfo}>
                                    <Info size={14} className={styles.infoIcon} />
                                    <span>기본 성함 표기 대신 사용자가 직접 작성한 문구로 성함을 표시합니다.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Field>
            </div>

            {/* Sample Phrases Modal */}
            <BuilderModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                title="인사말 예시 문구"
            >
                <div className={styles.sampleList}>
                    {SAMPLE_PHRASES.map((sample, idx) => (
                        <button
                            key={idx}
                            className={styles.sampleCard}
                            onClick={() => handleSelectSample(sample)}
                        >
                            <div className={styles.sampleHeader}>
                                <span className={styles.sampleBadge}>예시 {idx + 1}</span>
                                <span className={styles.sampleTitle}>{sample.title}</span>
                            </div>
                            <div
                                className={styles.sampleContent}
                                dangerouslySetInnerHTML={{ __html: sample.message }}
                            />
                        </button>
                    ))}
                </div>
            </BuilderModal>
        </AccordionItem>
    );
}
