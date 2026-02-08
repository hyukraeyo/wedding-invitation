import React from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';

import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionAccordion } from '@/components/ui/Accordion';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';

import styles from './LocationSection.module.scss';

const LocationSectionContent = dynamic(() => import('./LocationSectionContent'), {
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
    </div>
  ),
  ssr: false,
});

const LocationSection = React.memo<SectionProps>(function LocationSection(props) {
  const { location, address } = useInvitationStore(
    useShallow((state) => ({
      location: state.location,
      address: state.address,
    }))
  );

  const isComplete = Boolean(location && address);
  const { isInvalid } = useBuilderSection(props.value, isComplete);

  return (
    <SectionAccordion
      title={<RequiredSectionTitle title="예식 장소" isComplete={isComplete} />}
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
    >
      <LocationSectionContent onComplete={() => props.onToggle?.(false)} />
    </SectionAccordion>
  );
});

export default LocationSection;
