import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/ui/RichTextEditor').then((mod) => mod.RichTextEditor),
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

import { InfoMessage } from '@/components/ui/InfoMessage';
import { SampleList } from '@/components/common/SampleList';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/common/ImageUploader';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import styles from './GreetingSection.module.scss';
import { useShallow } from 'zustand/react/shallow';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { GREETING_SAMPLES } from '@/constants/samples';
import { SectionAccordion } from '@/components/ui/Accordion';
import { Dialog } from '@/components/ui/Dialog';

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

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setGreetingSubtitle(sample.subtitle || '');
    setGreetingTitle(sample.title);
    setMessage(sample.content || '');
    setIsSampleModalOpen(false);
  };

  const nameOptionValue = enableFreeformNames ? 'custom' : showNamesAtBottom ? 'bottom' : 'none';

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
    <SampleList items={GREETING_SAMPLES} onSelect={handleSelectSample} />
  );

  return (
    <>
      <SectionAccordion
        title="인사말"
        value="greeting"
        isOpen={props.isOpen}
        onToggle={props.onToggle}
        rightElement={
          <Button
            type="button"
            variant="weak"
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
              <FormLabel htmlFor="greeting-title">제목</FormLabel>
              <FormControl asChild>
                <TextField
                  id="greeting-title"
                  type="text"
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
            <div className={styles.rowTitle}>내용</div>
            <RichTextEditor
              content={message}
              onChange={setMessage}
              placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
            />
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
                <SegmentedControl.Item value="bottom">하단 표기</SegmentedControl.Item>
                <SegmentedControl.Item value="custom">직접 입력</SegmentedControl.Item>
                <SegmentedControl.Item value="none">표시 안 함</SegmentedControl.Item>
              </SegmentedControl>

              {enableFreeformNames && (
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
                        placeholder="예: 아버지 홍길동 · 어머니 김철수 의 장남 길동"
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
                        placeholder="예: 아버지 임걱정 · 어머니 박순이 의 장녀 순희"
                      />
                    </FormControl>
                  </FormField>
                  <InfoMessage>
                    기본 이름 표기 대신 사용자가 직접 작성한 문구로 이름을 표시해요.
                  </InfoMessage>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionAccordion>

      <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen} mobileBottomSheet>
        <Dialog.Header title="추천 문구" />
        <Dialog.Body>{renderSampleList()}</Dialog.Body>
      </Dialog>
    </>
  );
}
