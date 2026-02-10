import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { EditorSection } from '@/components/ui/EditorSection';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';

import LocationSectionContent from './LocationSectionContent';

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
    <EditorSection
      title={<RequiredSectionTitle title="예식 장소" isComplete={isComplete} />}
      isInvalid={isInvalid}
    >
      <LocationSectionContent />
    </EditorSection>
  );
});

export default LocationSection;
