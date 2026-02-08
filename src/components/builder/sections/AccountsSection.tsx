import React from 'react';
import dynamic from 'next/dynamic';
import { SectionAccordion } from '@/components/ui/Accordion';
import { useInvitationStore } from '@/store/useInvitationStore';
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
  const validationErrors = useInvitationStore((state) => state.validationErrors);
  const isInvalid = validationErrors.includes(props.value);

  return (
    <SectionAccordion
      title="축의금 및 계좌번호"
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
    >
      <AccountsSectionContent />
    </SectionAccordion>
  );
}
