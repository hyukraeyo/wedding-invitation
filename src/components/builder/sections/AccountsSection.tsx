import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ACCOUNT_SAMPLES } from '@/constants/samples';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';
import { EditorSection } from '@/components/ui/EditorSection';
import { useBuilderSection } from '@/hooks/useBuilder';
import { htmlToPlainText } from '@/lib/richText';
import { isBlank } from '@/lib/utils';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';

import AccountsSectionContent from './AccountsSectionContent';

export default function AccountsSection(props: SectionProps) {
  const {
    accountsTitle,
    accountsSubtitle,
    accountsDescription,
    setAccountsTitle,
    setAccountsSubtitle,
    setAccountsDescription,
  } = useInvitationStore(
    useShallow((state) => ({
      accountsTitle: state.accountsTitle,
      accountsSubtitle: state.accountsSubtitle,
      accountsDescription: state.accountsDescription,
      setAccountsTitle: state.setAccountsTitle,
      setAccountsSubtitle: state.setAccountsSubtitle,
      setAccountsDescription: state.setAccountsDescription,
    }))
  );

  const plainDescription = useMemo(
    () => htmlToPlainText(accountsDescription),
    [accountsDescription]
  );

  const isComplete = Boolean(
    !isBlank(accountsTitle) && !isBlank(accountsSubtitle) && !isBlank(plainDescription)
  );

  const { isInvalid } = useBuilderSection(props.value, isComplete);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setAccountsSubtitle(sample.subtitle || '');
    setAccountsTitle(sample.title);
    setAccountsDescription(sample.content || '');
  };

  return (
    <EditorSection
      title="축의금 및 계좌번호"
      isInvalid={isInvalid}
      rightElement={
        <SectionSampleDialogAction
          items={ACCOUNT_SAMPLES}
          onSelect={handleSelectSample}
          triggerLabel="추천문구"
        />
      }
    >
      <AccountsSectionContent />
    </EditorSection>
  );
}
