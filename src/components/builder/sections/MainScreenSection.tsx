import React from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';

import styles from './MainScreenSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { MAIN_TITLE_SAMPLES } from '@/constants/samples';
import { EditorSection } from '@/components/ui/EditorSection';

const MainScreenSectionContent = dynamic(() => import('./MainScreenSectionContent'), {
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
    </div>
  ),
  ssr: false,
});

const MainScreenSection = React.memo<SectionProps>(function MainScreenSection(props) {
  const { imageUrl, setMainScreen } = useInvitationStore(
    useShallow((state) => ({
      imageUrl: state.imageUrl,
      setMainScreen: state.setMainScreen,
    }))
  );

  const isComplete = Boolean(imageUrl);
  const { isInvalid } = useBuilderSection(props.value, isComplete);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setMainScreen({
      title: sample.title,
      subtitle: sample.subtitle || '',
    });
  };

  return (
    <EditorSection
      title={<RequiredSectionTitle title="메인 화면" isComplete={isComplete} />}
      isInvalid={isInvalid}
      rightElement={
        <SectionSampleDialogAction
          items={MAIN_TITLE_SAMPLES}
          onSelect={handleSelectSample}
          triggerLabel="추천문구"
        />
      }
    >
      <div style={{ paddingBottom: '16px' }}>
        <MainScreenSectionContent />
      </div>
    </EditorSection>
  );
});

MainScreenSection.displayName = 'MainScreenSection';

export default MainScreenSection;
