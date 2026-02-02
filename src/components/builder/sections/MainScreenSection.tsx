import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SampleList } from '@/components/common/SampleList';
import { Button } from '@/components/ui/Button';
import { BottomCTA } from '@/components/ui/BottomCTA';
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

export default function MainScreenSection(props: SectionProps) {
  const setMainScreen = useInvitationStore((state) => state.setMainScreen);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

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
    <>
      <SectionAccordion
        title="메인 화면"
        value="main"
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
            추천문구
          </Button>
        }
      >
        <div style={{ paddingBottom: '16px' }}>
          <MainScreenSectionContent />
        </div>
      </SectionAccordion>

      <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen} mobileBottomSheet>
        <Dialog.Header title="추천 문구" />
        <Dialog.Body>{renderSampleList()}</Dialog.Body>
      </Dialog>
    </>
  );
}
