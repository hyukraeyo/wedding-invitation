import React from 'react';
import dynamic from 'next/dynamic';
import { EditorSection } from '@/components/ui/EditorSection';
import { useBuilderSection } from '@/hooks/useBuilder';
import styles from './AccountsSection.module.scss';
import type { SectionProps } from '@/types/builder';

const AccountsSectionContent = dynamic(() => import('./AccountsSectionContent'), {
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
    </div>
  ),
  ssr: false,
});

export default function AccountsSection(props: SectionProps) {
  const { isInvalid } = useBuilderSection(props.value);

  return (
    <EditorSection title="축의금 및 계좌번호" isInvalid={isInvalid}>
      <AccountsSectionContent />
    </EditorSection>
  );
}
