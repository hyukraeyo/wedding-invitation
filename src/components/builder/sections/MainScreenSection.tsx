import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SampleList } from '@/components/common/SampleList';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';

import styles from './MainScreenSection.module.scss';

import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { MAIN_TITLE_SAMPLES } from '@/constants/samples';
import { SectionAccordion } from '@/components/ui/Accordion';

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
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const isComplete = Boolean(imageUrl);
  const { isInvalid } = useBuilderSection(props.value, isComplete);

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setMainScreen({
      title: sample.title,
      subtitle: sample.subtitle || '',
    });
    setIsSampleModalOpen(false);
  };

  const renderSampleList = () => (
    <SampleList items={MAIN_TITLE_SAMPLES} onSelect={handleSelectSample} />
  );

  return (
    <SectionAccordion
      title={<RequiredSectionTitle title="메인 화면" isComplete={isComplete} />}
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
      rightElement={
        <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen} mobileBottomSheet>
          <Dialog.Trigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Sparkles size={14} />
              추천문구
            </Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header title="추천 문구" />
            <Dialog.Body>{renderSampleList()}</Dialog.Body>
          </Dialog.Content>
        </Dialog>
      }
    >
      <div style={{ paddingBottom: '16px' }}>
        <MainScreenSectionContent />
      </div>
    </SectionAccordion>
  );
});

MainScreenSection.displayName = 'MainScreenSection';

export default MainScreenSection;
