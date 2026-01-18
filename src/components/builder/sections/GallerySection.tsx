import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import GallerySectionContent from './GallerySectionContent';
import type { SectionProps } from '@/types/builder';

const GallerySection = React.memo<SectionProps>(function GallerySection({ value, isOpen }) {
    const gallery = useInvitationStore(useShallow(state => state.gallery));
    return (
        <AccordionItem
            value={value}
            title="웨딩 갤러리"
            icon={ImageIcon}
            isOpen={isOpen}
            isCompleted={gallery.length > 0}
        >
            {isOpen ? <GallerySectionContent /> : null}
        </AccordionItem>
    );
});

export default GallerySection;
