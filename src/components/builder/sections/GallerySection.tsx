import React from 'react';
import dynamic from 'next/dynamic';
import { SectionAccordion } from '@/components/ui/Accordion';
import type { SectionProps } from '@/types/builder';

const GallerySectionContent = dynamic(() => import('./GallerySectionContent'), {
  loading: () => <div>로딩</div>,
  ssr: false,
});

const GallerySection = React.memo<SectionProps>(function GallerySection(props) {
  return (
    <SectionAccordion
      title="웨딩 갤러리"
      value="gallery"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
    >
      <GallerySectionContent />
    </SectionAccordion>
  );
});

export default GallerySection;
