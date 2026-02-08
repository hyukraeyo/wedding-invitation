import React from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';

import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionAccordion } from '@/components/ui/Accordion';
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
  const { location, address, validationErrors } = useInvitationStore(
    useShallow((state) => ({
      location: state.location,
      address: state.address,
      validationErrors: state.validationErrors,
    }))
  );
  const isComplete = Boolean(location && address);
  const isInvalid = validationErrors.includes(props.value);

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
