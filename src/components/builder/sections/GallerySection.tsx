import React from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';

import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionAccordion } from '@/components/ui/Accordion';
import { useBuilderSection } from '@/hooks/useBuilder';
import { useInvitationStore } from '@/store/useInvitationStore';
import type { SectionProps } from '@/types/builder';

const GallerySectionContent = dynamic(() => import('./GallerySectionContent'), {
  loading: () => <div>로딩</div>,
  ssr: false,
});

const GallerySection = React.memo<SectionProps>(function GallerySection(props) {
  const { galleryLength } = useInvitationStore(
    useShallow((state) => ({
      galleryLength: state.gallery.length,
    }))
  );

  const isComplete = galleryLength > 0;
  const { isInvalid } = useBuilderSection(props.value, isComplete);

  return (
    <SectionAccordion
      title={<RequiredSectionTitle title="웨딩 갤러리" isComplete={isComplete} />}
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
    >
      <GallerySectionContent />
    </SectionAccordion>
  );
});

GallerySection.displayName = 'GallerySection';

export default GallerySection;
