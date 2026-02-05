import React from 'react';
import dynamic from 'next/dynamic';
import { SectionAccordion } from '@/components/ui/Accordion';
import styles from './LocationSection.module.scss';
import type { SectionProps } from '@/types/builder';

const LocationSectionContent = dynamic(() => import('./LocationSectionContent'), {
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
    </div>
  ),
  ssr: false,
});

const LocationSection = React.memo<SectionProps>(function LocationSection(props) {
  return (
    <SectionAccordion
      title="예식 장소"
      value="location"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
    >
      <LocationSectionContent onComplete={() => props.onToggle?.(false)} />
    </SectionAccordion>
  );
});

export default LocationSection;
