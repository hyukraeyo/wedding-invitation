import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';

import { isRequiredField } from '@/constants/requiredFields';
import { GREETING_SAMPLES } from '@/constants/samples';
import { htmlToPlainText } from '@/lib/richText';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';

import { ImageUploader } from '@/components/common/ImageUploader';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SampleList } from '@/components/common/SampleList';
import { SectionAccordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import styles from './GreetingSection.module.scss';

const RichTextEditor = dynamic(
  () => import('@/components/common/RichTextEditor').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: '160px',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.03)',
          borderRadius: '8px',
          animation: 'pulse 2s infinite',
        }}
      />
    ),
  }
);

export default function GreetingSection(props: SectionProps) {
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
    setGroomNameCustom,
    brideNameCustom,
    setBrideNameCustom,
    validationErrors,
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
      validationErrors: state.validationErrors,
    }))
  );

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const isComplete = Boolean(greetingTitle.trim() && htmlToPlainText(message));
  const isInvalid = validationErrors.includes(props.value);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setGreetingSubtitle(sample.subtitle || '');
    setGreetingTitle(sample.title);
    setMessage(sample.content || '');
    setIsSampleModalOpen(false);
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
    <>
      <SectionAccordion
        title={<RequiredSectionTitle title="인사말" isComplete={isComplete} />}
        value={props.value}
        isOpen={props.isOpen}
        onToggle={props.onToggle}
        isInvalid={isInvalid}
        rightElement={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsSampleModalOpen(true);
            }}
          >
            <Sparkles size={14} />
            추천 문구
          </Button>
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
                <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
              </FormHeader>
              <FormControl asChild>
                <TextField
                  id="greeting-title"
                  type="text"
                  required={isRequiredField('greetingTitle')}
                  value={greetingTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGreetingTitle(e.target.value)
                  }
                  placeholder="예: 소중한 분들을 초대해요"
                />
              </FormControl>
            </FormField>
          </div>

          <div className={styles.optionItem}>
            <FormField name="greeting-message">
              <FormHeader>
                <FormLabel>내용</FormLabel>
                <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
              </FormHeader>
              <RichTextEditor
                content={message}
                onChange={setMessage}
                placeholder="축하해주시는 분들께 전할 메시지를 입력해 주세요"
              />
              <FormControl asChild>
                <VisuallyHidden asChild>
                  <input
                    id="greeting-message-required"
                    aria-label="인사말 내용"
                    required={isRequiredField('greetingMessage')}
                    readOnly
                    value={htmlToPlainText(message)}
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
      </SectionAccordion>

      <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen} mobileBottomSheet>
        <Dialog.Header title="추천 문구" />
        <Dialog.Body>
          <SampleList items={GREETING_SAMPLES} onSelect={handleSelectSample} />
        </Dialog.Body>
      </Dialog>
    </>
  );
}
