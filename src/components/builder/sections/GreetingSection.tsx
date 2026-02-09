import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { isRequiredField } from '@/constants/requiredFields';
import { GREETING_SAMPLES } from '@/constants/samples';
import { htmlToPlainText } from '@/lib/richText';
import { isBlank } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useBuilderSection, useBuilderField } from '@/hooks/useBuilder';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';

import { ImageUploader } from '@/components/common/ImageUploader';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';
import { EditorSection } from '@/components/ui/EditorSection';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import styles from './GreetingSection.module.scss';

const GreetingSection = React.memo<SectionProps>(function GreetingSection(props) {
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
  } = useInvitationStore(
    useShallow((state) => ({
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
    }))
  );

  const isComplete = Boolean(greetingTitle.trim() && htmlToPlainText(message));
  const { isInvalid: isSectionInvalid } = useBuilderSection(props.value, isComplete);

  const {
    value: titleValue,
    onChange: handleTitleChange,
    isInvalid: isTitleInvalid,
  } = useBuilderField({
    value: greetingTitle,
    onChange: setGreetingTitle,
    fieldName: 'greeting-title',
  });

  const {
    value: messageValue,
    onValueChange: handleMessageChange,
    isInvalid: isMessageInvalid,
  } = useBuilderField({
    value: message,
    onChange: setMessage,
    fieldName: 'greeting-message',
  });

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setGreetingSubtitle(sample.subtitle || '');
    setGreetingTitle(sample.title);
    setMessage(sample.content || '');
  };

  const nameOptionValue = enableFreeformNames ? 'custom' : showNamesAtBottom ? 'bottom' : 'none';

  const handleNameOptionChange = (value: string) => {
    if (value === 'custom') {
      setEnableFreeformNames(true);
      setShowNamesAtBottom(false);
      return;
    }

    if (value === 'bottom') {
      setEnableFreeformNames(false);
      setShowNamesAtBottom(true);
      return;
    }

    setEnableFreeformNames(false);
    setShowNamesAtBottom(false);
  };

  return (
    <EditorSection
      title={<RequiredSectionTitle title="인사말" isComplete={isComplete} />}
      isInvalid={isSectionInvalid}
      rightElement={
        <SectionSampleDialogAction items={GREETING_SAMPLES} onSelect={handleSelectSample} />
      }
    >
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <FormField name="greeting-subtitle">
            <FormLabel htmlFor="greeting-subtitle">소제목</FormLabel>
            <FormControl asChild>
              <TextField
                id="greeting-subtitle"
                type="text"
                value={greetingSubtitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setGreetingSubtitle(e.target.value)
                }
                placeholder="예: INVITATION"
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="greeting-title">
            <FormHeader>
              <FormLabel htmlFor="greeting-title">제목</FormLabel>
              <FormMessage forceMatch={isTitleInvalid && isBlank(titleValue)}>
                필수 항목이에요.
              </FormMessage>
            </FormHeader>
            <FormControl asChild>
              <TextField
                id="greeting-title"
                type="text"
                required={isRequiredField('greetingTitle')}
                value={titleValue}
                onChange={handleTitleChange}
                placeholder="예: 소중한 분들을 초대해요"
                invalid={isTitleInvalid}
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="greeting-message">
            <FormHeader>
              <FormLabel htmlFor="greeting-message-required">내용</FormLabel>
              <FormMessage forceMatch={isMessageInvalid && isBlank(htmlToPlainText(messageValue))}>
                필수 항목이에요.
              </FormMessage>
            </FormHeader>
            <RichTextEditor
              content={messageValue}
              onChange={handleMessageChange}
              placeholder="축하해주시는 분들께 전할 메시지를 입력해 주세요"
            />
            <FormControl asChild>
              <VisuallyHidden asChild>
                <input
                  id="greeting-message-required"
                  aria-label="인사말 내용"
                  required={isRequiredField('greetingMessage')}
                  readOnly
                  value={htmlToPlainText(messageValue)}
                />
              </VisuallyHidden>
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>사진</div>
          <div className={styles.optionWrapper}>
            <ImageUploader
              value={greetingImage}
              onChange={setGreetingImage}
              placeholder="인사말 사진 추가"
              ratio={greetingRatio}
              onRatioChange={(value) => setGreetingRatio(value as 'fixed' | 'auto')}
            />
          </div>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>이름 표기</div>
          <div className={styles.optionWrapper}>
            <SegmentedControl
              alignment="fluid"
              value={nameOptionValue}
              onChange={handleNameOptionChange}
            >
              <SegmentedControl.Item value="bottom">하단 표기</SegmentedControl.Item>
              <SegmentedControl.Item value="custom">직접 입력</SegmentedControl.Item>
              <SegmentedControl.Item value="none">표시 안함</SegmentedControl.Item>
            </SegmentedControl>

            {enableFreeformNames ? (
              <div className={styles.nameForm}>
                <FormField name="groom-name-custom">
                  <FormLabel htmlFor="groom-name-custom">신랑 측 표기</FormLabel>
                  <FormControl asChild>
                    <TextField
                      id="groom-name-custom"
                      value={groomNameCustom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setGroomNameCustom(e.target.value)
                      }
                      placeholder="예: 신랑 아버지 홍길동 · 어머니 김영희 · 아들 홍민수"
                    />
                  </FormControl>
                </FormField>
                <FormField name="bride-name-custom">
                  <FormLabel htmlFor="bride-name-custom">신부 측 표기</FormLabel>
                  <FormControl asChild>
                    <TextField
                      id="bride-name-custom"
                      value={brideNameCustom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBrideNameCustom(e.target.value)
                      }
                      placeholder="예: 신부 아버지 박정호 · 어머니 최은영 · 딸 박서윤"
                    />
                  </FormControl>
                </FormField>
                <InfoMessage>
                  기본 이름 표기 대신 직접 작성한 문구로 이름을 표시할 수 있어요.
                </InfoMessage>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </EditorSection>
  );
});

GreetingSection.displayName = 'GreetingSection';

export default GreetingSection;
