import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { RichTextEditor } from '@/components/common/RichTextEditor';
import { SectionHeadingFields } from '@/components/common/SectionHeadingFields';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useBuilderSection } from '@/hooks/useBuilder';
import { ImageUploader } from '@/components/common/ImageUploader';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';
import { FormField, FormLabel } from '@/components/ui/Form';
import { htmlToPlainText } from '@/lib/richText';
import { isBlank } from '@/lib/utils';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { CLOSING_SAMPLES } from '@/constants/samples';
import { EditorSection } from '@/components/ui/EditorSection';

export default function ClosingSection(props: SectionProps) {
  const { closing } = useInvitationStore(
    useShallow((state) => ({
      closing: state.closing,
    }))
  );
  const setClosing = useInvitationStore((state) => state.setClosing);

  const updateClosing = (data: Partial<typeof closing>) => setClosing(data);
  const isOpen = props.isOpen ?? true;

  const plainContent = useMemo(() => htmlToPlainText(closing.content), [closing.content]);
  const isComplete = Boolean(
    !isBlank(closing.title) && !isBlank(closing.subtitle) && !isBlank(plainContent)
  );
  const { isInvalid } = useBuilderSection(props.value, isComplete);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    updateClosing({
      subtitle: sample.subtitle || '',
      title: sample.title,
      content: sample.content || '',
    });
  };

  return (
    <EditorSection
      title="마무리"
      isInvalid={isInvalid}
      rightElement={
        <SectionSampleDialogAction items={CLOSING_SAMPLES} onSelect={handleSelectSample} />
      }
    >
      <SectionHeadingFields
        prefix="closing"
        subtitle={{
          value: closing.subtitle,
          onValueChange: (val) => updateClosing({ subtitle: val }),
          placeholder: '예: CLOSING',
        }}
        title={{
          value: closing.title,
          onValueChange: (val) => updateClosing({ title: val }),
          placeholder: '예: 저희의 시작을 함께해주셔서 감사해요',
        }}
        contentField={{
          control: isOpen ? (
            <RichTextEditor
              content={closing.content}
              onChange={(val: string) => updateClosing({ content: val })}
              placeholder="감사의 마음을 담은 짧은 인사말"
            />
          ) : null,
          hiddenValue: plainContent,
        }}
      />

      <FormField name="closing-image">
        <FormLabel htmlFor="closing-image">사진</FormLabel>
        <ImageUploader
          id="closing-image"
          value={closing.imageUrl}
          onChange={(url) => updateClosing({ imageUrl: url })}
          placeholder="마무리 사진 추가"
          ratio={closing.ratio}
          onRatioChange={(val) => updateClosing({ ratio: val as 'fixed' | 'auto' })}
        />
      </FormField>
    </EditorSection>
  );
}
