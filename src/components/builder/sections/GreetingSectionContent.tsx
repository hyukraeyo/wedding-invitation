import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { TextField } from '@/components/common/TextField';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { ImageUploader } from '@/components/common/ImageUploader';
import RichTextEditor from '@/components/common/RichTextEditor';
import styles from './GreetingSection.module.scss';

export default function GreetingSectionContent() {
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
        <SectionContainer>
            <TextField
                label="소제목"
                type="text"
                value={greetingSubtitle}
                onChange={(e) => setGreetingSubtitle(e.target.value)}
                placeholder="예: INVITATION"
            />

            <TextField
                label="제목"
                type="text"
                value={greetingTitle}
                onChange={(e) => setGreetingTitle(e.target.value)}
                placeholder="예: 소중한 분들을 초대합니다"
            />

            <Field label="내용">
                <RichTextEditor
                    content={message}
                    onChange={setMessage}
                    placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                />
            </Field>

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
    );
}
