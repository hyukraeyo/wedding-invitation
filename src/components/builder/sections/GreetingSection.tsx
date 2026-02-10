import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { GREETING_SAMPLES } from '@/constants/samples';
import { htmlToPlainText } from '@/lib/richText';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useBuilderSection, useBuilderField } from '@/hooks/useBuilder';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';

import { ImageUploader } from '@/components/common/ImageUploader';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { SectionHeadingFields } from '@/components/common/SectionHeadingFields';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';
import { EditorSection } from '@/components/ui/EditorSection';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
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

  const {
    value: subtitleValue,
    onChange: handleSubtitleChange,
    isInvalid: isSubtitleInvalid,
  } = useBuilderField({
    value: greetingSubtitle,
    onChange: setGreetingSubtitle,
    fieldName: 'greeting-subtitle',
  });

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
  } = useBuilderField({
    value: message,
    onChange: setMessage,
    fieldName: 'greeting-message',
  });

  // useMemo removed - simplified with inline props in SectionHeadingFields
  const plainMessageValue = React.useMemo(() => htmlToPlainText(messageValue), [messageValue]);
  const isComplete = Boolean(subtitleValue.trim() && titleValue.trim() && plainMessageValue);
  const { isInvalid: isSectionInvalid } = useBuilderSection(props.value, isComplete);

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
      <SectionHeadingFields
        prefix="greeting"
        subtitle={{
          value: subtitleValue,
          onChange: handleSubtitleChange,
          invalid: isSubtitleInvalid,
        }}
        title={{
          value: titleValue,
          onChange: handleTitleChange,
          invalid: isTitleInvalid,
        }}
        contentField={{
          control: <RichTextEditor content={messageValue} onChange={handleMessageChange} />,
          hiddenValue: plainMessageValue,
        }}
      />

      <FormField name="greeting-image">
        <FormLabel htmlFor="greeting-image">사진</FormLabel>
        <ImageUploader
          id="greeting-image"
          value={greetingImage}
          onChange={setGreetingImage}
          placeholder="인사말 사진 추가"
          ratio={greetingRatio}
          onRatioChange={(value) => setGreetingRatio(value as 'fixed' | 'auto')}
        />
      </FormField>

      <FormField name="greeting-names-option">
        <FormLabel>이름 표기</FormLabel>
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
      </FormField>
    </EditorSection>
  );
});

GreetingSection.displayName = 'GreetingSection';

export default GreetingSection;
