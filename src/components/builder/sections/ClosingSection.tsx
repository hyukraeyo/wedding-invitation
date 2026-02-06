import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/common/RichTextEditor').then((mod) => mod.RichTextEditor),
  { ssr: false }
);
import { Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { ImageUploader } from '@/components/common/ImageUploader';
import { SampleList } from '@/components/common/SampleList';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';

import styles from './ClosingSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { CLOSING_SAMPLES } from '@/constants/samples';
import { SectionAccordion } from '@/components/ui/Accordion';

export default function ClosingSection(props: SectionProps) {
  const closing = useInvitationStore(useShallow((state) => state.closing));
  const setClosing = useInvitationStore((state) => state.setClosing);

  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const updateClosing = (data: Partial<typeof closing>) => setClosing(data);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    updateClosing({
      subtitle: sample.subtitle || '',
      title: sample.title,
      content: sample.content || '',
    });
    setIsSampleModalOpen(false);
  };

  const renderSampleList = () => (
    <SampleList items={CLOSING_SAMPLES} onSelect={handleSelectSample} />
  );

  return (
    <>
      <SectionAccordion
        title="마무리"
        value="closing"
        isOpen={props.isOpen}
        onToggle={props.onToggle}
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
            <FormField name="closing-subtitle">
              <FormLabel htmlFor="closing-subtitle">소제목</FormLabel>
              <FormControl asChild>
                <TextField
                  id="closing-subtitle"
                  placeholder="예: CLOSING"
                  value={closing.subtitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateClosing({ subtitle: e.target.value })
                  }
                />
              </FormControl>
            </FormField>
          </div>
          <div className={styles.optionItem}>
            <FormField name="closing-title">
              <FormLabel htmlFor="closing-title">제목</FormLabel>
              <FormControl asChild>
                <TextField
                  id="closing-title"
                  placeholder="예: 저희의 시작을 함께해주셔서 감사해요"
                  value={closing.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateClosing({ title: e.target.value })
                  }
                />
              </FormControl>
            </FormField>
          </div>

          <div className={styles.optionItem}>
            <div className={styles.rowTitle}>내용</div>
            {props.isOpen ? (
              <RichTextEditor
                content={closing.content}
                onChange={(val: string) => updateClosing({ content: val })}
                placeholder="감사의 마음을 담은 짧은 인사말"
              />
            ) : null}
          </div>

          <div className={styles.optionItem}>
            <div className={styles.rowTitle}>사진</div>
            <div className={styles.optionWrapper}>
              <ImageUploader
                value={closing.imageUrl}
                onChange={(url) => updateClosing({ imageUrl: url })}
                placeholder="마무리 사진 추가"
                ratio={closing.ratio}
                onRatioChange={(val) => updateClosing({ ratio: val as 'fixed' | 'auto' })}
              />
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
