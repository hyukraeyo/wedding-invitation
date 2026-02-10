import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';
import { EditorSection } from '@/components/ui/EditorSection';
import { MAIN_TITLE_SAMPLES } from '@/constants/samples';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';

import MainScreenSectionContent from './MainScreenSectionContent';
import styles from './MainScreenSection.module.scss';

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
          layout="grid"
        />
      }
    >
      <div className={styles.contentWrap}>
        <MainScreenSectionContent />
      </div>
    </EditorSection>
  );
});

MainScreenSection.displayName = 'MainScreenSection';

export default MainScreenSection;
