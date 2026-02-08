import React from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionAccordion } from '@/components/ui/Accordion';
import type { SectionProps } from '@/types/builder';

const GallerySectionContent = dynamic(() => import('./GallerySectionContent'), {
  loading: () => <div>로딩</div>,
  ssr: false,
});

const GallerySection = React.memo<SectionProps>(function GallerySection(props) {
  const { galleryLength, validationErrors } = useInvitationStore(
    useShallow((state) => ({
      galleryLength: state.gallery.length,
      validationErrors: state.validationErrors,
    }))
  );
  const isComplete = galleryLength > 0;
  const isInvalid = validationErrors.includes(props.value);

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
