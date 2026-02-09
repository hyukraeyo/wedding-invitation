import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { EditorSection } from '@/components/ui/EditorSection';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';

import GallerySectionContent from './GallerySectionContent';

const GallerySection = React.memo<SectionProps>(function GallerySection(props) {
  const { galleryLength } = useInvitationStore(
    useShallow((state) => ({
      galleryLength: state.gallery.length,
    }))
  );

  const isComplete = galleryLength > 0;
  const { isInvalid } = useBuilderSection(props.value, isComplete);

  return (
    <EditorSection
      title={<RequiredSectionTitle title="웨딩 갤러리" isComplete={isComplete} />}
      isInvalid={isInvalid}
    >
      <GallerySectionContent />
    </EditorSection>
  );
});

GallerySection.displayName = 'GallerySection';

export default GallerySection;
