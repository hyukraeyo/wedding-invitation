import React from 'react';
import { EditorSection } from '@/components/ui/EditorSection';
import { useBuilderSection } from '@/hooks/useBuilder';
import type { SectionProps } from '@/types/builder';

import AccountsSectionContent from './AccountsSectionContent';

export default function AccountsSection(props: SectionProps) {
  const { isInvalid } = useBuilderSection(props.value);

  return (
    <EditorSection title="축의금 및 계좌번호" isInvalid={isInvalid}>
      <AccountsSectionContent />
    </EditorSection>
  );
}
